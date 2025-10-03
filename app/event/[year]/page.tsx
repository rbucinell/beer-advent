"use client";

import { List, ListItem, Stack } from '@mui/material';
import { useBeers, useEvent, useEventParticipants, useUsers } from "@hooks/hooks";
import { usePathname } from 'next/navigation';
import DayIcon from '@/components/DayIcon';
import UserAvatar from '@/components/UserAvatar';
import BeerListItem from '@/components/Beer/BeerListItem';
import { EventDayDisplay } from './components/EventDayDisplay';

export default function EventPage() {
  
  const pathname = usePathname();
  const year = parseInt(pathname.split('/').pop() as string);

  const { event, eventError, eventLoading } = useEvent({ year });
  const { participants, participantsError, participantsLoading } = useEventParticipants(event);
  const { beers, beersError, beersLoading } = useBeers();
  const { users, usersError, usersLoading } = useUsers();

  return (
    <div className="overflow-y-auto h-[90vh] w-full flex flex-col bg-white border border-solid border-black rounded-md self-stretch">
      {event && <h1 className='self-center text-4xl'>{event.name}</h1>}

      <Stack direction={'column'}>
        <List >
          {users && beers && beers.filter(_ => _.year === year).toSorted((a, b) => a.day - b.day).map((b, i) => {
            return <ListItem key={i}>
              <Stack direction={'row'} gap={0.5}>
                <DayIcon day={b.day} />
                <UserAvatar user={users.find(u => u._id === b.user)} />
                <BeerListItem beer={b} />
              </Stack>
            </ListItem>
          })}
        </List>
      </Stack>
    </div>
  );
}
