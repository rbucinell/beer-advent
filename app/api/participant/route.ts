import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/event';
import Participant from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";

export async function GET( req:NextRequest ) {
    try{        
        console.log( req.nextUrl.searchParams );
        const event = req.nextUrl.searchParams.get('event');
        await connectDB();
        const participantResponse = await Participant.find({ event });
        return NextResponse.json(participantResponse);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve Participants"], error  }, { status: 500 });
    }
}