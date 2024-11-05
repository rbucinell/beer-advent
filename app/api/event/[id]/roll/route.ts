import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/event';
import Participant from '@/app/models/participant';
import User from '@/app/models/user';
import { NextRequest, NextResponse } from "next/server";

const shuffle = (a:number,b:number) => 0.5 - Math.random();

export async function POST( req:NextRequest ) {
    
    try {

        await connectDB();
        const json = await req.json();

        //Ensure Inputs
        if( !json.days && !json.xmas ){
            return NextResponse.json( { msg: ["days or xmas is required"] }, { status: 400 } );
        }

        //Get Event
        const regex = /\/api\/event\/([^\/]+)\//;
        const match = req.nextUrl.pathname.match(regex);
        if( !match ) return NextResponse.json( { msg: ["Event id is required"] }, { status: 400 } );
        const event = await Event.findById( match[1] );
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

        

        
        // await connectDB();
        // const json = await req.json();
        // if( !json.user ) return NextResponse.json( { msg: ["user id is required"] }, { status: 400 } );

        // const regex = /\/api\/event\/([^\/]+)\/participant/;
        // const match = req.nextUrl.pathname.match(regex);
        // if( !match ) return NextResponse.json( { msg: ["event id is required"] }, { status: 400 } );
        // const event = await Event.findById( match[1] );
        // if( !event ) return NextResponse.json( { msg: ["Event not found"] }, { status: 404 } );

        // const user = await User.findById( json.user )
        // if( !user ) return NextResponse.json( { msg: ["User not found"] }, { status: 404 } );

        // const participants = await Participant.find({ event: event });


        // const existing = participants.find( _ => _.user?._id.toString() === user._id.toString() );
        // if( existing ) return NextResponse.json( { msg: ["User already added as a participant"] }, { status: 400 } );

        // const existingByLastName = participants.find( _ => _.name.localeCompare( user.lastName, 'en', { sensitivity: 'base' } ) === 0 );
        // if( existingByLastName ) {

        //     existingByLastName.user = user;
        //     existingByLastName.name = user.firstName + ' ' + user.lastName;
        //     await existingByLastName.save();

        //     return NextResponse.json( { msg: ["User already added as a participant"] }, { status: 400 } );
        // }

        // const participant = await Participant.create( { 
        //     event: event, 
        //     name: user.firstName + ' ' + user.lastName, 
        //     user: user,
        //     xmas: null,
        //     days: [null, null],
        //     beers: [null, null]
        // } );


        // return new NextResponse( participant, { status: 201 } );

        // // if( !json.email ) return NextResponse.json( { msg: ["Email is required"] }, { status: 400 } );
        // // if( !json.firstName ) return NextResponse.json( { msg: ["First name is required"] }, { status: 400 } );
        // // if( !json.lastName ) return NextResponse.json( { msg: ["Last name is required"] }, { status: 400 } );

        // // const existing = await User.findOne({ email: json.email });
        // // if( existing ) 
        // //     return NextResponse.json( { msg: ["User already exists"] }, { status: 400 } );

        // // const user = new User( json );
        // // await user.save();
        // return new NextResponse( null, { status: 201 } );
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to roll for Event"], error  }, { status: 500 });
    }
}
