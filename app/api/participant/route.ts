import connectDB from '@/app/lib/mongodb';
import Participant from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";

export async function GET( req:NextRequest ) {
    try{
        const event = req.nextUrl.searchParams.get('event');
        await connectDB();
        const participantResponse = await Participant.find({ event });
        return NextResponse.json(participantResponse);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve Participants"], error  }, { status: 500 });
    }
}

export async function PUT( req:NextRequest ) {
    try{
        await connectDB();
        const json = await req.json();
        const id = req.nextUrl.searchParams.get('id');
        const participant = await Participant.findOne({ _id:id });
        if( !participant ) return NextResponse.json( { msg: ["Participant not found"] }, { status: 404 } );

        //Update the properties
        if( json.user ) participant.user = json.user;
        if( json.name ) participant.name = json.name;
        if( json.days ) participant.days = json.days;
        if( json.beers ) participant.beers = json.beers;
        if( json.xmas ) participant.xmas = json.xmas;
        if( json.event ) participant.event = json.event;

        //Save and close
        await participant.save();
        return NextResponse.json(participant);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to update Participant"], error  }, { status: 500 });
    }
}