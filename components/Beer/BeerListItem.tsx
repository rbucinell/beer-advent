"use client";

import { Component } from "react";
import Image from "next/image";
import {IBeer} from "@/app/models/beer";
import { Divider, IconButton, ListItem, ListItemIcon,ListItemText, Stack } from '@mui/material';
// import { Capitalize, ParticipantName } from "@/app/models/participant_util";
import CalendarWithBadge from "../CalendarWithBadge";

interface IBeerButton{
  url:string,
  source:string
}

class BeerButton extends Component<IBeerButton> {
  render(){
    const{ url, source} = this.props;
    return(<IconButton size="large" sx={{ p:0.5, m:0.5}} aria-label={source} href={url} target="_blank">
      <Image src={`/${source}-logo.png`} className="rounded" height={25} width={25} alt={`${source} logo`}/>    
    </IconButton>)
  }
}

export default class BeerListItem extends Component<IBeer>{
    constructor( props:IBeer ){
        super(props);
    }

    beerWithABV() {
      return `${this.props.beer} ${this.props.abv ? `[${this.props.abv}% ABV]` : ''}`;
    }

    render() {
      return (<>
        <ListItem sx={{ background: `${ this.props.state ==='pending'? 'lightgreen' : ''}`}}>
          <ListItemIcon>
            <CalendarWithBadge num={this.props.year}/>
          </ListItemIcon>
          <ListItemText primary={this.beerWithABV()} secondary={this.props.brewer}/>
          {/* <span>{Capitalize(this.props.person)}</span> */}
          <Stack direction={"row"}>          
            {this.props.beeradvocate ? <BeerButton url={this.props.beeradvocate} source="beeradvocate" /> : null}
            {this.props.untappd ?      <BeerButton url={this.props.untappd}      source="untappd" /> : null}
          </Stack>
        </ListItem>
        <Divider key={`${this.props.year}${this.props.day}${this.props.beer}-divider`} variant="middle" component="li" color="black" />
      </>);        
    }
}