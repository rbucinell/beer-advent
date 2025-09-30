import { NextRequest, NextResponse } from "next/server";
import connectDB from '@/lib/mongodb';
import { Types } from 'mongoose';
import Event from '@/app/models/event';
import Participant, { IParticipant } from '@/app/models/participant';
import AuthUser from '@/app/models/authuser';
import OldUsers from '@/app/models/oldusers';
import { User } from "better-auth";

export async function POST(req: NextRequest, route: { params: Promise<{ year: string }> }) {
  try {
    const { year } = await route.params;
    console.log("[POST] User leaving event", year);

    const user: User = (await req.json()).user;
    const event = await Event.findOne({ year });
    const eventParticipants = await Participant.find<IParticipant>({ event });
    const authUser = await AuthUser.findById(user.id);

    //Validation
    if (!event) return NextResponse.json({ msg: ["Event not found"] }, { status: 404 });
    if (!authUser) return NextResponse.json({ msg: ["User Not Found."] }, { status: 404 });

    const participatingUser = eventParticipants.find( (p: IParticipant) => p.user.toString() === authUser._id.toString());

    if( !participatingUser ){
      return NextResponse.json({ msg: "User is already not participating" }, { status: 403 });
    }

    const removedParticipant = await Participant.deleteOne( participatingUser );

    return NextResponse.json( removedParticipant, { status: 200 });


  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Error updating event", error: (error as Error).message }, { status: 500 });
  }
}
