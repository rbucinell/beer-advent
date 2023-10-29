"use client";
import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Component, ReactNode } from "react";
import { Avatar, Button, ButtonGroup, Paper, Stack, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default class ParticipantItem extends Component<IParticipant> {
    
    constructor( props: IParticipant ){
        super(props);
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
                <Typography variant="h6">{ParticipantName(this.props)}</Typography>
                <Stack direction={'row'} spacing={2}>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral' }}>{Math.min(...this.props.days)}</Avatar>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral' }}>{Math.max(...this.props.days)}</Avatar>
                </Stack>
            </Item>
        );
    }
}