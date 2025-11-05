import appConfig from '@/app/app.config';
import mongoose, { Types } from 'mongoose';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from "next/server";
import Participant, { IParticipant } from '@/app/models/participant';
import Beer, { IBeer } from '@/app/models/beer';
import AuthUser from '@/app/models/authuser';
import { beerTooSimilar } from '@/app/util/BeerProximity';
import Event, { IEvent } from '@/app/models/event';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const res = await Beer.find(Object.fromEntries(req.nextUrl.searchParams));
    return NextResponse.json(res)
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to send message"], error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const json = await req.json();
    const beer: IBeer = json;
    const participant: IParticipant = json.participant;
    const user = await AuthUser.findById(participant.user);
    const event = await Event.findById(participant.event);

    //Does Participant already have two beers?
    const beersToBuy = Math.floor((event.days ?? appConfig.MAX_EVENT_DAYS) / 12);
    participant.beers = participant.beers.filter(_ => _ != null);
    if (participant.beers.length >= beersToBuy) {
      const msg = beersToBuy > 1 ? `User already submitted ${participant.beers.length} beers` : `User already submitted a beer`
      return NextResponse.json({ msg: [msg], status: 400 });
    }

    // const beerSimilarity = await beerTooSimilar(beer.beer, beer.brewer);
    // if (beerSimilarity.isTooSimilar) {
    //   return NextResponse.json({
    //     error: true,
    //     msg: [`"${beer.beer}" by ${beer.brewer}. Too close to "${beerSimilarity.beer?.beer}" by ${beerSimilarity.beer?.brewer}. Please tell, text Ryan if this is not correct.`]
    //   });
    // }

    //Create Beer
    beer.person = participant.name;
    beer.user = user._id;
    beer.day = participant.days[participant.beers.length];
    const created = await Beer.create(beer);

    //Update Participant
    const updatingParticipant = await Participant.findById(participant._id);
    if (updatingParticipant) {

      const participantBeers = updatingParticipant.beers.filter((_: Types.ObjectId | null) => _ != null);
      participantBeers.push(created._id);
      updatingParticipant.beers = participantBeers;
      await updatingParticipant.save();
    }

    return NextResponse.json({ msg: ["Beer submitted successfully"], success: true }, { status: 201 });
  }
  catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList: string[] = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      return NextResponse.json({ msg: errorList })
    }
    else {
      console.log(error);
      return NextResponse.json({ msg: ["Unable to send message"], error }, { status: 500 });
    }
  }
}
