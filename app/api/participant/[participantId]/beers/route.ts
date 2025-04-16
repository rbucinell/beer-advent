import connectDB from '@/app/lib/mongodb';
import Beer from '@/app/models/beer';
import Participant, { IParticipant } from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";
import { Types } from 'mongoose';

export async function GET(req:NextRequest, route: { params: Promise<{ participantId: string }> }) {
    try {
        await connectDB();
        const { participantId } = await route.params;

        const participant = await Participant.findById( participantId ) as IParticipant;
        if( !participant ) return NextResponse.json( { msg: ["Participant not found"] }, { status: 404 } );

        const beers = await Promise.all(
            participant.beers.map( async (beerId:Types.ObjectId) =>  {
            const beer = await Beer.findById( beerId );
            return beer;
        }));

        return NextResponse.json( beers , { status: 200 } );

    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve Participant. " + error], error  }, { status: 500 });
    }
}