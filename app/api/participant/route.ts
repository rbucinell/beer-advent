import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/event';
import Participant from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";

export async function GET( req:NextRequest ) {
    try{
        await connectDB();
        const eventResponse = await Event.find({ year: (new Date()).getFullYear() });
        //const participantResponse = await Participant.find({ event: eventResponse._id });
        const participantResponse = await Participant.find();
        return NextResponse.json(participantResponse);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve Participants"] });
    }
}