import mongoose, { Types } from 'mongoose';
import connectDB from '@/app/lib/mongodb';
import { NextRequest, NextResponse } from "next/server";
import jaroWinkler from 'jaro-winkler';
import Participant, {IParticipant} from '@/app/models/participant';
import Beer, {IBeer} from '@/app/models/beer';
import User from '@/app/models/user';

export async function GET( req:NextRequest ) {
    try{
        await connectDB();
        const res = await Beer.find( Object.fromEntries(req.nextUrl.searchParams) );
        return NextResponse.json(res)
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to send message"], error  }, { status: 500 });
    }
}

export async function POST( req:NextRequest ) {
    try
    {
        await connectDB();
        const json = await req.json();
        const beer:IBeer = json;
        const participant:IParticipant = json.participant;
        const user = await User.findById( participant.user );

        //Does Participant already have two beers?
        participant.beers = participant.beers.filter( _ => _ != null);
        if( participant.beers.length >= 2 ) {
            return NextResponse.json({msg: ["User already submitted two beers"] , status: 400});
        }

        //Beer is too similar to an existing beer
        const existingBeers:IBeer[] = await Beer.find();
        const comparisons = existingBeers.map( (existingBeer:IBeer) => {
            return { 
                beerSimilarity:jaroWinkler(existingBeer.beer || '', beer.beer || ''),
                brewerSimiliatriy: jaroWinkler(existingBeer.brewer || '', beer.brewer || ''),
                beerAdvocateSimiliatriy: jaroWinkler(existingBeer.beeradvocate || '', beer.beeradvocate || ''),
                beer:existingBeer,
            }
        });
        comparisons.sort( (a,b) => b.beerSimilarity - a.beerSimilarity );
        
        const closestComp:IBeer = comparisons[0].beer;
        if( Math.max(...comparisons.map( b => b.beerSimilarity)) >= .85)
        {
            if( Math.max(...comparisons.map( b => b.brewerSimiliatriy)) >= .65 )
            {
                return NextResponse.json({
                    error:true, 
                    msg: [`"${beer.beer}" by ${beer.brewer}. Too close to "${ closestComp.beer}" by ${ closestComp.brewer}. Please tell, text Ryan if this is not correct.`]
                });
            }
        }


        //Create Beer
        beer.person = participant.name;
        beer.user = user._id;
        beer.day = participant.days[participant.beers.length];

        const created = await Beer.create( beer );

        //Update Participant
        const updatingParticipant = await Participant.findById( json.participant._id );
        if( updatingParticipant){

            const participantBeers = updatingParticipant.beers.filter( (_: Types.ObjectId|null) => _ != null );
            participantBeers.push(created._id);
            updatingParticipant.beers = participantBeers;
            await updatingParticipant.save();
        }


        
        




        // let newBeer = await Beer.create({
        //     ...json,
        //     state: 'pending',
        //     user: user._id,
        //     year: new Date().getFullYear(),
        //     day: participant.days[participantBeers.length],
        //     person: participant.name
        // });
        
        // const today = new Date();
        // beer.year = today.getFullYear();
        // beer.day = participant.days[participantBeers.length];
        
        // beer.person = participant.name;
        // //todo: fix day here
        
        // await Beer.create({...json, state: 'pending'});

        //participant.beers.push( beer.beer )
        //await Participant.findByIdAndUpdate( participant._id, { beers: participant.beers });
        
        return NextResponse.json({ msg: ["Beer submitted successfully"], success: true }, { status: 201} );
    }
    catch(error){
        if( error instanceof mongoose.Error.ValidationError){
            let errorList:string[] = [];
            for( let e in error.errors ){
                errorList.push( error.errors[e].message);
            }
            return NextResponse.json({msg: errorList})
        }
        else{
            console.log( error );
            return NextResponse.json({msg: ["Unable to send message"], error  }, { status: 500 });
        }
    }
}