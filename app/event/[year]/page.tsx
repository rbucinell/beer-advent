"use client";

import { Card, CardContent, List, ListItem, Stack } from '@mui/material';
import { useBeers, useEvent, useEventParticipants, useUsers } from "@/app/hooks/hooks";
import { usePathname } from 'next/navigation';
import DayIcon from '@/components/DayIcon';
import UserAvatar from '@/components/UserAvatar';
import BeerListItem from '@/components/Beer/BeerListItem';
import { EventDayDisplay } from './components/EventDayDisplay';
import appConfig from "@app/app.config";

export default function EventIdPage() {
  
  const pathname = usePathname();
  const year = parseInt(pathname.split('/').pop() as string);

  const { event, eventError, eventLoading } = useEvent({ year });
  const { participants, participantsError, participantsLoading } = useEventParticipants(event);
  const { beers, beersError, beersLoading } = useBeers();
  const { users, usersError, usersLoading } = useUsers();

  return (
    <Card className='w-full'>
      <CardContent>
      {event && <h1 className='self-center text-2xl'>{event.name}</h1>}

      <Stack direction={'column'} className='items-center' sx={{ width: '100%'}}>
        <List className='w-full items-center'>

          {event && users && participants && beers && Array.from(Array(event.days).keys()).map( i => {
            
            const day = appConfig.MAX_EVENT_DAYS - event.days + i + 1;
            const participant = participants.find( p => p.days.includes(day));
            const participantBeer = participant?.beers
              .map( pBeerId => beers.find( _ => _._id === pBeerId ))
              .find( _ => _?.day === day);
            
            const user = users.find( u => u._id === participant?.user);

            return <ListItem component={'div'} key={i} className='w-full items-center'>
              <div className='flex flex-row gap-1 items-center w-full'>
                <DayIcon day={day} />
                <UserAvatar user={user} />
                {participantBeer && <BeerListItem beer={participantBeer} /> }
              </div>
            </ListItem>
          })}
        </List>
      </Stack>
      </CardContent>
    </Card>
  );
}
