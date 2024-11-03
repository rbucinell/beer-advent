"use client";
import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Component, ReactNode } from "react";
import { Avatar, Button, ButtonGroup, Paper, Skeleton, Stack, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IUser } from "@/app/models/user";

interface ParticipantItemProps {
    participant: IParticipant;
    user: IUser;
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default class AdminParticipantItem extends Component<ParticipantItemProps, {}> {

    participant: IParticipant;
    user: IUser;
    
    constructor( props:ParticipantItemProps ){
        super(props);
        this.participant = props.participant;
        this.user = props.user;
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
                    this.props.user?.imageUrl ? 
                    <Avatar src={this.props.user?.imageUrl} /> : 
                    <Skeleton variant="circular" width={40} height={40} animation={false} /> 
                }
                <Typography variant="h6">{this.props.participant.xmas?.toString()}</Typography>
                <Typography variant="h6">{ParticipantName(this.props.participant)}</Typography>
                
                </Stack>
                <Stack direction={'row'} spacing={2}>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral' }}>{Math.min(...this.props.participant.days)}</Avatar>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral' }}>{Math.max(...this.props.participant.days)}</Avatar>
                </Stack>
            </Item>
        );
    }
}