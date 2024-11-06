"use client";
import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Component, ReactNode } from "react";
import { Avatar, Button, ButtonGroup, Paper, Skeleton, Stack, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import User, { IUser } from "@/app/models/user";
import UserAvatar from "@/components/UserAvatar";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

interface ParticipantItemProps {
    participant: IParticipant;
    user: IUser;
}

export default class ParticipantItem extends Component<ParticipantItemProps, {}> {
    
    firstDay:number = 0;
    lastDay: number = 0;

    constructor( props:ParticipantItemProps ) {
        super(props);
        this.firstDay = Math.min(...props.participant.days);
        this.lastDay = Math.max(...props.participant.days);
    }

    isAdventDay( day:number ){
        const today = new Date();
        console.log('today', today.getMonth() + 1, today.getDate());
        return today.getMonth() + 1 === 12 && today.getDate() === day;
    }

    render(): ReactNode {
        return(
            <Item key={this.props.participant._id.toString()} 
                sx={{ 
                    display: "flex", 
                    flexDirection:'row', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                 <Stack direction={'row'} spacing={2}>
                {
                    <UserAvatar user={this.props.user} />
                }
                <Typography variant="h6">{ParticipantName(this.props.participant)}</Typography>
                </Stack>
                <Stack direction={'row'} spacing={2}>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral', border: this.isAdventDay(this.firstDay) ? '4px solid green' : 'none' }}>{this.firstDay}</Avatar>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral', border: this.isAdventDay(this.lastDay)  ? '4px solid green' : 'none' }}>{this.lastDay}</Avatar>
                </Stack>
            </Item>
        );
    }
}