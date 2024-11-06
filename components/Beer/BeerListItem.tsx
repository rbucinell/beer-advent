"use client";

import { Component } from "react";
import Image from "next/image";
import {IBeer} from "@/app/models/beer";
import { Box, Container, Divider, IconButton, ListItem, ListItemIcon,ListItemText, Stack } from '@mui/material';
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

interface IBeerListItemProps{
  beer:IBeer
  admin?:boolean
}

export default class BeerListItem extends Component<IBeerListItemProps>{
  
  beer:IBeer;
  admin:boolean;

  constructor( props:IBeerListItemProps ){
        super(props);
        this.beer = props.beer;
        this.admin = props.admin || false;
    }

    beerWithABV() {
      return `${this.beer.beer} ${this.beer.abv ? `[${this.beer.abv}% ABV]` : ''}`;
    }

    blurred(){
      return !(this.admin || this.beer.state !== 'pending');
    }

    render() {
      return (<>
        <ListItem sx={{ background: `${ this.beer.state ==='pending'? 'lightgreen' : ''}`}}>
          <ListItemIcon>
            <CalendarWithBadge num={this.beer.year}/>
          </ListItemIcon>
          <ListItemText primary={this.beerWithABV()} secondary={this.beer.brewer} 
            sx={{ filter: this.blurred() ? 'blur(5px)': 'inherit', 
                  color: this.blurred() ? 'transparent':'inherit',
                  userSelect: this.blurred() ? 'none':'inherit'}}/>
            {/* <span>{Capitalize(this.beer.person)}</span> */}
            <Stack direction={"row"} display={ this.blurred() ? 'none':'flex' } >          
              {this.beer.beeradvocate ? <BeerButton url={this.beer.beeradvocate} source="beeradvocate" /> : null}
              {this.beer.untappd ?      <BeerButton url={this.beer.untappd}      source="untappd" /> : null}
            </Stack>
        </ListItem>
        <Divider key={`${this.beer.year}${this.beer.day}${this.beer.beer}-divider`} variant="middle" component="li" color="black" />
      </>);        
    }
}