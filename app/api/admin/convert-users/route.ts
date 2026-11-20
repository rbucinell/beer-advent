import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/app/models/event';
import mongoose, { Error } from 'mongoose';
import OldUsers from '@/app/models/oldusers';
import AuthUser, { IAuthUser } from "@/app/models/authuser";
import Participant, { IParticipant } from '@/app/models/participant';

import { NextRequest, NextResponse } from "next/server";
import Beer from '@/app/models/beer';

export async function POST(req: NextRequest) {
    await connectDB();
    const {currentUserId, oldUserId, deleteOldUser} = await req.json();
    const user = await AuthUser.findById( currentUserId );
    
    await Participant.updateMany(
        { user: oldUserId },
        { $set: { user: currentUserId} }
    );

    await Beer.updateMany(
        { user: oldUserId },
        { $set: { user: currentUserId, person: user.name } }
    );
    
    if( deleteOldUser ) {
        const response = await OldUsers.findByIdAndDelete( oldUserId );
        console.log( response );
    }

    return NextResponse.json({ 
        msg: "User Deleted Successfully", 
        success: true 
    }, { status: 201 });
}