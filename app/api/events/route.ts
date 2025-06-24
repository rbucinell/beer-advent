import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/app/models/event';
import mongoose, { Error } from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

/**
 * Get all events
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    let response = await Event.find();
    response.sort((a, b) => a.year - b.year);
    return NextResponse.json(response);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: ["Unable to retrieve events"], err }, { status: 500 });
  }
}

/**
 * Create event
 */

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const requestBody = await req.json();
    const event: IEvent = requestBody;

    const existing = await Event.findOne({ year: event.year });
    if (existing) {
      return NextResponse.json({ msg: "Event already exists", event: existing }, { status: 409 });
    }

    if (!event.year) {
      return NextResponse.json({ msg: "Event requires a year" }, { status: 400 });
    }

    //Update model if necessary
    if (!event._id) event._id = new mongoose.Types.ObjectId();
    if (!event.name) event.name = `Beer Advent ${event.year}`;

    const response = await Event.create(event);
    console.log(response);

    return NextResponse.json({ event: response }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Error in creating an event", error: (err as Error).message }, { status: 500 });
  }
}
