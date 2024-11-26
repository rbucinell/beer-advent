import connectDB from '@/app/lib/mongodb';
import Event from '@/app/models/event';
import { NextRequest, NextResponse } from "next/server";

export async function GET( req:NextRequest ) {
    try{
        await connectDB();
        const id = req.nextUrl.pathname.split('/').pop();
        const event = await Event.findOne({ _id:id })
        return NextResponse.json(event);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve event from Id"], error }, { status: 500 });
    }
}