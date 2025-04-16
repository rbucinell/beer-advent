"use client";

import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Component, ReactNode } from "react";
import { Badge, Stack, Typography} from '@mui/material';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import User, { IUser } from "@/app/models/user";
import UserAvatar from "@/components/UserAvatar";
import { Types } from "mongoose";
import ListItem from "@/components/ListItem";
import DayIcon from "./DayIcon";
import { useUser } from "@/app/hooks/hooks";
interface ParticipantItemProps {
    participant: IParticipant;
}

export default function ParticipantItem(props:ParticipantItemProps) {

    const { user } = useUser( props.participant.user.toString());
    
    let dayBeers:{ day:number, beer:Types.ObjectId|null}[];
    const beers = props.participant.beers.filter( _ => _ != null );
    dayBeers = [...props.participant.days].map( day => { return { day, beer: null } } );
    for( let i=0; i<beers.length; i++ ){
        dayBeers[i].beer = beers[i];
    }
    dayBeers.sort( (a,b) => a.day - b.day );

    function isAdventDay( day:number ){
        const today = new Date();
        return today.getMonth() + 1 === 12 && today.getDate() === day;
    }

    return(
        <ListItem>
             <Stack direction={'row'} spacing={2}>
                { <UserAvatar user={user} /> }
                <Typography variant="h6">{ParticipantName(props.participant)}</Typography>
            </Stack>
            
            <Stack direction={'row'} spacing={2}>
            {
                dayBeers.map( daybeer => {
                    if( daybeer.beer ){
                        return (
                        <Badge key={daybeer.day} overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={<SportsBarIcon fontSize="small" sx={{ color: '#333333' }} />}>
                            <DayIcon day={daybeer.day} sx={{border: isAdventDay(daybeer.day)? '4px solid green' : 'none'}} />
                        </Badge>);
                    }
                    else{
                        return(<DayIcon key={daybeer.day} day={daybeer.day} sx={{border: isAdventDay(daybeer.day)? '4px solid green' : 'none' }} />);
                    }
                })
            }
            </Stack> 
        </ListItem>
    );
}
