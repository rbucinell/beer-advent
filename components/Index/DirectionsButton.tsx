import { IEvent } from '@/app/models/event';
import { Directions } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { Component } from 'react';

interface DirectionsButtonProps {
  event?: IEvent;
}

export default function DirectionsButton(props: DirectionsButtonProps) {

  const event = props.event;

  const eventExists = event !== undefined && event !== null;
  const exchangeExists = event?.exchange !== undefined && event?.exchange !== null;


  return (eventExists && exchangeExists) ?
    <Button
      startIcon={<Directions />}
      type="button"
      variant="contained"
      color="info"
      target="_blank"
      rel="noreferrer"
      href={`https://maps.google.com/?q=${event.exchange?.location.name}`}>
      Exchage
    </Button>
    : <></>
}
