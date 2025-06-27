"use client";

import React from "react";
import { useEvent, useEventParticipants } from "@hooks/hooks";
import { Button, Stack, Typography } from "@mui/material";
import { PersonAdd, SportsBar } from "@mui/icons-material";

import ParticipantItem from "@/components/ParticipantItem";
import PendingItem from "@/components/PendingItem";
import DirectionsButton from "@/components/Index/DirectionsButton";
import RulesButton from "@/components/Index/RulesButton";
import { authClient } from "@/lib/auth-client";

import { IParticipant } from "@models/participant";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Post } from "@/app/util/RequestHelper";

export const dynamic = 'force-dynamic';

export default function Home() {

  const eventYear = new Date().getFullYear();
  const { event, eventError, eventLoading } = useEvent({ year: eventYear });
  const { participants, participantsError, participantsLoading } = useEventParticipants(event);
  const { data: session, isPending, error, refetch } = authClient.useSession();

  async function joinEventHandler(e: React.MouseEvent) {
    e.preventDefault();
    if (!event) return;
    if (!session) {
      useRouter().push("/sign-in");
    }
    const res = await Post(`/api/events/${event.year}/join`, { user: session?.user });

    console.log(res);

    toast("join event");
  }

  return (
    <div className="w-full p-2 max-w-3xl mx-auto">
      {event && <Typography variant="h6">{event.name}🎄</Typography>}
      <Stack marginBottom={1} direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"} flexDirection={"row"} flexWrap={"wrap"}>

        <Stack direction={"row"} spacing={1}>
          <RulesButton event={event} />
          <DirectionsButton event={event} />
        </Stack>

        {event && session && !participants?.some((p: IParticipant) => p._id.toString() === session?.user?.id) && event.exchange && new Date() <= new Date(event.exchange.date) &&
          <Button startIcon={<PersonAdd />} type="button" variant="contained" color="success" onClick={joinEventHandler}>
            Join
          </Button>
        }
      </Stack>
      <Stack spacing={0.5}>
        {event && event.exchange && <Typography>Exchange: ({AbrvDate(event.exchange.date)} @ {event.exchange.location.name})</Typography>}
        {Array.from({ length: 12 }, (_, index) =>
          participants && participants[index] ? (
            <ParticipantItem key={participants[index]._id.toString()} participant={participants[index]} />
          ) :
            (<PendingItem key={index} />)
        )}
      </Stack>
      <Typography variant="caption"><SportsBar fontSize="small" sx={{ color: '#333333' }} /> = Beer Submitted</Typography>
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
