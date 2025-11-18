import connectDB from '@/lib/mongodb';
import OldUsers from '@/app/models/oldusers';
import { NextRequest, NextResponse } from "next/server";
import AuthUser, { IAuthUser } from '@/app/models/authuser';
import { revalidatePath } from 'next/cache';

export async function GET( req: NextRequest,  context: { params: Promise<{ id: string }> } ) {
  try {
    await connectDB();
    const { id } = await context.params;
    let user = await AuthUser.findById(id);
    if (!user) user = await OldUsers.findById(id);
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
    const user = await OldUsers.findById(id);
    if (!user) return NextResponse.json({ msg: ["User not found"] }, { status: 404 });
    if (user.deleted) return NextResponse.json({ msg: ["User already deleted"] }, { status: 400 });
    const deleteResponse = await OldUsers.deleteOne(user);
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
    let user = await AuthUser.findById(id);
    if (!user) 
      return NextResponse.json({ msg: ["User not found"] }, { status: 404 });
    const json = await req.json();

    if (json.firstName || json.lastName) user.name = json.firstName;
    if (json.email) user.email = json.email;
    if (json.imageUrl) user.image = json.imageUrl;
    if( json.preferences ){
      if( !user.preferences ) {
          user.preferences = { beer: null };
          user.markModified('preferences');
          await user.save();
          user = await AuthUser.findById(id);
      }
      // Initialize preferences if it doesn't exist
      if (!user.preferences) {
        user.preferences = { beer: null };
      }
      // Update the beer preference
      if (json.preferences.beer !== undefined) {
        user.preferences.beer = json.preferences.beer;
      }
      // Mark as modified for Mongoose
      user.markModified('preferences');
    }

    user.updatedAt = new Date();
    await user.save();

    revalidatePath('/account');
    return new NextResponse(user, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to user User. " + error], error }, { status: 500 });
  }
}
