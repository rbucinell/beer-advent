import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/app/models/event';
import Participant, { IParticipant } from '@/app/models/participant';
import { NextRequest, NextResponse } from "next/server";
import Beer from '@/app/models/beer';
import AuthUser, { IAuthUser } from '@/app/models/authuser';
import { ObjectId, Types } from 'mongoose';
import appConfig from '@/app/app.config';

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
    const daysCount = (event?.days ?? appConfig.MAX_EVENT_DAYS)/participants.length;
    if (!event) return NextResponse.json({ msg: ["Event not found"] }, { status: 404 });

    let participantUsers:Array<{participant:IParticipant,user:IAuthUser|null, stock:number}> = [];
    for( let participant of participants ){
      participantUsers.push( { participant, user: await AuthUser.findById(participant.user), stock: daysCount} ); 
    }

    if (json.days) {

      let claimedCount = 0;
      let days:Array<{day:number,participantId:Types.ObjectId|undefined}> = Array.from(Array(event?.days ?? appConfig.MAX_EVENT_DAYS).keys()).map( _ => {
        return { day: appConfig.MAX_EVENT_DAYS - event.days + _ + 1, participantId: undefined };
      });

      //go through 1st and second choices, pre-assigning
      for( let i = 0; i < daysCount; i++ ){
        console.log( 'Choice ', i+1);
        for( let pu of participantUsers ){
          if( pu.user && pu.user.preferredDays && pu.user.preferredDays.length >= i+1){
            let preferredDay = pu.user.preferredDays[i];
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
      days.forEach( _ => randomQueue.sort(shuffle));
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

    }

    if (json.xmas) {
      console.log("Rolling Xmas");

      let previousEvent = await Event.findOne<IEvent>({ year: event.year-1 });
      let previousParticipants = await Participant.find<IParticipant>( {event:previousEvent?._id});
      
      //pool of available secret santas
      let pool:Array<{participantId:Types.ObjectId, userId:Types.ObjectId}> = participants.map( p => {
        return { participantId: p._id, userId: p.user }
      });
      pool.sort(shuffle);

      for( let curYearParticipant of participants ){        
        //Previous Years Participant, where user id is the same as current years
        let partipiationLastYear = previousParticipants.find( p => p.user.equals(curYearParticipant.user) );
        //Get the Id of the last years Xmas assignment
        let lastYearsXmasParticipantId = partipiationLastYear?.xmas;
        //Get the Participant associated with Last Years Xmas assignment
        let lastYearsXmasParticipant = previousParticipants.find( p => p._id.equals(lastYearsXmasParticipantId) );
        //get the userId of last year's xmas assignment
        let lastYearsXmasUserId = lastYearsXmasParticipant?.user;
                
        //Find an available assignment from the pool
        let ss = null;
        if( pool.length === 1 ){
          ss = pool[0];
        }else{
          ss= pool.find( potential => 
            !potential.userId.equals(curYearParticipant.user) && 
            !potential.userId.equals(lastYearsXmasUserId) 
          );
        }
        if( ss ){
          pool = pool.filter( p => !p.participantId.equals(ss.participantId)); //remove ss from pool;
          await Participant.findByIdAndUpdate( curYearParticipant._id, { xmas: ss.participantId} );
        }
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


