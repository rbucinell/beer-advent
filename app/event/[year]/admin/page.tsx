"use client";

import { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";

import { useEvent, useEventParticipants } from "@hooks/hooks";
import { authClient } from "@/lib/auth-client";

import { Get, Post } from "@/app/util/RequestHelper";
import { getParticipant } from "@/app/util/participation";

import { IEvent } from "@/app/models/event";
import { IParticipant } from "@/app/models/participant";
import { IAuthUser } from "@/app/models/authuser";

import AdminBeerManagementItem from "./compontents/AdminBeerManagementItem";
import PendingItem from "@/components/PendingItem";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type IData = {
  event: IEvent;
  participants: IParticipant[];
  users: IAuthUser[];
}

export default function Admin() {

  const params = useParams<{ year:string }>();
  const year = parseInt(params.year);

  const { data: session, isPending, error: sessionError, refetch } = authClient.useSession();
  const { event, eventError, eventLoading } = useEvent({ year });
  const { participants, participantsError, participantsLoading } = useEventParticipants(event);  
  
  //const [users, setUsers] = useState([] as IAuthUser[]);
  const [data, setData] = useState({} as IData);

  // useEffect(() => {
  //   (async () => {

  //     if( !participants ) return;
  //     console.log( 'admin page participants', participants)

  //     // const event = await Get<IEvent>(`api/events/${year}`);
  //     // if (!event._id) return;
  //     // const participants = await Get<IParticipant[]>(`api/participant?event=${event._id}`);
  //     let users: IAuthUser[] = [];
  //     for (const participant of participants) {
  //       const user = await Get<IAuthUser>(`/api/user/${participant.user}`);
  //       console.log( 'user found', user );
  //       users.push(user);
  //     }
  //     console.log( 'users', users);
  //     setUsers( users );
  //     // setData({ event, participants, users });

  //   })();
  // }, [participants]);


  async function handleRollNumbersClick(e: React.MouseEvent) {
      e.preventDefault();
      if (!event) return;
      await Post(`/api/events/${event.year}/roll`, {
        days: true
      });
    }

      async function handleRollSecretClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!event) return;
    await Post(`/api/events/${event.year}/roll`, {
      xmas: true
    });
  }

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      { event && 
        
        <Stack direction={"column"}>

          {/* Page Header */}
          <div className="flex flex-row justify-between flex-wrap mb-2">
            <div className="flex flex-row">
              <Typography variant="h6">Admin Page - </Typography>
              <Typography variant="h6">{event?.name}🎄</Typography>
            </div>
            <div className="flex flex-row gap-1">
              <Button className="text-xs" onClick={handleRollNumbersClick}>🎲 Roll Numbers</Button>
              <Button className="text-xs" onClick={handleRollSecretClick}>🎅 Roll Secret Santa</Button>
            </div>
          </div>
          

         <Stack spacing={0.5}>

          { participants?.map( (participant,index) =>{

            return <AdminBeerManagementItem
              key={index}
              participant={participant}
              //user={users.find(u => u._id === participant.user) as IAuthUser}
              xmas={participants.find(p => p._id === participant.xmas) as IParticipant}
            />
          })}

          { Array.from({ length: (12 - (participants?.length ?? 0))},(_, i) => <PendingItem key={i} /> ) }

          </Stack>
        </Stack>
      }
    </div>
  );
}

/**
 * Given a date string, return a short version of the date
 * @param {string} d date string
 * @returns {string} short version of the date
 */
function AbrvDate(d: Date) {
  const date = new Date(d);
  return `${date.getMonth() + 1}/${date.getDate()} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
