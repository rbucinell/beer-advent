import { IEvent } from '@/app/models/event';
import { Session } from 'better-auth';
import { authClient } from "@/lib/auth-client";
import { PersonAdd, PersonRemove } from '@mui/icons-material';
import { Button, Skeleton } from '@mui/material';
import { useRouter } from "next/navigation";
import { Post } from '@/app/util/RequestHelper';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { useEventParticipants } from "@/app/hooks/hooks";
import { Fragment } from 'react';

interface JoinLeaveEventProps {
    event: IEvent|undefined;
}

export default function JoinLeaveEventButton( props: JoinLeaveEventProps ){

    const event = props.event;
    const eventExists = event !== undefined && event !== null;

    const isBeforeExchange = event && event.exchange && new Date() <= new Date(event.exchange.date);
    console.log( event, new Date(), isBeforeExchange);
    const { data: session, isPending, error, refetch } = authClient.useSession();
    const { participants, participantsError, participantsLoading } = useEventParticipants(event);
    const isParticipating = participants?.find( p => p.user?.toString() == session?.user?.id) != undefined;
    
    
    async function joinEventHandler(e: React.MouseEvent) {
        e.preventDefault();
        if (!event) return;
        if (!session) useRouter().push("/sign-in");

        try {
            const res = await Post(`/api/events/${event.year}/join`, { user: session?.user });
            toast.success(`Joined Event`);
            mutate(`/api/events/${event.year}/participants`)
        } catch (err: any) {
            toast.error(`Error Joining event: ${err.msg}`);
        }
    }

    async function leaveEventHandler( e: React.MouseEvent ){
        e.preventDefault();
        if (!event) return;
        if (!session) useRouter().push("/sign-in");

        try{
            const res = await Post(`/api/events/${event.year}/leave`, { user: session?.user });
            toast.success(`Left Event`);
            mutate(`/api/events/${event.year}/participants`);
        } catch( err: any ){
            toast.error(`Error leaving: ${ err.msg }`)
        }
    }

    return (<Fragment>

        {!eventExists && !isBeforeExchange && 
            <Fragment />
        }
        {eventExists && session == null && 
            <Button startIcon={<PersonAdd />} type="button" variant="contained" color="success">
                Sign In to Join!
            </Button>
        }
        { eventExists && session && isBeforeExchange && isParticipating && 
            <Button startIcon={<PersonRemove />} type="button" variant="contained" color="error" onClick={leaveEventHandler}>
                Leave
            </Button>
        }
        { eventExists && session && isBeforeExchange && !isParticipating && 
            <Button startIcon={<PersonAdd />} type="button" variant="contained" color="success" onClick={joinEventHandler}>
                Join
            </Button>
        }
    </Fragment>
    );
}