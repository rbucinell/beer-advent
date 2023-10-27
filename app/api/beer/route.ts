import mongoose from 'mongoose';
import connectDB from '@/app/lib/mongodb';
import { NextRequest, NextResponse } from "next/server";
import jaroWinkler from 'jaro-winkler';
import Participant, {IParticipant} from '@/app/models/participant';
import Beer, {IBeer} from '@/app/models/beer';

export async function GET( req:NextRequest ) {
    try{
        await connectDB();
        const res = await Beer.find({});
        return NextResponse.json({beers: res})
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to send message"] });
    }
}

export async function POST( req:NextRequest ) {
    const json = await req.json();
    const { beer, brewer, beerType, abv, beerAdvocate, untapd, img, participant:IParticipant} = json;

    const existingBeers = await Beer.find();
    console.log( existingBeers.length);
    const comparisons = existingBeers.map( (existingBeer:IBeer) => {
        return { 
            ...existingBeer,
            beerSimilarity:jaroWinkler(existingBeer.beer, beer),
            brewerSimiliatriy: jaroWinkler(existingBeer.brewer, brewer),
            beerAdvocateSimiliatriy: jaroWinkler(existingBeer.beeradvocate, beerAdvocate)
        }
    });

    if( Math.max(...comparisons.map( b => b.beerSimilarity)) >= .8 &&
        Math.max(...comparisons.map( b => b.brewerSimiliatriy)) >= .8 ) {
        return NextResponse.json({error:true, msg: [`"${beer}" by ${brewer}. Too close to tell, text Ryan`]});
    } 
    console.log( comparisons[0] );
    /*
    const comparisons = existingBeers.map( b => { 
        "beer": b.name, 
        "similarity":jaroWinkler(b,beer) 
    });
    
    console.log( existingBeers);
    */

    console.log( json );
    return NextResponse.json({
        success: true,
        msg: ["Message sent failed", "Message sent failed"]
    });

    
    try{
        await connectDB();
        await Beer.create({ ...json, state:'pending' });
        
        return NextResponse.json({
            msg: ["Message sent successfully"],
            success: true,
        });
    }
    catch(error){
        if( error instanceof mongoose.Error.ValidationError){
            let errorList = [];
            // for( let e in error.errors ){
            //     errorList.push( error.errors[e].message);
            // }
            return NextResponse.json({msg: errorList})
        }
        else{
            console.log( error );
            return NextResponse.json({msg: ["Unable to send message"] });
        }
    }
}