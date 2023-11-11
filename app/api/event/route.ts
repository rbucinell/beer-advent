import connectDB from '@/app/lib/mongodb';
import Event from '../../models/event';
import { NextRequest, NextResponse } from "next/server";

export async function GET( req:NextRequest ) {
    try{
        await connectDB();
        const res = await Event.findOne({ year: (new Date()).getFullYear() });
        return NextResponse.json(res,);
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to retrieve event config"] });
    }
}