import connectDB from '@/app/lib/mongodb';
import Participant from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";

export async function GET( req:NextRequest ) {
    try{
        await connectDB();
        const id = req.nextUrl.pathname.split('/').pop();
        if( !id ) return NextResponse.json( {}, { status: 200 } );
        const event = await Participant.findOne({ _id:id })
        return NextResponse.json(event);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve participant from Id"], error }, { status: 500 });
    }
}