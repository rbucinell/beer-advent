import connectDB from '@/app/lib/mongodb';
import Participant from '@/app/models/participant';
import { NextResponse } from "next/server";

export async function GET( req ) {
    try{
        await connectDB();
        const participantResponse = await Participant.find();
        return NextResponse.json(participantResponse);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve event config"] });
    }
}