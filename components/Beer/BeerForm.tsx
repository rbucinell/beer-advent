"use client";

import { IParticipant } from "@/app/models/participant";
import { ParticipantName } from "@/app/models/participant_util";
import { Get } from "@/app/util/RequestHelper";
import { Autocomplete, Button, Grid, TextField, TextFieldVariants, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

function StandardTextField( setFn:Dispatch<SetStateAction<string>>, label:string, type:string, req:boolean, variant:TextFieldVariants = "standard" ) {
    let parts = label.split(' ');
    let str = "";
    if( parts.length === 1) str = parts[0];
    else{
      parts[0] = parts[0].toLocaleLowerCase();
      for( let i = 1; i < parts.length; i++ )
      {
        parts[i] = parts[i][0].toLocaleUpperCase() + parts[i].substring(1);
      }
      str = parts.join('');
    }
    return (<TextField
    required = {req}
    id={str}
    name={str}
    type={type}
    label={label}
    fullWidth
    variant={variant}
    onChange={(e) => setFn(e.target.value) }
  />)
}

export default function BeerForm() {

  const [beer, setBeer]                 = useState("");
  const [brewer, setBrewer]             = useState("");
  const [beerType, setBeerType]         = useState("");
  const [abv, setABV]                   = useState("");
  const [beerAdvocate, setBeerAdvocate] = useState("");
  const [untappd, setUntappd]           = useState("");
  const [img, setImg]                   = useState("");
  const [participant, setParticipant]   = useState<IParticipant|null>();
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [error, setError]               = useState([]);
  const [success, setSuccess]           = useState(false);
  
  useEffect(() => {
    (async () => setParticipants( await Get<IParticipant[]>('api/participant')))();
  }, []);

  const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    const res = await fetch("api/beer", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        beer, brewer, beerType, img, participant, abv, beerAdvocate, untappd
      }),
    });

    const { msg, success } = await res.json();
    console.log( msg );
    setError(msg);
    setSuccess(success);
  };

  const clearForm = (e:any ) => {
      setBeer('');
      setBrewer('');
      setBeerType('');
      setABV('');
      setBeerAdvocate('');
      setUntappd('');
      setParticipant(null);
      setImg('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>{StandardTextField( setBeer, "Beer Name", "text", true)}</Grid>
          <Grid item xs={12}>{StandardTextField( setBrewer, "Brewer Name", "text", true)}</Grid>
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
          <Grid item sm={9} xs={12}> {StandardTextField( setBeerType, "Beer Type", "text", false)}</Grid>
          <Grid item sm={2} xs={12}> {StandardTextField( setABV, "ABV", "text", false)}</Grid>
          <Grid item xs={12}>{StandardTextField( setBeerAdvocate, "Beer Advocate URL", "text", false)}</Grid>
          <Grid item xs={12}>{StandardTextField( setUntappd, "Untappd URL", "text", false)}</Grid>
          <Grid item xs={12}>
            <Button className="bg-blue-600" variant="contained" type="submit">Submit</Button>
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
