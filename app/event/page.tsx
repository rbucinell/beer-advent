"use client";

import { Card, CardContent, List } from '@mui/material';
import { useEvents } from "@/app/hooks/hooks";
import { IEvent } from '../models/event';
import { EventLinkListItem } from './components/EventLinkListItem';

export default function EventPage() {
  
    const { events, eventsError, eventsLoading } = useEvents();
    return (
        <Card className='w-full'>
            <CardContent>
                <List dense={true} className="flex flex-col w-full justify-start gap-3">
                    {events &&  events.toSorted((a, b) => b.year - a.year)
                    //.filter((e) => e.year !== new Date().getFullYear())
                    .map((event: IEvent) => <EventLinkListItem event={event} /> )}
                </List> 
            </CardContent>
        </Card>
    );
}
