"use client";

import { useState, useEffect } from "react";
import { IEvent } from "@/app/models/event";
import { IParticipant } from "@/app/models/participant";
import {Box, Button, ButtonGroup, Divider, Paper, Stack, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {

  const [advent, setAdvent] = useState<IEvent>();
  const [participants, setParticipants] = useState<IParticipant[]>([]);

  useEffect( () => {
    (async () =>{
      try{
        const eventResposne = await fetch( 'api/event', { method: 'GET' });
        if( eventResposne.ok ) {
          const eventJSON = await eventResposne.json();
          setAdvent(eventJSON);

          const participantsResponse = await fetch('api/participants', { method: 'GET'});
          if( participantsResponse.ok )
          {
            const participantsJSON = await participantsResponse.json();
            setParticipants(participantsJSON);
          }
        }
        else{
          console.error('Failed to fetch event data');
        }
      }catch( error ){
        console.error('An error occurred:', error);
      }
    })();
  }, [] );

  return (
    <div className='p-4 max-w-3xl mx-auto'>
      <Typography variant="h4" sx={{ m: 1 }}>{ advent ? advent.name : "Beer Advent"} </Typography>
      <Stack spacing={1}>
        { participants ? 
          participants.map( (p) =>
          (
            <Item key={p._id.toString()} sx={{ 
                display: "flex", 
                flexDirection:'row', 
                flexGrow:'1',
                alignItems: 'center'
              }}>
                <Typography variant="h5" sx={{ m: 2 }}>
              {p.name.substring(0,1).toUpperCase()+p.name.substring(1)}
              </Typography>
              <ButtonGroup sx={{justifyContent: 'end'}} disabled variant="contained" aria-label="outlined primary button group">
                <Button>{Math.min(...p.days)}</Button>
                <Button>{Math.max(...p.days)}</Button>
            </ButtonGroup>
            </Item>
          ) )
          : (<Item> Loading Participants </Item>)
        }
    </Stack>
    </div>
  );
}
