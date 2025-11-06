"use client";

import React, { Fragment } from "react";
import { useEvent, useEventParticipants } from "@/app/hooks/hooks";
import { Button, Stack, Typography } from "@mui/material";
import { PersonAdd, SportsBar } from "@mui/icons-material";
import { AbrvDate } from "./util/fns";
import ParticipantItem from "@/components/ParticipantItem";
import PendingItem from "@/components/PendingItem";
import DirectionsButton from "@/components/Index/DirectionsButton";
import RulesButton from "@/components/Index/RulesButton";
import JoinLeaveEventButton from "@/components/Index/JoinLeaveEventButton";
import { authClient } from "@/lib/auth-client";

export const dynamic = 'force-dynamic';

export default function Home() {
  const eventYear = new Date().getFullYear();
  const { event, eventError, eventLoading } = useEvent({ year: eventYear });
  let { participants, participantsError, participantsLoading } = useEventParticipants(event);
  const { data: session, isPending, error, refetch } = authClient.useSession();

  return (
    <div className="w-full p-2 max-w-3xl mx-auto">
      {event && <Typography variant="h6">{event.name}🎄</Typography>}
      <Stack marginBottom={1} direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"} flexDirection={"row"} flexWrap={"wrap"}>

        <Stack direction={"row"} spacing={1}>
          <RulesButton event={event} />
          <DirectionsButton event={event} />
        </Stack>
        
        <JoinLeaveEventButton event={event} />

      </Stack>
      <Stack spacing={0.5}>
        {event && <Fragment>
          { event.exchange && <Typography>Exchange: ({AbrvDate(event.exchange.date)} @ {event.exchange.location.name})</Typography>}
          { participants && participants.map( (participant) => 
            <ParticipantItem key={participant._id.toString()} event={event} participant={participant} days={event.days / 12} />
          )}
        </Fragment>}
        {participants && Array.from({ length: 12 - participants.length }, (_, index) => <PendingItem key={index} />)}
      </Stack>
      <Typography variant="caption"><SportsBar fontSize="small" sx={{ color: '#333333' }} /> = Beer Submitted</Typography>
    </div>
  );
}
