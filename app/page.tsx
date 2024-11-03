"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ParticipantItem from "@/components/ParticipantItem";
import { Get } from "./util/RequestHelper";

import { IEvent } from "@/app/models/event";
import { IParticipant } from "@/app/models/participant";
import { IUser } from "@/app/models/user";
import { DateRange, SortByAlpha } from "@mui/icons-material";
import PendingItem from "@/components/PendingItem";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [advent, setAdvent] = useState<IEvent>();
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    (async () => {
      let eventResp = await Get<IEvent>(`api/event?year=${new Date().getFullYear()}`);
      setAdvent(eventResp);
      let participantResp = await Get<IParticipant[]>(`api/participant?event=${eventResp._id}`);
      for( const participant of participantResp ) {
        let userResp = await Get<IUser>(`api/user/${participant.user}`);
        users.push(userResp);
      }
      setUsers(users);
      console.log(participantResp);
      setParticipants(participantResp);
    })();
  }, []);

  function sortParticipantsAlpha(event: any) {
    console.log("sortParticipantsAlpha");
  }

  function sortParticipantsDate(event: any) {
    console.log("sortParticipantsDate");
  }

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log("handleClick:");
    const res = await fetch("/api/participant/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        //"event": advent,
        //"user": user
      }),
    });
    const { msg, success } = await res.json();
    console.log(msg);
    console.log(success);
  };

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <Stack direction={"row"} spacing={2} justifyContent={"space-between"} flexDirection={"row-reverse"}>
        <ButtonGroup sx={ { display: "none" }} size="small" variant="contained">
        <Button id="sortByAlpha" onClick={sortParticipantsAlpha}>
          <SortByAlpha />
        </Button>
        <Button id="sortByDate" onClick={sortParticipantsDate}>
          <DateRange />
        </Button>
        </ButtonGroup>
        <Typography variant="h6">{advent?.name}🎄</Typography>
      </Stack>
      <Stack spacing={0.5}>
        {Array.from({ length: 12 }, (_, index) =>
          participants && participants[index] ? (
            <ParticipantItem 
              participant={participants[index]} 
              user={ users.find(u => u._id === participants[index].user) as IUser}/>
          ) : (
            <PendingItem/>
          )
        )}
      </Stack>
      {/* {participants.length < 12 && (
        <Button
          sx={{ mt: 2 }}
          color="primary"
          variant="contained"
          onClick={handleClick}
        >
          {`Register for Event`}
        </Button>
      )} */}
    </div>
  );

  // return (
  //   <div className='p-2 max-w-3xl mx-auto'>
  //     {/* <Typography variant="h4" sx={{ m: 1 }}>
  //       { advent ? advent.name : "Beer Advent"}
  //     </Typography> */}
  //     <Stack spacing={1}>
  //       { participants ?
  //         participants.map( (participant) =>
  //         (
  //           <ParticipantItem key={participant._id.toString()} {...participant}/>
  //         ) )
  //         : (<Item> Loading Participants </Item>)
  //       }
  //   </Stack>
  //   </div>
  // );
}
