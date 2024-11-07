"use client";
import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Component, ReactNode } from "react";
import { Avatar, Badge, Stack, Typography} from '@mui/material';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import User, { IUser } from "@/app/models/user";
import UserAvatar from "@/components/UserAvatar";
import { Types } from "mongoose";
import ListItem from "@/components/ListItem";

interface ParticipantItemProps {
    participant: IParticipant;
    user: IUser;
}

export default class ParticipantItem extends Component<ParticipantItemProps, {}> {

    dayBeers:{ day:number, beer:Types.ObjectId|null}[];

    constructor( props:ParticipantItemProps ) {
        super(props);
        const beers = props.participant.beers.filter( _ => _ != null );
        this.dayBeers = [...props.participant.days].map( day => { return { day, beer: null } } );
        for( let i=0; i<beers.length; i++ ){
            this.dayBeers[i].beer = beers[i];
        }
        this.dayBeers.sort( (a,b) => a.day - b.day );
    }

    isAdventDay( day:number ){
        const today = new Date();
        return today.getMonth() + 1 === 12 && today.getDate() === day;
    }

    render(): ReactNode {
        return(
            <ListItem>
                 <Stack direction={'row'} spacing={2}>
                {
                    <UserAvatar user={this.props.user} />
                }
                <Typography variant="h6">{ParticipantName(this.props.participant)}</Typography>
                </Stack>
                
                <Stack direction={'row'} spacing={2}>

                {
                    this.dayBeers.map( daybeer => {
                        if( daybeer.beer ){
                            return (
                            <Badge key={daybeer.day} overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={<SportsBarIcon fontSize="small" sx={{ color: '#333333' }} />}>
                                <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral', border: this.isAdventDay(daybeer.day)  ? '4px solid green' : 'none' }}>{daybeer.day}</Avatar>
                            </Badge>);
                        }
                        else{
                            return(<Avatar key={daybeer.day} variant="rounded" sx={{ bgcolor: 'lightcoral', border: this.isAdventDay(daybeer.day) ? '4px solid green' : 'none' }}>{daybeer.day}</Avatar>);
                        }
                    })
                }
                </Stack> 
            </ListItem>
        );
    }
}