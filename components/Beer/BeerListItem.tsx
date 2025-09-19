"use client";

import { Component } from "react";
import Image from "next/image";
import {IBeer} from "@/app/models/beer";
import {Chip, IconButton, ListItem, ListItemIcon,ListItemText, Stack, Typography } from '@mui/material';
// import { Capitalize, ParticipantName } from "@/app/models/participant_util";
import CalendarWithBadge from "../CalendarWithBadge";
import dayjs from "dayjs";
import { Percent } from "@mui/icons-material";

interface IBeerButton{
  url:string,
  source:string
}

class BeerButton extends Component<IBeerButton> {
  render(){
    const{ url, source} = this.props;
    const noUrl = url === undefined || url === '';
    return (
      <IconButton size="large" className={`m-1 p-1 ${noUrl?'grayscale opacity-20':'opacity-100'}`} aria-label={source} disabled={noUrl} href={url} target="_blank">
        <Image src={`/${source}-logo.png`} className="rounded" height={25} width={25} alt={`${source} logo`}/>    
      </IconButton>
    )
  }
}

interface IBeerListItemProps{
  beer:IBeer
  includeYear?:boolean
  admin?:boolean
}

export default class BeerListItem extends Component<IBeerListItemProps>{
  
  beer:IBeer;
  admin:boolean;
  includeYear:boolean;

  constructor( props:IBeerListItemProps ){
        super(props);
        this.beer = props.beer;
        this.admin = props.admin || false;
        this.includeYear = props.includeYear === undefined || props.includeYear === null ? true : props.includeYear;
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
      return (
        <ListItem sx={{ p:0, background: `${ this.isBeerDateSameOrAfterNow() ? 'lightgreen' : ''}`}}>
          { this.includeYear && <ListItemIcon>
            <IconButton size="large" aria-label="calendar" href={`/event/${this.beer.year}`} >
              <CalendarWithBadge num={this.beer.year}/>
            </IconButton>
          </ListItemIcon>}
          <ListItemText 
            primary={this.beer.beer} 
            secondary=
              {<Stack direction={'row'} gap={0.5}>
                <Typography>{this.beer.brewer}</Typography>
                
                {/* <div className="rounded-md flex items-center border border-slate-300 py-0.5 px-2.5 text-center text-sm transition-all shadow-sm text-slate-600">
                {this.beer.abv ?? '--'}
                <Percent className="w-4 h-4 mr-1.5"/>
                </div>
                <div className="mx-2 rounded-full bg-red-300 py-0.5 pl-2 border border-transparent text-xs text-white transition-all shadow-sm">
                  {this.beer.abv ?? '--'}
                  <Percent className="h-3"/>
                </div> */}
              </Stack>}
            sx={{ filter: this.blurred() ? 'blur(3px)': 'inherit', 
                  color: this.blurred() ? 'transparent':'inherit',
                  userSelect: this.blurred() ? 'none':'inherit'}}/>
            {/* <span>{Capitalize(this.beer.person)}</span> */}
            <div className="rounded-full flex items-center bg-red-300 py-0.5 pr-1 max-h-6 pl-2 border border-transparent text-sm text-white transition-all shadow-sm">
                  {this.beer.abv ?? '--'}
                  <div className="h-5 w-5 mr-2">
                    <Percent className="h-full w-full rounded-full object-cover object-center"/>
                  </div>
                </div>
            <div className={`${this.blurred() ? 'none':'flex'} flex-col md:flex-row flex-shrink-0`}>
              <BeerButton url={this.beer.beeradvocate} source="beeradvocate" />
              <BeerButton url={this.beer.untappd}      source="untappd" />
            </div>
        </ListItem>);        
    }
}