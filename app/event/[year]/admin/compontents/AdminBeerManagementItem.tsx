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
import { toast } from "sonner";

interface ParticipantItemProps {
  participant: IParticipant;
  //user: IAuthUser;
  xmas: IParticipant | null;
}

export default class AdminBeerManagementItem extends Component<ParticipantItemProps, {}> {

  participant: IParticipant;
  //user: IAuthUser;
  xmas: IParticipant | null;
  beers: IBeer[];

  constructor(props: ParticipantItemProps) {
    super(props);
    this.participant = props.participant;
    //this.user = props.user;
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
    let message = `Hello ${this.participant.name} your days are ${this.participant.days.join(" & ")}. Your secret santa is ${ParticipantName(this.xmas)}`;
    navigator.clipboard.writeText(message);
    toast.info(message);
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
      <ListItem sx={{ alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap' }}>

        <div className="w-full flex flex-row items-start justify-between">
          <span className="text-xl">👤{ParticipantName(this.props.participant)}</span>
          <span className="text-sm self-center">🎅{ParticipantName(this.props.xmas)}</span>
        </div>

        {
          this.participant.days.map ( (day,i) => {
            const beer = this.beers[i];
            return <div key={i} className="w-full flex gap-1 mb-2">
              <DayIcon day={day} />
              <div className="flex flex-col grow items-start px-2">
                {beer && <>
                  <h3 className="font-bold">{beer.beer}</h3>
                  <h3>{beer.brewer}</h3>
                </>}
              </div>
              {beer &&
              <IconButton type="button" size="medium" sx={{ outline: '1px solid', aspectRatio: 1 }} onClick={(e) => this.removeBeer(e, beer)}>
                <Delete fontSize="small" />
              </IconButton>}
            </div>
          })
        }
        
        <div className="flex flex-row justify-center w-full gap-2">
            <Button type="button" variant="outlined" color="info" startIcon={<SwapVert />} disabled={this.beers.length < 2} onClick={this.swapBeers.bind(this)}>Swap Days</Button>
            <Button type="button" variant="outlined" color="secondary" startIcon={<Textsms />} onClick={this.handleSummaryClick.bind(this)}>Summary</Button>
        </div>

      </ListItem>
    );
  }
}
