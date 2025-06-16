"use client";

import { Component } from "react";
import Image from "next/image";
import {IBeer} from "@/app/models/beer";
import { Box, Container, Divider, IconButton, ListItem, ListItemIcon,ListItemText, Stack } from '@mui/material';
// import { Capitalize, ParticipantName } from "@/app/models/participant_util";
import CalendarWithBadge from "../CalendarWithBadge";
import Link from "next/link";
import dayjs from "dayjs";

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
        this.isBeerDateSameOrAfterNow();
    }

    beerWithABV() {
      return `${this.beer.beer} ${this.beer.abv ? `[${this.beer.abv}% ABV]` : ''}`;
    }

    blurred(){
      return !(this.admin || !this.isBeerDateSameOrAfterNow() );
    }

    isBeerDateSameOrAfterNow() {      
      const beerDay = dayjs(`${this.beer.year}-12-${this.beer.day}`);
      return beerDay.isAfter(dayjs(),'day') || beerDay.isSame(dayjs(),'day');
    }

    render() {
      return (<>
        <ListItem sx={{ p:0, background: `${ this.isBeerDateSameOrAfterNow() ? 'lightgreen' : ''}`}}>
          <ListItemIcon>
            <IconButton size="large" aria-label="calendar" href={`/event/${this.beer.year}`} >
              <CalendarWithBadge num={this.beer.year}/>
            </IconButton>
          </ListItemIcon>
          <ListItemText primary={this.beerWithABV()} secondary={this.beer.brewer} 
            sx={{ filter: this.blurred() ? 'blur(3px)': 'inherit', 
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