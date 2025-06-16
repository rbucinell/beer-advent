"use client";

import React, { useEffect, useState } from "react";
import { useEvent, useEventParticipants } from "@hooks/hooks";
import { Alert, Box, Button, List, ListItemText, Modal, Stack, Typography } from "@mui/material";
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { Directions } from "@mui/icons-material";
import ParticipantItem from "@/components/ParticipantItem";
import PendingItem from "@/components/PendingItem";

export default function Home() {

  const params = new URLSearchParams(window.location.search);
  const eventYear = params.get('year') ?? new Date().getFullYear();

  const { event, eventError, eventLoading } = useEvent({ year: eventYear });
  const { participants, participantsError, participantsLoading } = useEventParticipants(event);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <div className="w-full p-2 max-w-3xl mx-auto">

      <Stack marginBottom={1} direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"baseline"} flexDirection={"row-reverse"} flexWrap={"wrap"}>
        {event && event.rules && event.rules.length > 0 &&
          <Button type="button" variant="outlined" color="warning" onClick={handleOpen}>Rules</Button>
        }
        {event && event.exchange && new Date() <= new Date(event.exchange.date) &&
          <a href={`https://maps.google.com/?q=${event.exchange.location.name}`} target="_blank" rel="noreferrer">
            <Alert icon={<Directions fontSize="inherit" />} severity="info">{AbrvDate(event.exchange.date)} @ {event.exchange.location.name}</Alert>
          </a>
        }
        {event && <Typography variant="h6">{event.name}🎄</Typography>}
      </Stack>
      <Stack spacing={0.5}>
        {Array.from({ length: 12 }, (_, index) =>
          participants && participants[index] ? (
            <ParticipantItem key={participants[index]._id.toString()} participant={participants[index]} />
          ) : (
            <PendingItem key={index} />
          )
        )}
      </Stack>
      <Typography variant="caption"><SportsBarIcon fontSize="small" sx={{ color: '#333333' }} /> = Beer Submitted</Typography>
      {event && <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          width: { xs: '90vw' }
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">Rules</Typography>
          <List >
            {event.rules && event.rules.map((rule, index) => <ListItemText key={index}>- {rule}</ListItemText>)}
          </List>
        </Box>
      </Modal>}
    </div>
  );
}

/**
 * Given a date string, return a short version of the date
 * @param {string} d date string
 * @returns {string} short version of the date
 */
function AbrvDate(d: Date) {
  const date = new Date(d);
  return `${date.getMonth() + 1}/${date.getDate()} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
