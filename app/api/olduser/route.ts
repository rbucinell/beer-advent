import connectDB from '@/lib/mongodb';
import OldUsers from '@/app/models/oldusers';
import AuthUser from '@/app/models/authuser';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest ) {
  try {
    await connectDB();
    
    const { username } = Object.fromEntries( new URL( req.url).searchParams );

    if( username ){
      return NextResponse.json([...await OldUsers.find( {username: username})] );
    }else{
    return NextResponse.json([...await OldUsers.find()]);
  } 
    //return NextResponse.json(await OldUsers.find());
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to retrieve Old Users. " + error], error }, { status: 500 });
  }
}