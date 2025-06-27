"use client";
import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Component, ReactNode } from "react";
import { Avatar, AvatarGroup, Button, Stack, Typography } from '@mui/material';
import { IOldUsers } from "@/app/models/oldusers";
import ListItem from "@/components/ListItem";
import DayIcon from "@/components/DayIcon";

interface ParticipantItemProps {
  participant: IParticipant;
  user: IOldUsers;
  xmas: IParticipant | null;
}

export default class AdminParticipantItem extends Component<ParticipantItemProps, {}> {

  participant: IParticipant;
  user: IOldUsers;
  xmas: IParticipant | null;

  constructor(props: ParticipantItemProps) {
    super(props);
    this.participant = props.participant;
    this.user = props.user;
    this.xmas = props?.xmas;
  }

  handleSummaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    let message = `Hello ${this.user.firstName} your days are ${this.participant.days.join(" & ")}. Your secret santa is ${ParticipantName(this.xmas)}`;
    navigator.clipboard.writeText(message);
    console.log(message);
  }

  render(): ReactNode {
    return (
      <ListItem>
        <Stack direction={'column'} alignItems={'flex-start'}>
          <Typography variant="body2" sx={{ textOverflow: 'ellipsis' }}>👤:{ParticipantName(this.props.participant)}</Typography>
          <Typography variant="body2" sx={{ textOverflow: 'ellipsis' }}>🎅:{ParticipantName(this.props.xmas)}</Typography>
        </Stack>
        <Stack direction={'row'} spacing={1}>
          <AvatarGroup>
            <DayIcon day={Math.min(...this.props.participant.days)} variant="circular" />
            <DayIcon day={Math.max(...this.props.participant.days)} variant="circular" />
          </AvatarGroup>
          <Button type="button" variant="outlined" onClick={this.handleSummaryClick.bind(this)}>Summary</Button>
        </Stack>
      </ListItem>
    );
  }
}
