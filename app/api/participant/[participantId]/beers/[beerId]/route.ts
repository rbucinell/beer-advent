import connectDB from '@/lib/mongodb';
import Beer from '@/app/models/beer';
import Participant, { IParticipant } from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, route: { params: Promise<{ participantId: string, beerId: string }> }) {
  try {
    const { participantId, beerId } = await route.params;
    console.log("[GET] Participant ", participantId, "Beer", beerId);
    await connectDB();

    const participant = await Participant.findById(participantId) as IParticipant;
    if (!participant) return NextResponse.json({ msg: ["Participant not found"] }, { status: 404 });

    const beer = await Beer.findById(beerId);
    if (!beer) return NextResponse.json({ msg: ["Beer not found"] }, { status: 404 });

    return NextResponse.json(beer, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to retrieve Participant. " + error], error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, route: { params: Promise<{ participantId: string, beerId: string }> }) {
  try {
    console.log("[DELETE] Participant beer");
    await connectDB();
    const { participantId, beerId } = await route.params;

    const participant = await Participant.findById(participantId) as IParticipant;
    if (!participant) return NextResponse.json({ msg: ["Participant not found"] }, { status: 404 });

    const beer = await Beer.findById(beerId);
    if (!beer) return NextResponse.json({ msg: ["Beer not found"] }, { status: 404 });

    participant.beers = participant.beers.filter(_ => _.toString() !== beerId.toString());

    await Participant.updateOne({ _id: participantId }, { $set: { beers: participant.beers } });
    await beer.deleteOne();
    return NextResponse.json({ msg: ["Beer deleted"] }, { status: 200 });
  }
  catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to retrieve Participant. " + error], error }, { status: 500 });
  }
}
