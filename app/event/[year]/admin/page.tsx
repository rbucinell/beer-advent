"use client";

import { Badge, Chip, Stack, Typography } from "@mui/material";
import { useEvent, useEventParticipants } from "@/app/hooks/hooks";
import { authClient } from "@/lib/auth-client";
import { Get, Post, Delete } from "@/app/util/RequestHelper";
import { IParticipant } from "@/app/models/participant";
import AdminBeerManagementItem from "./compontents/AdminBeerManagementItem";
import PendingItem from "@/components/PendingItem";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Admin() {

  const params = useParams<{ year:string }>();
  const year = parseInt(params.year);

  const { data: session, isPending, error: sessionError, refetch } = authClient.useSession();
  const { event, eventError, eventLoading } = useEvent({ year });
  const { participants, participantsError, participantsLoading } = useEventParticipants(event);  
  

  async function handleClearDaysDaysClick(e: React.MouseEvent) {
    e.preventDefault();
    if( !event) return;
    const response = await Delete( `/api/events/${event.year}/roll`, { days: true }) as any;
    if( response.status === 201 ){
      toast.info( "Successfully Purged Rolls");
    }
  }

  async function handleRollNumbersClick(e: React.MouseEvent) {
      e.preventDefault();
      if (!event) return;
      await Post(`/api/events/${event.year}/roll`, {
        days: true
      });
      toast.info("Rolls generated");
    }

  async function handleRollSecretClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!event) return;
    await Post(`/api/events/${event.year}/roll`, {
      xmas: true
    });
    toast.info("Secret Santa selected");
  }

  async function handleClearSecretClick(e: React.MouseEvent) {
    e.preventDefault();
    if( !event ) return;
    const response = await Delete( `/api/events/${event.year}/roll`, { xmas: true}) as any;
    if( response.status === 201 ){
      toast.info( "Successfully Purged Secret Santas");
    }
  }

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      { event && 
        
        <Stack direction={"column"}>

          {/* Page Header */}
          
          <div className="flex flex-row justify-between flex-wrap mb-2 gap-2">
            <div className="flex flex-row self-center">
              <Typography variant="h6"><Chip label="ADMIN"/>🎄 {event?.name} 🎄</Typography>
            </div>
            <div className="flex flex-row gap-1">
              <Button className="text-xs" onClick={handleRollNumbersClick}>Roll 📅</Button>
              <Button className="text-xs" onClick={handleClearDaysDaysClick}>Clear 📅</Button>
              <Button className="text-xs" onClick={handleRollSecretClick}>Roll 🎅</Button>
              <Button className="text-xs" onClick={handleClearSecretClick}>Clear 🎅</Button>
            </div>
          </div>
        
         <Stack spacing={0.5}>

          { participants?.map( (participant,index) =>{

            return <AdminBeerManagementItem
              key={index}
              participant={participant}
              //user={users.find(u => u._id === participant.user) as IAuthUser}
              xmas={participants.find(p => p._id === participant.xmas) as IParticipant}
            />
          })}

          { Array.from({ length: (12 - (participants?.length ?? 0))},(_, i) => <PendingItem key={i} /> ) }

          </Stack>
        </Stack>
      }
    </div>
  );
}
