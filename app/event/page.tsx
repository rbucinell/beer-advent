"use client";

import { Button, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { useEvents } from "@/app/hooks/hooks";
import { usePathname } from 'next/navigation';
import DayIcon from '@/components/DayIcon';
import UserAvatar from '@/components/UserAvatar';
import BeerListItem from '@/components/Beer/BeerListItem';
import appConfig from "@app/app.config";
import CalendarWithBadge from '@/components/CalendarWithBadge';
import { IEvent } from '../models/event';
import { ArrowForward } from '@mui/icons-material';

export default function EventPage() {
  
    const { events, eventsError, eventsLoading } = useEvents();
    return (
        <div className="overflow-y-auto h-[90vh] w-full flex flex-col bg-white border border-solid border-black rounded-md self-stretch">

            <List dense={true} className="flex flex-col w-full justify-start gap-3">
                {events &&  events.toSorted((a, b) => b.year - a.year)
                //.filter((e) => e.year !== new Date().getFullYear())
                .map((event: IEvent) => {
                    return (
                        <ListItem className="border-b border-b-gray-400 flex flex-row justify-between">
                            <ListItemIcon>
                                <IconButton size="large" aria-label="calendar" href={`/event/${event.year}`} >
                                    <CalendarWithBadge num={event.year}/>
                                </IconButton>
                            </ListItemIcon>
                            <ListItemText primary={event.name} />
                            <Button href={`/event/${event.year}`} >
                                <ArrowForward/>
                            </Button>
                        </ListItem>
                    // <Button
                    //     key={event._id.toString()}
                    //     variant="outlined"
                    //     className="border bg-slate-100 border-slate-950 rounded"
                    //     href={`/event/${event.year}`}
                    // >
                    //     <ListItemText primary={event.year} />
                    // </Button>
                    );
                })}
                
            </List> 
        </div>
    );
}
