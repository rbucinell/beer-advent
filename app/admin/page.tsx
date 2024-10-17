"use client";

import { useState, useEffect } from "react";
import { Box,List } from '@mui/material';
import { IBeer } from "@/app/models/beer";
import BeerListItem from "@/components/Beer/BeerListItem";
import TextField from '@mui/material/TextField';
import { Get } from "@/app/util/RequestHelper";
import { IParticipant } from "../models/participant";

export default function History() {

  const [beers, setBeers] = useState<IBeer[]>([]);
  const [q, setQ] = useState("");
  const [searchParamters] = useState(["beer", "brewer"]);
  const [participants, setParticipants] = useState<IParticipant[]>([]);

  useEffect(() => {
    (async () => { 
      let beers:IBeer[] = await Get<IBeer[]>('/api/beer');
      beers.sort( (a,b) => b.year - a.year );
      setBeers( beers ); 
    })(); 
  }, [] );

  function search(items:any): IBeer[] {
      return items.filter((item:any) => {
          return searchParamters.some((newItem:any) => {
              return (
                  item[newItem]
                      .toString()
                      .toLowerCase()
                      .indexOf(q.toLowerCase()) > -1
              );
          });
      });
  }

  return (
    <>
    <Box sx={{ width: '100%', height:'30vh', overflow:'clip', bgcolor: 'background.paper', mb:2 }}>
        { beers.filter( b => b.state === "pending" ) ? (
          <List sx={{ mb: 2}} style={{maxHeight: '100%', overflow: 'auto'}}>
            {beers.filter( b => b.state === "pending" ).map( beer => 
                <BeerListItem  key={`${beer.year}${beer.day}${beer.beer}`} {...beer}/>
            )}
          </List>
        ) : (<p>Loading Pending...</p> )}
    </Box>

      <Box sx={{ width: '100%', height:'60vh', overflow:'clip', bgcolor: 'background.paper' }}>
        <TextField 
          value={q} 
          onChange={(e:any) => setQ(e.target.value)} 
          sx={{mb: 1}} className="bg-slate-200 l border-b-2 border-solid border-black" 
          fullWidth id="outlined-basic" label="Search" variant="outlined" />
        { beers.filter( b => b.state !== "pending" ) ? (
          <List sx={{ mb: 2}} style={{maxHeight: '100%', overflow: 'auto'}}>
            {search(beers.filter( b => b.state !== "pending" )).map( beer => 
                <BeerListItem  key={`${beer.year}${beer.day}${beer.beer}`} {...beer}/>
            )}
          </List>
        ) : (<p>Loading...</p> )}
    </Box>
    </>
  );
}
