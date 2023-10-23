"use client";

import { useState, useEffect, Component } from "react";
import Button from '@mui/material/Button';
import Beer,{IBeer} from "@/app/models/beer";
import {ListItem, ListItemButton, ListItemIcon,ListItemText } from '@mui/material';
import DraftsIcon from '@mui/icons-material/Drafts';


export default class BeerListItem extends Component<IBeer>{
    constructor( props:IBeer ){
        console.log( props )
        super(props);
    }

    render(){
        return (
        <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={this.props.beer} />
        </ListItemButton>
      </ListItem>);        
    }
}