import connectDB from '@/lib/mongodb';
import Event from '@/app/models/event';
import { Error } from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

//Get a particular event
export async function GET(req: NextRequest, route: { params: Promise<{ year: string }> }) {
  try {
    const { year } = await route.params;
    console.log("[GET] Event for year", year);
    await connectDB();
    const event = await Event.findOne<Event>({ year });
    if (!event) {
      return NextResponse.json({ msg: `Event for ${year} not found` }, { status: 404 });
    }
    return NextResponse.json<Event>(event);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to retrieve event from Id"], error }, { status: 500 });
  }
}

// # To update particular event.
export async function PUT(req: NextRequest, route: { params: Promise<{ year: string }> }) {
  try {
    const { year } = await route.params;
    console.log("[PUT] Update Event year", year);
    await connectDB();
    const query = { year };
    const requestBody = await req.json();
    console.log('query:', query, 'requestBody:', requestBody)
    const updateResponse = await Event.findOneAndUpdate(query, requestBody, { includeResultMetadata: true });
    console.log('Event [PUT], Event.findOneAndUpdate: ', updateResponse);
    return updateResponse.ok === 1
      ? new NextResponse(null, { status: 204 })
      : new NextResponse(updateResponse.value, { status: 400 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Error updating event", error: (error as Error).message }, { status: 500 });
  }
}

// # To delete particular user
export async function DELETE(req: NextRequest, route: { params: Promise<{ year: string }> }) {
  try {
    const { year } = await route.params;
    console.log("[DELETE] Event year", year);
    await connectDB();
    const query = { year };
    const updateResponse = await Event.findOneAndDelete(query);
    return NextResponse.json({ deleted: updateResponse }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Error updating event", error: (error as Error).message }, { status: 500 });
  }
}
