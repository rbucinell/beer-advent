import { beerTooSimilar } from "@/app/util/BeerProximity";
import { NextRequest, NextResponse } from "next/server";
import { BeerSimilarityValidation } from "./BeerSimilarityValidation";

export async function GET( req:NextRequest ) {
    try{
        const queryParams = req.nextUrl.searchParams;
        console.log( queryParams.get('beer'), queryParams.get('brewer'));
        const similarityValidation = await beerTooSimilar(queryParams.get('beer') || '', queryParams.get('brewer') || '');
        return NextResponse.json(similarityValidation, { status: 200 });
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to send message"], error  }, { status: 500 });
    }
}