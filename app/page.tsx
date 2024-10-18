"use client";

import { useState, useEffect } from "react";
import { IEvent } from "@/app/models/event";
import { IParticipant } from "@/app/models/participant";
import { IUser } from "@/app/models/user";
import { Avatar, Button, ButtonGroup, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ParticipantItem from "@/components/ParticipantItem";
import { Get } from "./util/RequestHelper";
import { DateRange, SortByAlpha } from "@mui/icons-material";
import { useUser } from "@clerk/nextjs";
import { IEventParticipant } from "./models/event-participant";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [advent, setAdvent] = useState<IEvent>();
  const [participants, setParticipants] = useState<IEventParticipant[]>([]);
  //const [users, setUser] = useState<IUser>();
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    (async () => {
      console.log( user );
      //const currentYear = (new Date()).getFullYear();
      const currentYear = 2024;
      setAdvent( await Get<IEvent>(`api/event?year=${currentYear}`) );
      let ipartipants = await Get<IEventParticipant[]>(`api/participant?year=${currentYear}`);
      console.log( ipartipants );
      // let beers = await Get<IBeer[]>(`api/beer?year=${currentYear}`);
      // ipartipants.forEach( ip => {
      //     ip.beers = beers
      //       .filter( b => b.person === ip.name )
      //       .map( beer => beer.beer );
      // });
      ipartipants.sort( (a: IEventParticipant, b: IEventParticipant) => {
        if( a.user === null || b.user === null ) return 0;
        let aComaritor = a.user?.fullName ?? a.user.id;
        let bComaritor = b.user?.fullName ?? b.user.id;
        if( aComaritor < bComaritor ) return -1;
        if( aComaritor > bComaritor ) return 1;
        return 0;
      } );
      setParticipants( ipartipants );
    })();
  }, [user] );

  function sortParticipantsAlpha( event:any )
  {
    console.log( 'sortParticipantsAlpha' );
  }

  function sortParticipantsDate( event:any )
  {
    console.log( 'sortParticipantsDate' );
  }

  const handleClick = async ( e: React.MouseEvent<HTMLButtonElement> ): Promise<void> => {
    e.preventDefault();
    console.log( 'handleClick:' );
    const res = await fetch("/api/participant/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
          "event": advent,
          "user": user
      })
    }); 
    const { msg, success } = await res.json();
    console.log( msg );
    console.log( success );
  };

  return (
    <div className='p-2 max-w-3xl mx-auto'>
        {/* <ButtonGroup size="small" variant="contained">
          <Button id="sortByAlpha" onClick={sortParticipantsAlpha}><SortByAlpha /></Button>
          <Button id="sortByDate"  onClick={sortParticipantsDate}><DateRange /></Button>
        </ButtonGroup> */}
      <Stack spacing={0.5}>
        {Array.from({ length: 12 }, (_, index) => ( participants && participants[index] ? 
          (
            <ParticipantItem key={participants[index]._id.toString()}
              {...participants[index]}
            />
          ) : (
            <Item key={index} 
                sx={{ 
                    display: "flex", 
                    flexDirection:'row', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h6" fontStyle={'italic'}>Pending...</Typography>
                {/* <Stack direction={'row'} spacing={2}>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral' }}>?</Avatar>
                    <Avatar variant="rounded" sx={{ bgcolor: 'lightcoral' }}>?</Avatar>
                </Stack> */}
            </Item>
            // <Skeleton key={index} sx={{ bgcolor: 'grey.200' }} variant="rounded" height={40} animation={false}/>
          )
        ))}
      </Stack>
      { isSignedIn && isLoaded && participants.length < 12 && (
        <Button 
          sx={{ mt: 2 }} 
          color="primary" 
          variant="contained"
          onClick={handleClick}>{`Register for Event`}
        </Button>
      ) }
    </div>
  );
}
