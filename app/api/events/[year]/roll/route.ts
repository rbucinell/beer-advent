import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/app/models/event';
import Participant, { IParticipant } from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";
import Beer from '@/app/models/beer';
import AuthUser, { IAuthUser } from '@/app/models/authuser';
import { ObjectId, Types } from 'mongoose';

const shuffle = (a: any, b: any) => 0.5 - Math.random();

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

    let participantUsers:Array<{participant:IParticipant,user:IAuthUser|null, stock:number}> = [];
    for( let participant of participants ){
      participantUsers.push( { participant, user: await AuthUser.findById(participant.user), stock: 2} ); 
    }

    if (json.days) {

      let claimedCount = 0;
      let days:Array<{day:number,participantId:Types.ObjectId|undefined}> = Array.from(Array(24).keys()).map( _ => {
        return { day: _, participantId: undefined };
      });

      //go through 1st and second choices, pre-assigning
      for( let i = 0; i < 2; i++ ){
        console.log( 'Choice ', i+1);
        for( let pu of participantUsers ){
          if( pu.user && pu.user.preferredDays && pu.user.preferredDays.length >= i+1){
            let preferredDay = pu.user.preferredDays[i];
            console.log( pu.user.name, 'prefers', preferredDay );
            if( preferredDay && preferredDay !== 0 ){
              let wantsThisDay = days.find( _ => _.day === preferredDay);
              if( wantsThisDay ){
                if( !wantsThisDay.participantId ){
                  wantsThisDay.participantId = pu.participant._id;
                  pu.stock--;
                  claimedCount++;
                }else{
                  if( claimedCount >= days.length ) continue;
                  else{
                    let index = preferredDay;
                    while( index != wantsThisDay.day-1 ){
                      if( index >= days.length ) index = 0;
                      if( !days[index].participantId) {
                        days[index].participantId = pu.participant._id;
                        pu.stock--;
                        claimedCount++;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        } 
      }

      //assign the rest randomly
      let randomQueue = [];
      for( let pu of participantUsers ){
        randomQueue.push( ...Array.from({length: pu.stock}, _ => pu.participant._id ) )
      }
      days.forEach( _ => randomQueue.sort(shuffle ));
      for( let d of days ){
        if( d.participantId === undefined ){
          d.participantId = randomQueue.shift();
        }
      }
      
      //Assign the days to the participants
      for( let participant of participants ){

        let assignedDays = days.filter( d => d.participantId === participant._id).map( _ => _.day);
        participant.days = assignedDays;

        if( participant.beers[0]){
          await Beer.findByIdAndUpdate( participant.beers[0]._id, { day: participant.days[0]});
        }
        if( participant.beers[1]){
          await Beer.findByIdAndUpdate( participant.beers[1]._id, { day: participant.days[1]});
        }
        await Participant.findByIdAndUpdate( participant._id, participant);
      }


      // let lowerNumbers = new Array(12).fill(0).map((_, index) => index + 1);
      // lowerNumbers.sort(shuffle);
      // let upperNumbers = new Array(12).fill(0).map((_, index) => index + 13);
      // upperNumbers.sort(shuffle);

      // for (let i = 0; i < participants.length; i++) {
      //   let participant = participants[i];
      //   participant.days = [lowerNumbers[i], upperNumbers[i]];

      //   if( participant.beers[0])
      //     await Beer.findByIdAndUpdate( participant.beers[0]._id, { day: lowerNumbers[i]});
      //   if( participant.beers[1])
      //     await Beer.findByIdAndUpdate( participant.beers[1]._id, { day: upperNumbers[i]});

      //   const response = await Participant.findByIdAndUpdate( participant._id, participant );
      // }
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


