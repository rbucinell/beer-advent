import mongoose from 'mongoose';
import connectDB from '@/app/lib/mongodb';
import Beer from '../../models/beer';
import { NextResponse } from "next/server";

export async function GET() {
    try{
        await connectDB();
        const res = await Beer.find({});
        return NextResponse.json({beers: res})
    }catch( error ) {
        console.log( error );
        return NextResponse.json({msg: ["Unable to send message"] });
    }
}

export async function POST( req ) {
    const { name, type, brewer, img } = await req.json();

    try{
        await connectDB();
        await Beer.create({  name, type, brewer, img });
        
        return NextResponse.json({
            msg: ["Message sent successfully"],
            success: true,
        });
    }
    catch(error){
        if( error instanceof mongoose.Error.ValidationError){
            let errorList = [];
            for( let e in error.errors ){
                errorList.push( error.errors[e].message);
            }
            return NextResponse.json({msg: errorList})
        }
        else{
            console.log( error );
            return NextResponse.json({msg: ["Unable to send message"] });
        }
    }
}