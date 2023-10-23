import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/event';
import Participant from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";

export async function GET( req ) {
    try{
        await connectDB();
        const eventResponse = await Event.find({ year: (new Date()).getFullYear() });
        console.log( eventResponse );
        //const participantResponse = await Participant.find({ event: eventResponse._id });
        const participantResponse = await Participant.find();
       //console.log( participantResponse );
        return NextResponse.json(participantResponse);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve Participants"] });
    }
}