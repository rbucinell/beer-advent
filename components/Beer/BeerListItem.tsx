"use client";

import { Component } from "react";
import Image from "next/image";
import {IBeer} from "@/app/models/beer";
import {Button, ListItem, ListItemIcon,ListItemText } from '@mui/material';
import CalendarWithBadge from "../CalendarWithBadge";

interface IBeerButton{
  url:string,
  source:string
}

class BeerButton extends Component<IBeerButton> {
  render(){
    const{ url, source} = this.props;
  return(<Button variant="contained" sx={{bgcolor:'lightblue', p:1, mx:1}}  aria-label={source} href={url} target="_blank">
      <Image style={{ margin:0, padding:0, width:20}} src={`/${source}-logo.png`} height={20} width={20} alt={`${source} logo`} />    
    </Button>)
  }
}

export default class BeerListItem extends Component<IBeer>{
    constructor( props:IBeer ){
        super(props);
    }

    render() {
      return (
        <ListItem >
          <ListItemIcon>
            <CalendarWithBadge num={this.props.year}/>
          </ListItemIcon>
          <ListItemText primary={this.props.beer} secondary={this.props.brewer}/>
          <span style={{ display:"flex", flexDirection:"column" }}>
            {this.props.beeradvocate ? <BeerButton url={this.props.beeradvocate} source="beeradvocate" /> : null}
            {this.props.untappd ?      <BeerButton url={this.props.untappd}      source="untappd" /> : null}
          </span>
        </ListItem>
      );        
    }
}