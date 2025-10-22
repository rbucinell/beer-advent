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
    console.log("[POST] User joining event", year);

    const user: User = (await req.json()).user;
    const event = await Event.findOne({ year });
    const eventParticipants = await Participant.find<IParticipant>({ event });
    const authUser = await AuthUser.findById(user.id);

    //Validation
    if (!event) return NextResponse.json({ msg: ["Event not found"] }, { status: 404 });
    if (!authUser) return NextResponse.json({ msg: ["User Not Found."] }, { status: 404 });

    if (eventParticipants.some((p: IParticipant) => p.user.toString() === authUser._id.toString())) {
      return NextResponse.json({ msg: "User already participating" }, { status: 403 });
    }

    const addedParticipant = await Participant.create({
      event,
      name: user.name,
      user: authUser,
      xmas: null,
      days: [null, null],
      beers: [null, null]
    });



    return NextResponse.json(await Participant.find<IParticipant>({ event }), { status: 200 });

    // await connectDB();
    // const query = { year };
    // const requestBody = await req.json();
    // console.log('query:', query, 'requestBody:', requestBody)
    // const updateResponse = await Event.findOneAndUpdate(query, requestBody, { includeResultMetadata: true });
    // console.log('Event [PUT], Event.findOneAndUpdate: ', updateResponse);
    // return updateResponse.ok === 1
    //   ? new NextResponse(null, { status: 204 })
    //   : new NextResponse(updateResponse.value, { status: 400 });
  } catch (error) {
    console.log(error);
    // return NextResponse.json({ msg: "Error updating event", error: (error as Error).message }, { status: 500 });
  }
}
