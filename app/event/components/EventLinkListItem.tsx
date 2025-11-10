import { IEvent } from "@/app/models/event";
import CalendarWithBadge from "@/components/CalendarWithBadge";
import { ArrowForward } from "@mui/icons-material";
import { ListItem, ListItemIcon, IconButton, ListItemText, Button } from "@mui/material";

interface EventLinkListItemProps {
    event:IEvent;
}

export function EventLinkListItem( {event} : EventLinkListItemProps) {
    return <ListItem className="border-b border-b-gray-400 flex flex-row justify-between">
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
}