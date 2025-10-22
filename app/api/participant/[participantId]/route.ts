import connectDB from '@/lib/mongodb';
import Participant from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, route: { params: Promise<{ participantId: string }> }) {
  try {
    const { participantId } = await route.params;
    await connectDB();
    if (!participantId) return NextResponse.json({}, { status: 200 });
    const event = await Participant.findOne({ _id: participantId })
    return NextResponse.json(event);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to retrieve participant from Id"], error }, { status: 500 });
  }
}
