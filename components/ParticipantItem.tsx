"use client";
import { IParticipant } from "@/app/models/participant";
import { Component, ReactNode } from "react";
import {Box, Button, ButtonGroup, Divider, Paper, Stack, Typography} from '@mui/material';
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

    get CapitalizedName():String {
        return this.props.name.substring(0,1).toUpperCase()+this.props.name.substring(1);
    }

    render(): ReactNode {
        return(
            <Item key={ this.props._id.toString()} sx={{ 
                display: "flex", 
                flexDirection:'row', 
                flexGrow:'1',
                alignItems: 'center'
              }}>
                <Typography variant="h5" sx={{ m: 2 }}>{this.CapitalizedName}</Typography>
                <ButtonGroup sx={{justifyContent: 'end'}} disabled variant="contained" aria-label="outlined primary button group">
                    <Button>{Math.min(...this.props.days)}</Button>
                    <Button>{Math.max(...this.props.days)}</Button>
                </ButtonGroup>
            </Item>
        );
    }
}