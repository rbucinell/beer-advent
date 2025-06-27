import connectDB from '@/lib/mongodb';
import OldUsers from '@/app/models/oldusers';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    return NextResponse.json(await OldUsers.find());
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to retrieve Users. " + error], error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const json = await req.json();
    if (!json.email) return NextResponse.json({ msg: ["Email is required"] }, { status: 400 });
    if (!json.firstName) return NextResponse.json({ msg: ["First name is required"] }, { status: 400 });
    if (!json.lastName) return NextResponse.json({ msg: ["Last name is required"] }, { status: 400 });

    const existing = await OldUsers.findOne({ email: json.email });
    if (existing)
      return NextResponse.json({ msg: ["User already exists"] }, { status: 400 });

    const user = new OldUsers(json);
    await user.save();
    return new NextResponse(user, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to create User. " + error], error }, { status: 500 });
  }
}
