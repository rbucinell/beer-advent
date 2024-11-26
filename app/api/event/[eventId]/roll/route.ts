import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/event';
import Participant from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";

const shuffle = (a:number,b:number) => 0.5 - Math.random();

export async function POST( req:NextRequest, route: { params: { eventId: string }} ) {
    
    try {

        await connectDB();
        const { eventId } = route.params;
        const json = await req.json();
        //Ensure Inputs
        if( !json.days && !json.xmas ){
            return NextResponse.json( { msg: ["days or xmas is required"] }, { status: 400 } );
        }

        //Get Event
        const event = await Event.findById( eventId );
        if( !event ) return NextResponse.json( { msg: ["Event not found"] }, { status: 404 } );

        //Get Participants       
        const participants = await Participant.find({ event: event });

        if( json.days ){
            
            let lowerNumbers = new Array(12).fill(0).map((_, index) => index + 1);
            lowerNumbers.sort( shuffle );
            let upperNumbers = new Array(12).fill(0).map((_, index) => index + 13);
            upperNumbers.sort( shuffle );

            for( let i = 0; i < participants.length; i++ ){
                let participant = participants[i];
                participant.days = [ lowerNumbers[i], upperNumbers[i] ];
                await participant.save();
            }
        }

        if( json.xmas ) {
            console.log( "Rolling Xmas" );
            let santas = participants.map( p => p._id );
            let rot = Math.random() * participants.length + 1;
            for( let i = 0; i < rot; i++ ){
                santas.push( santas.shift() );
            }

            for( let participant of participants ) {            
                participant.xmas = santas.shift();
                console.log( participant.xmas );
                await participant.save();
            }
            
        }
        return NextResponse.json( { msg: ["Rolling Sucess"] }, { status: 200 } );
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to roll for Event"], error  }, { status: 500 });
    }
}
