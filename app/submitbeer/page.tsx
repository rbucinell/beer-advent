"use client";

import { ChangeEvent, useState } from "react";
import { useBeers, useEvent, useEventParticipants } from "@hooks/hooks";
import { authClient } from "@/lib/auth-client";

import { Get, Post } from "@/app/util/RequestHelper";
import { getParticipant } from "@/app/util/participation";

import { Button, TextField, TextFieldVariants, Typography } from "@mui/material";
import { Check, Delete, Remove, Search } from "@mui/icons-material";

import { toast } from "sonner";
import { BeerSimilarityValidation } from "../api/beer/check/BeerSimilarityValidation";
import { Cross } from "lucide-react";

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
  const { beers, beersError, beersLoading} = useBeers();
  const [beer, setBeer] = useState<IBeerFormData>(initBeer);
  const [error, setError] = useState<string[] | null>([]);
  const [success, setSuccess] = useState(false);

  const checkBeer = async () => {
    console.log( beer );
    const validation = await Get<BeerSimilarityValidation>(
      `/api/beer/check?beer=${beer.beer}&brewer=${beer.brewer}`
    );

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
    const participant = await getParticipant(event, session?.user.id);
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

    const { msg, success } = await res.json();
    setError(msg);
    toast.info( msg );
    setSuccess(success);
    if (success) {
      clearForm(null);
    }
  };

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
      {session && event && (

        <div className="flex flex-col gap-2">

        {participants && participants.find( p => p.user.toString() === session.user.id )?.beers.map( bId => {
          let beer = beers?.find(b => b._id == bId );
          return ( beer ? <div className="p-2 bg-amber-100 rounded w-full flex flex-row justify-between">
            <span>You have already submitted: {beer.beer} - {beer.brewer}</span>
            <Button className="border border-red-500" color="error" startIcon={<Delete/>}></Button>
          </div> : <></>)
        })}

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
