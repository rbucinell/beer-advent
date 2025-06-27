import connectDB from '@/lib/mongodb';
import Event from '@/app/models/event';
import Participant from '@/app/models/participant';
import OldUsers from '@/app/models/oldusers';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, route: { params: Promise<{ year: string }> }) {
  try {
    const { year } = await route.params;
    console.log("[GET] Event get participants for year", year);
    await connectDB();
    const event = await Event.findOne({ year });
    const participantResponse = await Participant.find({ event });
    return NextResponse.json(participantResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to retrieve Participants"], error }, { status: 500 });
  }
}

export async function POST(req: NextRequest, route: { params: Promise<{ year: string }> }) {
  try {
    const { year } = await route.params;
    console.log(`[POST] Event ${year} register participant`);
    await connectDB();
    const json = await req.json();

    const event = await Event.findOne({ year });
    if (!event) return NextResponse.json({ msg: ["Event not found"] }, { status: 404 });

    if (!json.user) return NextResponse.json({ msg: ["user id is required"] }, { status: 400 });

    const user = await OldUsers.findById(new Types.ObjectId(json.user));
    if (!user) return NextResponse.json({ msg: ["User not found"] }, { status: 404 });

    const participants = await Participant.find({ event: event });

    const existing = participants.find(_ => _.user?._id.toString() === user._id.toString());
    if (existing) return NextResponse.json({ msg: ["User already added as a participant"] }, { status: 400 });

    const existingByLastName = participants.find(_ => _.name.localeCompare(user.lastName, 'en', { sensitivity: 'base' }) === 0);
    if (existingByLastName) {

      existingByLastName.user = user;
      existingByLastName.name = user.firstName + ' ' + user.lastName;
      await existingByLastName.save();

      return NextResponse.json({ msg: ["User already added as a participant"] }, { status: 400 });
    }

    const participant = await Participant.create({
      event: event,
      name: user.firstName + ' ' + user.lastName,
      user: user,
      xmas: null,
      days: [],
      beers: []
    });


    return new NextResponse(participant, { status: 201 });

    // if( !json.email ) return NextResponse.json( { msg: ["Email is required"] }, { status: 400 } );
    // if( !json.firstName ) return NextResponse.json( { msg: ["First name is required"] }, { status: 400 } );
    // if( !json.lastName ) return NextResponse.json( { msg: ["Last name is required"] }, { status: 400 } );

    // const existing = await User.findOne({ email: json.email });
    // if( existing )
    //     return NextResponse.json( { msg: ["User already exists"] }, { status: 400 } );

    // const user = new User( json );
    // await user.save();
    return new NextResponse(null, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to create User. " + error], error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, route: { params: Promise<{ year: string }> }) {
  try {
    const { year } = await route.params;
    const json = await req.json();
    if (!json.user) return NextResponse.json({ msg: ["user id is required"] }, { status: 400 });

    const event = await Event.findOne({ year });
    if (!event) return NextResponse.json({ msg: ["Event not found"] }, { status: 404 });

    await connectDB();
    const user = await OldUsers.findById(json.user)
    if (!user) return NextResponse.json({ msg: ["User not found"] }, { status: 404 });

    //delete partipant by the attached User
    const participants = await Participant.find({ event: event.id });
    const existing = participants.find(_ => _.user?._id.toString() === user._id.toString());
    if (existing) {
      await Participant.deleteOne(existing);
      return new NextResponse(null, { status: 204 });
    }

    //delete partipant by the last name
    const existingByLastName = participants.find(_ => _.name.localeCompare(user.lastName, 'en', { sensitivity: 'base' }) === 0);
    if (existingByLastName) {
      await Participant.deleteOne(existingByLastName);
      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse("User Id not found", { status: 404 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to create User. " + error] }, { status: 500 });
  }
}
