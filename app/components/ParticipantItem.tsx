"use client";
import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Component, ReactNode } from "react";
import { Avatar, Button, ButtonGroup, Paper, Skeleton, Stack, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IEventParticipant } from "@/app/models/event-participant";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default class ParticipantItem extends Component<IEventParticipant> {
    
    constructor( props: IEventParticipant ){
        super(props);
        console.log( props);
    }

    render(): ReactNode {
        return(
            <Item key={ this.props._id.toString()} 
                sx={{ 
                    display: "flex", 
                    flexDirection:'row', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Stack direction={'row'} spacing={2}>
                { this.props.user?.imageUrl ? <Avatar src={this.props.user?.imageUrl} /> : <Skeleton variant="circular" width={40} height={40} animation={false} /> }
                <Typography variant="h6">{ParticipantName(this.props)}</Typography>
                </Stack>
                <Stack direction={'row'} spacing={2}>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral' }}>{this.props.days[0] === null ? '?' :Math.min(...this.props.days)}</Avatar>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral' }}>{this.props.days[1] === null ? '?' :Math.max(...this.props.days)}</Avatar>
                </Stack>
            </Item>
        );
    }
}