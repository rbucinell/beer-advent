"use client";

import { Component } from "react";
import {IBeer} from "@/app/models/beer";
import {ListItem, ListItemButton, ListItemIcon,ListItemText } from '@mui/material';
import {SportsBar} from '@mui/icons-material';


export default class BeerListItem extends Component<IBeer>{
    constructor( props:IBeer ){
        super(props);
    }

    render(){
        return (
        <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon><SportsBar /></ListItemIcon>
          <ListItemText primary={this.props.beer} secondary={this.props.brewer}/>
        </ListItemButton>
      </ListItem>);        
    }
}