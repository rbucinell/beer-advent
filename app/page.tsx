"use client";

import { useState, useEffect } from "react";
import { Button, ButtonGroup, Stack, Typography } from "@mui/material";

import ParticipantItem from "@/components/ParticipantItem";
import { Get } from "./util/RequestHelper";

import { IEvent } from "@/app/models/event";
import { IParticipant } from "@/app/models/participant";
import { IUser } from "@/app/models/user";
import { DateRange, SortByAlpha } from "@mui/icons-material";
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

  function sortParticipantsAlpha(event: any) {
    console.log("sortParticipantsAlpha");
  }

  function sortParticipantsDate(event: any) {
    console.log("sortParticipantsDate");
  }

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <Stack direction={"row"} spacing={2} justifyContent={"space-between"} flexDirection={"row-reverse"}>
        <ButtonGroup sx={ { display: "none" }} size="small" variant="contained">
        <Button id="sortByAlpha" onClick={sortParticipantsAlpha}>
          <SortByAlpha />
        </Button>
        <Button id="sortByDate" onClick={sortParticipantsDate}>
          <DateRange />
        </Button>
        </ButtonGroup>
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
    </div>
  );
}
