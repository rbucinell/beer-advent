import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/app/models/event';
import mongoose, { Error } from 'mongoose';
import { NextRequest, NextResponse } from "next/server";
import { askAI } from '@/lib/gemini';
import Beer, { IBeer } from '@/app/models/beer';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const beers = await Beer.find();
    const summary = beers.map( (b:IBeer) => `${b.beer} by ${b.brewer}`).join(',');

    let beer = 'Grounded';//'Labatt Blue';
    let brewer = 'Hamburg';
    const prompt = `Give the following comma seperated list of beers and the brewer: ${summary} . What is the likely hood that ${beer} by ${brewer} is in that list. Your only anser should only be: percentage,beer,brewer. Where  percentage of likelyhood that the beer is in the list as a digit: e.g. 20% => 0.2, beer and brewer are the most likely candidate that alread exists in the list, null for each if percentage is 0.0`;

    const answer = await askAI( prompt );
    return NextResponse.json({answer});
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: ["Unable to process test call"], err }, { status: 500 });
  }
}