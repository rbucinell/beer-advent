"use client";

import { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Paper, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Get, Post } from "@/app/util/RequestHelper";
import { IEvent } from "@/app/models/event";
import AdminParticipantItem from "@/app/admin/compontents/AdminParticipantItem";
import { IParticipant } from "@/app/models/participant";
import { IUser } from "@/app/models/user";
import { styled } from "@mui/material/styles";
import PendingItem from "@/components/PendingItem";

const Btn = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : theme.palette.background.paper,
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,    
}));

export default function History() {

    const [advent, setAdvent] = useState<IEvent|null>(null);
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [participatingUsers, setParticipatingUsers] = useState<IUser[]>([]);
    const [user, setUser] = useState<IUser|null>(null);

  useEffect(() => {
    (async () => {
        //Set the event
        let advent = await Get<IEvent>(`/api/events/${new Date().getFullYear()}`);
        setAdvent(advent);

        //Get all Participants for event
        let participantResp = await Get<IParticipant[]>(`/api/participant?event=${advent._id}`);
        setParticipants(participantResp);  
        
        //Get all Users
        let userResponse = await Get<IUser[]>('/api/user');
        setUsers(userResponse);
        
        setParticipatingUsers( participantResp.map( p => userResponse.find( u => u._id === p.user) as IUser) );   
    })(); 
  }, [] );

  async function handleRegisterClick( e: React.MouseEvent ) {
    e.preventDefault();
    if( !user ) return;
    if( !advent ) return;
    const res = await Post(`/api/events/${advent.year}/participant`, { user: user._id });
  }

  async function handleRollNumbersClick( e: React.MouseEvent ) {
    e.preventDefault();
    if( !advent ) return;
    await Post(`/api/events/${advent.year}/roll`, {
      days: true
    });
  }

  async function handleRollSecretClick( e: React.MouseEvent ) {
    e.preventDefault();
    if( !advent ) return;
    await Post(`/api/events/${advent.year}/roll`, {
      xmas: true
    });
  }

  return (
    <>
      <Box sx={{ width: '100%', overflow:'clip', bgcolor: 'background.paper', mb:2}}>
          <Stack direction="row" spacing={2}>
              <Typography>Register Who</Typography>
              <Autocomplete sx={{ flexGrow: 1}} id="brewerName"  options={users.filter(u => !participants.find(p => p.user === u._id))} 
                  onChange={(e,newVal) => { setUser(newVal); }}
                  getOptionLabel={(o:IUser)=>  `${o?.firstName} ${o?.lastName}` } 
                  renderOption={(props, option) => (<li {...props} key={props.id} >{option?.firstName} {option.lastName}</li>)}
                  renderInput={(params) => <TextField key={params.id} required {...params} label="Name" />}
              />
              <Button variant="outlined" onClick={handleRegisterClick}>Register</Button>
          </Stack>
      </Box>

      <Stack sx={{mb: 2}} direction={'row'} spacing={1}>
        <Btn sx={{bgcolor: "backgroundColor"}} className="text-xs" onClick={handleRollNumbersClick}>🎲 Roll Numbers</Btn>
        <Btn sx={{bgcolor: "backgroundColor"}} className="text-xs" onClick={handleRollSecretClick}>🎅 Roll Secret Santa</Btn>  
      </Stack>

      <Typography variant="h6">{user && `${user.firstName} ${user.lastName} (${user.email})`}</Typography>
      <Typography variant="h6">{advent?.name}🎄</Typography>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Stack>
              {Array.from({ length: 12 }, (_, index) => {
                return participants && participants[index] ? (
                        <AdminParticipantItem 
                          key={index} 
                          participant={participants[index]} 
                          user={ users.find(u => u._id === participants[index].user) as IUser}
                          xmas={ participants.find(p => p._id === participants[index].xmas) as IParticipant}
                        />
                    ) : (
                        <PendingItem key={index}/>
                    );
                }
              )}
          </Stack>
      </Box>
    </>
  );
}
