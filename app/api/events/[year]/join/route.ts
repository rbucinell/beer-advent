import { NextRequest, NextResponse } from "next/server";
import connectDB from '@/lib/mongodb';
import Event from '@/app/models/event';
import Participant from '@/app/models/participant';
import OldUsers from '@/app/models/oldusers';
import { User as AuthUser } from "better-auth";

export async function POST(req: NextRequest, route: { params: Promise<{ year: string }> }) {
  try {
    const { year } = await route.params;
    console.log("[POST] User joining event", year);

    const requestBody = await req.json();
    const user: AuthUser = requestBody.user;

    const event = await Event.findOne({ year });
    const eventParticipants = await Participant.find({ event });

    console.log(event);
    console.log(eventParticipants);




    console.log(`Event year ${year}. User ${requestBody.userId} joining`);

    return new NextResponse(null, { status: 200 });

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
