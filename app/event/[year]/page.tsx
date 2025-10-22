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

      <Stack direction={'column'} className='items-center' sx={{ width: '100%'}}>
        <List className='w-full items-center'>

          {users && participants && beers && Array.from(Array(24).keys()).map( i => {
            
            const day = i+1;
            const participant = participants.find( p => p.days.includes(day));
            const participantBeer = participant?.beers
              .map( pBeerId => beers.find( _ => _._id === pBeerId ))
              .find( _ => _?.day === day);
            
            const user = users.find( u => u._id === participant?.user);

            return <ListItem key={i} className='w-full items-center'>
              <div className='flex flex-row gap-1 items-center w-full'>
                <DayIcon day={day} />
                <UserAvatar user={user} />
                {participantBeer && <BeerListItem beer={participantBeer} /> }
              </div>
            </ListItem>
          })}
        </List>
      </Stack>
    </div>
  );
}
