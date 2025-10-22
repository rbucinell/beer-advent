"use client";

import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { useBeers, useEvent, useEventParticipants } from "@hooks/hooks";
import { authClient } from "@/lib/auth-client";

import { Get, Post, Put, Delete } from "@/app/util/RequestHelper";
import { getEventParticipant } from "@/app/util/participation";

import { AvatarGroup, Button, IconButton, TextField, TextFieldVariants, Typography } from "@mui/material";
import { Check, Delete as DeleteIcon, Remove, Search } from "@mui/icons-material";

import { toast } from "sonner";
import { BeerSimilarityValidation } from "../api/beer/check/BeerSimilarityValidation";
import {Alert} from "../components/ui/alert";
import Link from "next/link";
import Participant, { IParticipant } from "../models/participant";
import { mutate } from "swr";
import DayIcon from "@/components/DayIcon";
import { Shuffle } from "lucide-react";

interface IBeerFormData {
  brewer: string;
  beer: string;
  type: string;
  img: string;
  year: number;
  abv: string;
  beeradvocate: string;
  untappd: string;
  state: string;
}

const initBeer: IBeerFormData = {
  brewer: "",
  beer: "",
  type: "",
  img: "",
  year: new Date().getFullYear(),
  abv: "",
  beeradvocate: "",
  untappd: "",
  state: "pending",
};

export default function SubmitBeer() {
  
  const year = new Date().getFullYear();
  const { data: session, isPending, error: sessionError, refetch } = authClient.useSession();
  const { event, eventError, eventLoading } = useEvent({ year: year });
  const { participants, participantsError, participantsLoading } = useEventParticipants( event );
  const [ authParticipant, setAuthParticipant ] = useState<IParticipant|null>( null );
  const { beers, beersError, beersLoading} = useBeers();
  const [beer, setBeer] = useState<IBeerFormData>(initBeer);
  const [error, setError] = useState<string[] | null>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
  if (participants && session?.user?.id) {
    const found = participants.find(p => p.user.toString() === session.user.id);
    setAuthParticipant(found || null);
  } else {
    setAuthParticipant(null);
  }
}, [participants, session?.user?.id]);

  const checkBeer = async () => {
    console.log( beer );
    const validation = await Get<BeerSimilarityValidation>(`/api/beer/check?beer=${beer.beer}&brewer=${beer.brewer}`);

    if (validation.isTooSimilar) {
      const closest = validation.beer;
      setError([
        `"${beer.beer}" by ${beer.brewer}. Too close to existing [${closest?.beer} by ${closest?.brewer}]. Please tell, text Ryan if this is not correct.`,
      ]);
      setSuccess(false);
      toast.warning("Beer not submitted, too close to existing");
    } else {
      toast.success("No conflicting beers found");
      setSuccess(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const participant = await getEventParticipant(event, session?.user.id);
    if (!participant) {
      setSuccess(false);
      toast.error("Error associating current user to the current event");
      return;
    }

    const res = await Post<any, any>(`/api/beer`, {
      ...beer,
      participant,
      event,
    });

    const { msg, success } = res;
    setError(msg);
    toast.info( msg );
    setSuccess(success);
    if (success) {
      clearForm(null);
    }
  };

  const deleteBeer = async (beerId: string) => {
    
    console.log( `Delete ${beerId}`)
    if( !event ) {
      toast.error( "Event not loaded");
      return;
    }

    if( !authParticipant ){
      toast.error( "Authenticated user not found in event");
      return;
    }
    
    const foundBeer = beers?.find( _ => _._id.toString() === beerId );
    await Delete(`/api/participant/${authParticipant._id}/beers/${beerId}`);
    await mutate(`/api/events/${event?.year}/participants`);
    toast.success( `Deleted ${foundBeer?.beer} and removed it from ${ authParticipant.name}`)
  }

  const swapBeers = async (e: React.MouseEvent, participant:IParticipant) => {

    let participantBeers = participant.beers.map( b => beers?.find( _ => _._id == b));
    e.preventDefault();
    await Promise.all([
      fetch(`/api/beer/${participantBeers[0]?._id}`, { method: 'PUT', body: JSON.stringify({ day: participantBeers[1]?.day }) }),
      fetch(`/api/beer/${participantBeers[1]?._id}`, { method: 'PUT', body: JSON.stringify({ day: participantBeers[0]?.day }) })
    ]);
    participant.beers = participant.beers.reverse();
    await Put(`/api/participant?id=${participant._id}`, participant );
    await mutate(`/api/events/${event?.year}/participants`);
  }

  const clearForm = (e: any) => {
    window.location.reload();
  };

  function StandardTextField(
    target: keyof IBeerFormData,
    label: string,
    type: string,
    req: boolean = true,
    variant: TextFieldVariants = "standard"
  ) {
    return (
      <TextField
        required={req}
        id={target}
        name={target}
        type={type}
        label={label}
        fullWidth
        variant={variant}
        value={beer[target]}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setBeer({ ...beer, [e.target.name]: e.target.value });
          setError(null);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {!session && <Alert level="warning" >Please <Link href={"/sign-in"}>Sign In</Link></Alert> }
      {session && event && (

        <div className="flex flex-col gap-2">

        { authParticipant && authParticipant?.beers?.filter( b => b).length > 0 &&
          <Alert level="info">Submitted Beers:

          { authParticipant.days.map ( (day,i) => {
            let beer = beers?.find(b => b._id ==  authParticipant.beers[i] );
            return <div key={i} className="w-full flex gap-1 mb-2">
              <DayIcon day={day} />
              <div className="flex flex-row gap-1 w-full items-start px-2">
                {beer && <>
                  <h3 className="font-bold">{beer.beer} <small className="font-light"> {beer.brewer}</small></h3>
                </>}
              </div>
              {beer &&
              <Button className="ml-auto" color="error" onClick={() =>deleteBeer(beer._id.toString())} startIcon={<DeleteIcon/>}></Button>}
            </div>
          })}
          { authParticipant.beers && authParticipant.beers.length > 1 && 
            <Button className="ml-auto" color="secondary" startIcon={<Shuffle/>} 
              sx={{ outline: '1px solid' }}
              onClick={(e) => swapBeers(e,authParticipant)}
              > Swap Days</Button>
          }
{/* 
            {authParticipant?.beers?.filter( b => b).map( (beerId, index) => {
              let beer = beers?.find(b => b._id == beerId );
              return beer ? <div className="flex justify-between"  key={index}>
                <span className="justify-self-start"> {beer.beer} - {beer.brewer}</span>
                <Button className="ml-auto" color="error" onClick={() =>deleteBeer(beer._id.toString())} startIcon={<DeleteIcon/>}></Button>
              </div> : <Fragment key={index} />
            })} */}

        </Alert>}

        <form onSubmit={handleSubmit}>
          <div className="p-2 flex flex-col justify-start rounded-md bg-white">
            <div className="my-2">
              {session?.user.name}, submit your beer for {event?.year}
            </div>
            <div className="my-2">
              {StandardTextField("beer", "Beer Name", "text")}
            </div>
            <div className="my-2">
              {StandardTextField("brewer", "Brewery Name", "text")}
            </div>
            <Typography className="text-gray-400 italic">
              Optional Fields
            </Typography>
            <div className="flex flex-row">
              {StandardTextField("type", "Beer Type", "text", false)}
              {StandardTextField("abv", "ABV", "text", false)}
            </div>
            {StandardTextField(
              "beeradvocate",
              "Beer Advocate URL",
              "text",
              false
            )}
            {StandardTextField("untappd", "Untappd URL", "text", false)}
            <div className="my-2 flex flex-row lg:max-w-1/2 self-center flex-wrap justify-between gap-2">
              <Button variant="outlined" type="button" onClick={clearForm}>
                Clear
              </Button>
              <Button className="bg-orange-600 mx-1" variant="contained" type="button" color="warning"
                disabled={!beer.beer} onClick={checkBeer} >
                <Search />
                Check
              </Button>
              <Button
                className="bg-blue-600 mx-1"
                variant="contained"
                type="submit"
                color="primary"
                disabled={!beer.beer || !beer.brewer || !session || !success}
              >
                <Check /> Submit
              </Button>
            </div>
          </div>
        </form>

        </div>
      )}

      <div className="bg-slate-100 flex flex-col">
        {error && error.map((e, i) => (
            <div key={i} className={`${success ? "text-green-800" : "text-red-600"} px-5 py-2`}>
              {e}{" "}
            </div>
          ))}
      </div>
    </div>
  );
}
