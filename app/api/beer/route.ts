import mongoose from 'mongoose';
import connectDB from '@/app/lib/mongodb';
import { NextRequest, NextResponse } from "next/server";
import jaroWinkler from 'jaro-winkler';
import {IParticipant} from '@/app/models/participant';
import Beer, {IBeer} from '@/app/models/beer';

export async function GET( req:NextRequest ) {
    console.log( req.nextUrl.searchParams );
    try{
        await connectDB();
        const res = await Beer.find({});
        return NextResponse.json(res)
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to send message"] });
    }
}

export async function POST( req:NextRequest ) {
    try
    {
        const json = await req.json();
        let beer:IBeer = json;
        let participant:IParticipant = json.participant;
        const existingBeers:IBeer[] = await Beer.find();
        const comparisons = existingBeers.map( (existingBeer:IBeer) => {
            return { 
                beerSimilarity:jaroWinkler(existingBeer.beer || '', beer.beer || ''),
                brewerSimiliatriy: jaroWinkler(existingBeer.brewer || '', beer.brewer || ''),
                beerAdvocateSimiliatriy: jaroWinkler(existingBeer.beeradvocate || '', beer.beeradvocate || ''),
                ...existingBeer,
            }
        });

        comparisons.sort( (a,b) => b.beerSimilarity - a.beerSimilarity );
        console.log( comparisons[0])

        if( Math.max(...comparisons.map( b => b.beerSimilarity)) >= .85)
        {
            if( Math.max(...comparisons.map( b => b.brewerSimiliatriy)) >= .85 ) {
                return NextResponse.json({error:true, msg: [`"${beer.beer}" by ${beer.brewer}. Too close to tell, text Ryan`]});
            }
        }

        let participantBeers = existingBeers.filter( b => b.person === participant.name);
        console.log( participantBeers );

        if( participantBeers.length >= 2 ) {
            return NextResponse.json({msg: ["User already submitted two beers"] });
        }
        

        const today = new Date();
        beer.year = today.getFullYear();
        beer.day = participant.days[participantBeers.length];
        
        beer.person = participant.name;
        //todo: fix day here
        await connectDB();
        await Beer.create({...json, state: 'pending'});

        //participant.beers.push( beer.beer )
        //await Participant.findByIdAndUpdate( participant._id, { beers: participant.beers });
        
        return NextResponse.json({
            msg: ["Message sent successfully"],
            success: true,
        });
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
            return NextResponse.json({msg: ["Unable to send message"] });
        }
    }
}