import connectDB from '@/lib/mongodb';
import User from '@/app/models/user';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, route: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await route.params;
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ msg: ["User not found"] }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to retrieve User. " + error], error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, route: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await route.params;
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ msg: ["User not found"] }, { status: 404 });
    if (user.deleted) return NextResponse.json({ msg: ["User already deleted"] }, { status: 400 });
    const deleteResponse = await User.deleteOne(user);
    if (!deleteResponse.deletedCount) return NextResponse.json({ msg: ["Unable to delete User"] }, { status: 500 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to delete User. " + error], error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, route: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await route.params;
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ msg: ["User not found"] }, { status: 404 });
    const json = await req.json();

    if (json.firstName) user.firstName = json.firstName;
    if (json.lastName) user.lastName = json.lastName;
    if (json.email) user.email = json.email;
    if (json.imageUrl) user.imageUrl = json.imageUrl;
    await user.save();
    return new NextResponse(user, { status: 204 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to user User. " + error], error }, { status: 500 });
  }
}
