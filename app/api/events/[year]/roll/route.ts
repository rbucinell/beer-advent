import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/app/models/event';
import Participant, { IParticipant } from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";
import Beer from '@/app/models/beer';

const shuffle = (a: number, b: number) => 0.5 - Math.random();

export async function POST(req: NextRequest, route: { params: Promise<{ year: string }> }) {

  try {

    await connectDB();
    const { year } = await route.params;
    const json = await req.json();
    
    //Ensure Inputs
    if (!json.days && !json.xmas) {
      return NextResponse.json({ msg: ["days or xmas is required"] }, { status: 400 });
    }

    const { event, participants } = await GetEventAndParticipants( year );
    if (!event) return NextResponse.json({ msg: ["Event not found"] }, { status: 404 });


    if (json.days) {

      let lowerNumbers = new Array(12).fill(0).map((_, index) => index + 1);
      lowerNumbers.sort(shuffle);
      let upperNumbers = new Array(12).fill(0).map((_, index) => index + 13);
      upperNumbers.sort(shuffle);

      for (let i = 0; i < participants.length; i++) {
        let participant = participants[i];
        participant.days = [lowerNumbers[i], upperNumbers[i]];

        if( participant.beers[0])
          await Beer.findByIdAndUpdate( participant.beers[0]._id, { day: lowerNumbers[i]});
        if( participant.beers[1])
          await Beer.findByIdAndUpdate( participant.beers[1]._id, { day: upperNumbers[i]});

        const response = await Participant.findByIdAndUpdate( participant._id, participant );
      }
    }

    if (json.xmas) {
      console.log("Rolling Xmas");

      let santas = participants.map(p => p._id);
      
      let rot = Math.random() * participants.length + 1;
      if( rot === participants.length ) rot++;   
      
      for (let i = 0; i < rot; i++) {
        const id = santas.shift();
        if( id ) santas.push(id);
      }

      for (let participant of participants) {
        await Participant.findByIdAndUpdate( participant._id, { xmas: santas.shift()} );
      }

    }
    return NextResponse.json({ msg: ["Rolling Sucess"] }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to roll for Event"], error }, { status: 500 });
  }
}

export async function DELETE( req: NextRequest, route: { params: Promise< { year: string }> }) {
  try {
    await connectDB();
    const { year } = await route.params;
    const json = await req.json();

    //Ensure Inputs
    if (!json.days && !json.xmas) {
      return NextResponse.json({ msg: ["days or xmas is required"] }, { status: 400 });
    }

    const { event, participants } = await GetEventAndParticipants( year );
    if (!event) return NextResponse.json({ msg: ["Event not found"] }, { status: 404 });

    if( json.days ){
      await Participant.updateMany( { event:event._id }, { $set: { days:[null, null]} } );
    }

    if( json.xmas ){
      await Participant.updateMany( { event:event._id }, { $set: { xmas: null } } );
    }
    return NextResponse.json({ status: 201 } );

  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to roll for Event"], error }, { status: 500 });
  }
}

async function GetEventAndParticipants( year:string|number ): Promise<{ event:IEvent|null, participants:IParticipant[] }> {
    const event = await Event.findOne({ year });
    const participants = event ? await Participant.find({ event: event }) : [];
    return { event, participants };
}

