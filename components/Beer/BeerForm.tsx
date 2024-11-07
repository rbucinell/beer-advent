"use client";

import { IEvent } from "@/app/models/event";
import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { IUser } from "@/app/models/user";
import { Get } from "@/app/util/RequestHelper";
import { Autocomplete, Button, Grid, TextField, TextFieldVariants, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

interface BeerData {
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

const initBeer:BeerData = {
  brewer: '',
  beer: '',
  type: '',
  img: '',
  year: new Date().getFullYear(),
  abv: '',
  beeradvocate: '',
  untappd: '',
  state: 'pending'
};

export default function BeerForm() {

  const [event, setEvent]             = useState<IEvent>();
  const [beer, setBeer]                 = useState<BeerData>(initBeer);
  const [participant, setParticipant]   = useState<IParticipant|null>();
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [error, setError]               = useState([]);
  const [success, setSuccess]           = useState(false);
  
  useEffect(() => {
    (async () => {
      let eventResp = await Get<IEvent>(`api/event?year=${new Date().getFullYear()}`);
      setEvent(eventResp);
      let participantResp = await Get<IParticipant[]>(`api/participant?event=${eventResp._id}`);
      setParticipants(participantResp);
    })();

  }, []);

  const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    const res = await fetch("/api/beer", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...beer, participant, event })
    });

    const { msg, success } = await res.json();
    setError(msg);
    setSuccess(success);
    if( success ) {
      clearForm(null);
    }
  };

  const clearForm = (e:any ) => {
    window.location.reload();
  };

  function StandardTextField( target:keyof BeerData, label:string, type:string, req:boolean = true, variant:TextFieldVariants = "standard" ) {
    return (<TextField
      required = {req}
      id={target}
      name={target}
      type={type}
      label={label}
      fullWidth
      variant={variant}
      value={ beer[target] }
      onChange={(e: ChangeEvent<HTMLInputElement>) => setBeer({ ...beer, [e.target.name]: e.target.value })}
    />)
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>        
          <Grid item xs={12}>{StandardTextField( 'beer', 'Beer Name', "text")}</Grid>
          <Grid item xs={12}>{StandardTextField( 'brewer', 'Brewery Name', "text")}</Grid>
          <Grid item xs={12}>
            <Typography>Who is submitting this beer?</Typography>
            <Autocomplete  id="brewerName"  options={participants} 
              onChange={(e,newVal) => { setParticipant(newVal); }}
              getOptionLabel={(o:IParticipant)=>ParticipantName(o)}
              renderOption={(props, option) => (<li {...props} key={props.id} >{ParticipantName(option)}</li>)}
              renderInput={(params) => <TextField key={params.id} required {...params} label="Name" />}
            />
          </Grid>
          <Grid item xs={12}><Typography className="text-gray-400 italic">Optional Fields</Typography></Grid>
          <Grid item sm={9} xs={8}> {StandardTextField( 'type', "Beer Type", "text", false)}</Grid>
          <Grid item sm={2} xs={3}> {StandardTextField( 'abv', "ABV", "text", false)}</Grid>
          <Grid item xs={12}> {StandardTextField( 'beeradvocate', "Beer Advocate URL", "text", false)}</Grid>
          <Grid item xs={12}> {StandardTextField( 'untappd', "Untappd URL", "text", false)}</Grid>
          <Grid item xs={12}>
            <Button className="bg-blue-600 mx-1" variant="contained" type="submit">Submit</Button>
            <Button variant="outlined" type="button" onClick={clearForm}>Clear</Button>
          </Grid>       
        </Grid>
      </form>
      <div className="bg-slate-100 flex flex-col">
        {error && error.map((e,i) => (
            <div key={i} className={ `${ success ? "text-green-800" : "text-red-600" } px-5 py-2`} >{e} </div>
        ))}
      </div>
    </>);
}
