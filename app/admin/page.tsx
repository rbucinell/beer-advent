"use client";

import { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";

import { Get } from "@/app/util/RequestHelper";
import { IEvent } from "@/app/models/event";
import { IParticipant } from "@/app/models/participant";
import { IOldUsers } from "@/app/models/oldusers";

import AdminBeerManagementItem from "./compontents/AdminBeerManagementItem";
import PendingItem from "@/components/PendingItem";

type IData = {
  event: IEvent;
  participants: IParticipant[];
  users: IOldUsers[];
}

export default function History() {

  const [data, setData] = useState({} as IData);

  useEffect(() => {
    (async () => {

      const params = new URLSearchParams(window.location.search);
      const eventYear = params.get('year') ?? new Date().getFullYear();

      const event = await Get<IEvent>(`api/events/${eventYear}`);
      if (!event._id) return;
      const participants = await Get<IParticipant[]>(`api/participant?event=${event._id}`);
      let users: IOldUsers[] = [];

      for (const participant of participants) {
        const user = await Get<IOldUsers>(`api/user/${participant.user}`);
        users.push(user);
      }
      setData({ event, participants, users });

    })();
  }, []);

  return (
    <div className="p-2 w-1/2 mx-auto">
      <Stack marginBottom={1} direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"baseline"} flexDirection={"row-reverse"} flexWrap={"wrap"}>
        <Typography variant="h6">Admin</Typography>
        <Typography variant="h6">{data?.event?.name}🎄</Typography>
      </Stack>

      <Stack spacing={0.5}>
        {Array.from({ length: 12 }, (_, index) => data?.participants && data?.participants[index] ? (

          <AdminBeerManagementItem
            key={index}
            participant={data?.participants[index]}
            user={data?.users.find(u => u._id === data?.participants[index].user) as IOldUsers}
            xmas={data?.participants.find(p => p._id === data?.participants[index].xmas) as IParticipant}
          />
        )
          : (<PendingItem key={index} />))}
      </Stack>
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
