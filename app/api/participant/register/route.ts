import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/event';
import User from '@/app/models/user';
import Participant from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from '@clerk/backend';
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function POST( req:NextRequest, res:NextResponse ) {
    try{
        //Check Paramters
        let { event, user } = await req.json();

        //Get Data
        await connectDB();
        //let clerkUser = await clerkClient.users.getUser( user );
        if( !user ) {
            return NextResponse.json({ msg: ["Could not find user, try logging in"], success: false }, { status: 404 });
        }
        event = await Event.findOne({ _id: event });
        if( !event ) {
            return NextResponse.json({ msg: ["Could not find event"], success: false }, { status: 400 });
        }

        let dbUser = await User.findOne({ clerkId: user.id });
        if( !dbUser ) {
            dbUser = await User.create({
                clerkId: user.id,
                fullName: user.fullName,
                role: 'user'
            })
        }

        let participant = await Participant.findOne({ event: event._id, user: user._id });
        if( participant ) {
            return NextResponse.json({
                msg: ["Participant already registered"],
                success: false,
            });
        }else{
            participant = await Participant.create({
                event: event._id,
                user: dbUser._id,
                name: user.fullName,
                xmas: null,
                days: [ null, null ],
                beers: [ null, null ]
            })
        }
        return NextResponse.json({}, { status: 201 });
        //res.status(200).json({ message: 'Hello from Next.js!' })
        //return NextResponse.json({"msg": "Participant Registered"});
        // await connectDB();
        // const year = req.nextUrl.searchParams.get('year') || (new Date()).getFullYear();
        // const eventResponse = await Event.find({ year });
        // //const participantResponse = await Participant.find({ event: eventResponse._id });
        // const participantResponse = await Participant.find( { event: eventResponse[0]._id } );
        // return NextResponse.json(participantResponse);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve Participants"] });
    }
}