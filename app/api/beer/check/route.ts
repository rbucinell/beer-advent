import { beerTooSimilar } from "@/app/util/BeerProximity";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req:NextRequest ) {
    try{
        const queryParams = req.nextUrl.searchParams;
        const similarityValidation = await beerTooSimilar(queryParams.get('beer') || '', queryParams.get('brewer') || '');
        return NextResponse.json(similarityValidation, { status: 200 });
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to send message"], error  }, { status: 500 });
    }
}