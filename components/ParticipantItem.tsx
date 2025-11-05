"use client";

import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Badge, Stack, Typography } from '@mui/material';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { IAuthUser } from "@/app/models/authuser";
import UserAvatar from "@/components/UserAvatar";
import { Types } from "mongoose";
import ListItem from "@/components/ListItem";
import DayIcon from "./DayIcon";
import { useUserById } from "@/app/hooks/hooks";
import { IEvent } from "@/app/models/event";

interface ParticipantItemProps {
  event: IEvent;
  participant: IParticipant;
  days:number;
}

export default function ParticipantItem(props: ParticipantItemProps) {

  const {event, participant, days} = props;
  const { user } = useUserById(participant.user.toString());

  console.log( days );

  let dayBeers: { day: number, beer: Types.ObjectId | null }[];
  const beers = participant.beers.filter(_ => _ != null);
  dayBeers = [...participant.days].map(day => { return { day, beer: null } });
  for (let i = 0; i < beers.length; i++) {
    dayBeers[i].beer = beers[i];
  }
  dayBeers.sort((a, b) => a.day - b.day);

  function isAdventDay(day: number) {
    const today = new Date();
    return today.getMonth() + 1 === 12 && today.getDate() === day;
  }

  return (
    <ListItem>
      <Stack direction={'row'} spacing={2}>
        <UserAvatar user={user as IAuthUser} />
        <Typography variant="h6">{ ParticipantName(props.participant) }</Typography>
      </Stack>

      <Stack direction={'row'} spacing={2}>
        { dayBeers.slice(0,days).map((dayBeer, index) => {
            if (dayBeer.beer) {
              return (
                <Badge key={index} overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={<SportsBarIcon fontSize="small" sx={{ color: '#333333' }} />}>
                  <DayIcon day={dayBeer.day} sx={{ border: isAdventDay(dayBeer.day) ? '4px solid green' : '2px solid lightcoral' }} />
                </Badge>
              );
            }
            else {
              return (
              <DayIcon key={index} day={dayBeer.day} sx={{ border: isAdventDay(dayBeer.day) ? '4px solid green' : '2px solid lightcoral' }} />
              );
            }
          })
        }
      </Stack>
    </ListItem>
  );
}
