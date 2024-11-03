"use client";

import { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Get, Post } from "@/app/util/RequestHelper";
import { IEvent } from "@/app/models/event";
import AdminParticipantItem from "@/app/admin/compontents/AdminParticipantItem";
import { IParticipant } from "@/app/models/participant";
import { IUser } from "@/app/models/user";
import { styled } from "@mui/material/styles";
import PendingItem from "@/components/PendingItem";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

const Btn = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#0000FF",
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
        let advent = await Get<IEvent>(`/api/event?year=${new Date().getFullYear()}`);
        setAdvent(advent);

        //Get all Participants for event
        let participantResp = await Get<IParticipant[]>(`/api/participant?event=${advent._id}`);
        setParticipants(participantResp);  
        
        //Get all Users
        let userResponse = await await Get<IUser[]>('/api/user');
        setUsers(userResponse);
        
        setParticipatingUsers( participantResp.map( p => users.find( u => u._id === p.user) as IUser) );   
    })(); 
  }, [] );

  async function handleRegisterClick( e: React.MouseEvent<HTMLButtonElement> ) {
    e.preventDefault();

    if( !user ) return;
    if( !advent ) return;
    console.log(user);
    const res = await Post(`/api/event/${advent._id}/participant`, { user: user._id });

    console.log("handleClick");
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
        <Typography variant="h6">{user && `${user.firstName} ${user.lastName} (${user.email})`}</Typography>
        <Typography variant="h6">{advent?.name}🎄</Typography>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Stack>
                {Array.from({ length: 12 }, (_, index) =>
                {
                    return participants && participants[index] ? (
                            <AdminParticipantItem key={index} participant={participants[index]} user={ users.find(u => u._id === participants[index].user) as IUser}/>
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
