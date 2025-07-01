"use client";
import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Component, ReactNode } from "react";
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { SwapVert, Textsms, Delete } from "@mui/icons-material";
import { IOldUsers } from "@/app/models/oldusers";
import ListItem from "@/components/ListItem";
import { Types } from "mongoose";
import { IBeer } from "@/app/models/beer";
import DayIcon from "@/components/DayIcon";
import { IAuthUser } from "@/app/models/authuser";

interface ParticipantItemProps {
  participant: IParticipant;
  user: IAuthUser;
  xmas: IParticipant | null;
}

export default class AdminBeerManagementItem extends Component<ParticipantItemProps, {}> {

  participant: IParticipant;
  user: IAuthUser;
  xmas: IParticipant | null;
  beers: IBeer[];

  constructor(props: ParticipantItemProps) {
    super(props);
    this.participant = props.participant;
    this.user = props.user;
    this.xmas = props?.xmas;
    this.beers = [];
  }

  setBeerState(beerIds: Types.ObjectId[]) {
    this.getBeers(beerIds)
      .then(beers => this.setState(this.beers = beers));
  }

  componentDidMount(): void {
    try {
      this.setBeerState(this.participant.beers);
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps: Readonly<ParticipantItemProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (prevProps.participant !== this.props.participant) {
      this.setBeerState(this.props.participant.beers);
    }
  }

  async getBeers(beerIds: Types.ObjectId[]) {
    const beers = await Promise.all(beerIds.filter(_ => _ != null).map(async (id) => {
      return await fetch(`/api/beer/${id}`).then(res => res.json());
    }));
    beers.sort((a, b) => a.day - b.day);
    return beers;
  }

  handleSummaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    let message = `Hello ${this.user.name.split(' ')[0]} your days are ${this.participant.days.join(" & ")}. Your secret santa is ${ParticipantName(this.xmas)}`;
    navigator.clipboard.writeText(message);
    console.log(message);
  }

  swapBeers = async (e: React.MouseEvent) => {
    e.preventDefault();
    await Promise.all([
      fetch(`/api/beer/${this.beers[0]._id}`, { method: 'PUT', body: JSON.stringify({ day: this.beers[1].day }) }),
      fetch(`/api/beer/${this.beers[1]._id}`, { method: 'PUT', body: JSON.stringify({ day: this.beers[0].day }) })
    ]);

    console.log(this, e, this.participant.beers.join(','));
    this.participant.beers = this.participant.beers.reverse();
    this.setBeerState(this.participant.beers);
  }

  removeBeer = async (e: React.MouseEvent, beer: IBeer) => {
    e.preventDefault();
    const response = await fetch(`/api/participant/${this.participant._id}/beers/${beer._id}`, { method: 'DELETE' });
    //todo: update participant state
  }

  render(): ReactNode {
    return (
      <ListItem sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Stack direction={'column'} alignItems={'flex-start'}>
          <Typography variant="h5" sx={{ textOverflow: 'ellipsis' }}>👤{ParticipantName(this.props.participant)}</Typography>
          <Typography variant="caption" sx={{ textOverflow: 'ellipsis' }}>🎅{ParticipantName(this.props.xmas)}</Typography>
        </Stack>
        <Stack direction={'row'} flexWrap={'wrap'} alignItems={'flex-end'}>
          <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1} alignItems={'flex-end'}>
            <Stack direction={'row'} spacing={1}>
              {this.beers[0] && (
                <Stack direction={'row'} spacing={1} alignItems={'flex-start'}>
                  <IconButton type="button" size="small" sx={{ outline: '1px solid' }} onClick={(e) => this.removeBeer(e, this.beers[0])}>
                    <Delete fontSize="small" />
                  </IconButton>
                  <Typography>{this.beers[0].beer}. {this.beers[0].brewer}</Typography>
                </Stack>
              )}
              <DayIcon day={Math.min(...this.props.participant.days)} />
            </Stack>

            <Stack direction={'row'} spacing={1} >
              {this.beers[1] && (
                <Stack direction={'row'} spacing={1} alignItems={'flex-start'}>
                  <IconButton type="button" size="small" sx={{ outline: '1px solid' }} onClick={(e) => this.removeBeer(e, this.beers[1])}>
                    <Delete fontSize="small" />
                  </IconButton>
                  <Typography>{this.beers[1].beer}. {this.beers[1].brewer}</Typography>
                </Stack>
              )}
              <DayIcon day={Math.max(...this.props.participant.days)} />
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'row', sm: 'column' }} spacing={1} sx={{ ml: 2 }}>
            <Button type="button" variant="outlined" color="info" startIcon={<SwapVert />} disabled={this.beers.length < 2} onClick={this.swapBeers.bind(this)}>Swap Days</Button>
            <Button type="button" variant="outlined" color="secondary" startIcon={<Textsms />} onClick={this.handleSummaryClick.bind(this)}>Summary</Button>
          </Stack>
        </Stack>
      </ListItem>
    );
  }
}
