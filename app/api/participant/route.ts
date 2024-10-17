import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/event';
import User from '@/app/models/user';
import { IEventParticipant } from '@/app/models/event-participant';
import Participant from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from '@clerk/backend';
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET( req:NextRequest ) {
    try{
        await connectDB();
        const year = req.nextUrl.searchParams.get('year') || (new Date()).getFullYear();
        const event = await Event.findOne({ year });
        //const participantResponse = await Participant.find({ event: eventResponse._id });
        let participants = await Participant.find( { event: event._id } );
        let eventParticipants: IEventParticipant[] = [];
        for( let p of participants ) {
            let { beers, days, event } = p;

            let dbXmas = await User.findOne({ _id: p.xmas?._id });
            let xmas = dbXmas != null ? await clerkClient.users.getUser( dbXmas?.clerkId ): null;

            let dbUser = await User.findOne({ _id: p.user?._id });
            let user = dbUser != null ? await clerkClient.users.getUser( dbUser.clerkId ): null;
            const name = user?.fullName ?? user?.lastName;
            const role = dbUser?.role;

            eventParticipants.push({
                _id: p._id,
                event,
                user ,
                xmas,
                days,
                beers,
                role,
                name
            } as IEventParticipant);
        }

        return NextResponse.json(eventParticipants, { status: 200 });
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve Participants"] });
    }
}