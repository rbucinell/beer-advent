"use client";

import { Box, List, ListItem, Stack, Typography } from '@mui/material';
import { useBeers, useEvent, useEventParticipants, useUsers } from "@hooks/hooks";
import { usePathname } from 'next/navigation';
import DayIcon from '@/components/DayIcon';
import UserAvatar from '@/components/UserAvatar';
import BeerListItem from '@/components/Beer/BeerListItem';

export default function EventPage() {

  const pathname = usePathname();
  const year = pathname.split('/').pop();
  const { event, eventError, eventLoading } = useEvent({ year });
  const { participants, participantsError, participantsLoading } = useEventParticipants(event);
  const { beers, beersError, beersLoading } = useBeers();
  const { users, usersError, usersLoading } = useUsers();

  return (
    <div className="overflow-y-scroll h-[90vh] w-full flex flex-col bg-white border border-solid border-black rounded-md self-stretch">
      {event && <h1 className='self-center text-4xl'>{event.name}</h1>}

      <Stack direction={'column'}>
        <List >
          {Array.from({ length: 24 }, (_, index) => {
            const day = index + 1;
            const participant = participants?.find(p => p.days.includes(day));
            const user = users?.find(u => u._id === participant?.user);
            const beer = beers?.find(b => b.year.toString() === year && b.day === (index + 1));
            return <ListItem key={index} dense={true} >
              <Stack direction={'row'} gap={0.5}>
                <DayIcon day={index + 1} />
                <UserAvatar user={user} />
                {beer && <BeerListItem beer={beer} />}
              </Stack>
            </ListItem>
          })}
        </List>
      </Stack>
    </div>
  );
}
