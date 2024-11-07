"use client";

import { useState, useEffect } from "react";
import { Alert, Stack, Typography } from "@mui/material";
import SportsBarIcon from '@mui/icons-material/SportsBar';
import ParticipantItem from "@/components/ParticipantItem";
import { Get } from "./util/RequestHelper";

import { IEvent } from "@/app/models/event";
import { IParticipant } from "@/app/models/participant";
import { IUser } from "@/app/models/user";
import {  Directions } from "@mui/icons-material";
import PendingItem from "@/components/PendingItem";

type IData = {
  event: IEvent;
  participants: IParticipant[];
  users: IUser[];
}

export default function Home() {

  const [data, setData] = useState({} as IData);

  useEffect(() => {
    (async () => {

      const event = await Get<IEvent>(`api/event?year=${new Date().getFullYear()}`);
      if( !event._id ) return;
      const participants = await Get<IParticipant[]>(`api/participant?event=${event._id}`);
      let users:IUser[] = [];

      for( const participant of participants ) {
        const user = await Get<IUser>(`api/user/${participant.user}`);
        users.push(user);
      }
      setData({event, participants, users});

    })();
  }, []);

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <Stack marginBottom={1} direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"baseline"} flexDirection={"row-reverse"} flexWrap={"wrap"}>
        { data?.event?.exchange?.date && new Date() <= new Date( data.event.exchange.date ) &&
          
          <a href={`https://maps.google.com/?q=${data.event.exchange.location.name}`} target="_blank" rel="noreferrer">
            <Alert icon={<Directions fontSize="inherit" />} severity="info">{AbrvDate(data.event.exchange.date)} @ {data.event.exchange.location.name}</Alert>
          </a>
        }
        <Typography variant="h6">{data?.event?.name}🎄</Typography>

      </Stack>
      <Stack spacing={0.5}>
        {Array.from({ length: 12 }, (_, index) =>
          data?.participants && data?.participants[index] ? (
            <ParticipantItem key={data?.participants[index]._id.toString()} 
              participant={data?.participants[index]} 
              user={ data?.users.find(u => u._id === data?.participants[index].user) as IUser}/>
          ) : (
            <PendingItem key={index}/>
          )
        )}
      </Stack>
      <Typography variant="caption"><SportsBarIcon fontSize="small" sx={{ color: '#333333' }} /> = Beer Submitted</Typography>
    </div>
  );
}

/**
 * Given a date string, return a short version of the date
 * @param {string} d date string
 * @returns {string} short version of the date
 */
function AbrvDate( d: Date ) {
  const date = new Date(d);
  return `${date.getMonth() + 1}/${date.getDate()} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}