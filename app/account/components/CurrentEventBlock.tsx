"use client";

import { useEffect, useState } from "react";
import { User } from "better-auth";
import { useEvent, useEventParticipants, useUserById } from "@/app/hooks/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { IParticipant } from "@/app/models/participant";
import { Alert } from "@components/ui/alert";
import { Get } from "@/app/util/RequestHelper";
import { IBeer } from "@/app/models/beer";
import { EventLinkListItem } from "@/app/event/components/EventLinkListItem";
import AuthUser, { IAuthUser } from "@/app/models/authuser";
import DayIcon from "@/components/DayIcon";

interface CurrentEventBlockProps {
  sessionUser: User;
}
export function CurrentEventBlock({ sessionUser }: CurrentEventBlockProps) {
  const { user } = useUserById(sessionUser.id);
  const eventYear = new Date().getFullYear();
  const { event, eventError, eventLoading } = useEvent({ year: eventYear });
  let { participants, participantsError, participantsLoading } = useEventParticipants(event);
  const [ participant, setParticipant ] = useState<IParticipant | null>( null );
  const [ secretSantaUser, setSecretSantaUser ] = useState<IAuthUser|null>(null);
  const [ beers, setBeers] = useState<Array<IBeer>>( [] );
  
  useEffect(() => {
    if( participants){
     let participant = participants?.find( p => p.user.toString() === user?._id.toString());
     if( participant ){
      setParticipant( participant);

      (async()=>{
        let beers = [];
        for(let beerId of participant.beers.filter( _ => _ !== undefined || _ !== null) ){ 
          let beer = await Get<IBeer>(`/api/beer/${beerId}`);
          beers.push( beer);
        }
        setBeers( beers );
      })();
     }
    }
  }, [participants]);

  useEffect(() => {
    if( participant ){
      let ssUser = null;
      (async ()=>{
        console.log( 'participant',participant );
        let xmasParticipant = participants?.find( p => p._id.toString() === participant.xmas?.toString() );
        ssUser = await Get<IAuthUser>(`/api/user/${xmasParticipant?.user}`);
        console.log( 'ssUser', ssUser)
        if( ssUser ){
          setSecretSantaUser( ssUser );
        }
      })();
    }
  }, [participant]);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Current Events</h2>
        {event && participant && 
          <div className="space-y-4">
            <div>
              <EventLinkListItem event={event} />
            </div>
            
            <div className="space-y-2">
              {participant.days && participant.days.length > 0 && (
                  <div className="flex items-center gap-2 p-3">
                    <span className="font-medium text-gray-700">Your Day(s):</span>
                    <span className="flex flex-row gap-1">{participant.days.map( d => <DayIcon day={d} key={d} />)}</span>
                </div>
              )}
              
              <div className=" bg-no-repeat bg-cover bg-center bg-[url('/passed_out_santa.png')]">
                <div className="flex flex-col gap-2 p-4 rounded-lg border border-red-200 bg-red-100">
                  <div className="flex flex-col w-full items-center">
                    <span className="font-medium text-gray-700">Secret Santa Assignment</span>
                    <span className="font-bold text-red-900">{ participants?.find( p => p._id.toString() === participant.xmas?.toString())?.name ?? "" }</span>
                  </div>
                  {secretSantaUser?.preferences?.beer && 
                    <div className="flex flex-col w-full items-center">
                      <span className="font-medium text-gray-700">Your Asignee's Beer preferences</span>
                      <span className="text-sm text-gray-600">{ secretSantaUser.preferences.beer }</span>
                    </div>
                  }
                </div>
              </div>

              {participant.days && participant.days.length > 0 && (
                <Alert level="info">
                  Submitted Beers:
                  {beers && beers.map( beer =>{
                    return (<div key={beer._id.toString()} className="w-full flex gap-1 mb-2">
                      <div className="flex flex-row gap-1 w-full items-start px-2">
                        {beer &&
                          <h3 className="font-bold">
                            {beer.beer}{" "}
                            <small className="font-light">{" "}{beer.brewer}</small>
                          </h3>
                        }
                      </div>
                    </div>)
                  })}                  
                </Alert>
              )}
            </div>
          </div>
        }
      </CardContent>
    </Card>
  );
}