"use client";

import { useState, useEffect } from "react";
import { Box,List, Typography } from '@mui/material';
import { IBeer } from "@/app/models/beer";
import BeerListItem from "@/components/Beer/BeerListItem";
import TextField from '@mui/material/TextField';
import { Get } from "@/app/util/RequestHelper";

export default function History() {

  const [beers, setBeers] = useState<IBeer[]>([]);
  const [q, setQ] = useState("");
  const [searchParamters] = useState(["beer", "brewer"]);

  useEffect(() => {
    (async () => { 
      let beerResponse:IBeer[] = await Get<IBeer[]>('/api/beer');
      beerResponse = beerResponse.filter( b => b.state === 'pending');
      setBeers( beerResponse ); 
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
      <Typography variant="h5">Admin</Typography>
      <Box sx={{ width: '100%', height:'90vh', overflow:'clip', bgcolor: 'background.paper' }}>
        <TextField 
          value={q} 
          onChange={(e:any) => setQ(e.target.value)} 
          sx={{mb: 1}} className="bg-slate-200 l border-b-2 border-solid border-black" 
          fullWidth id="outlined-basic" label="Search" variant="outlined" />
        { beers ? (
          <List sx={{ mb: 2}} style={{maxHeight: '100%', overflow: 'auto'}}>
            {search(beers).map( beer => 
                <BeerListItem  key={`${beer.year}${beer.day}${beer.beer}`} beer={beer} admin={true}/>
            )}
          </List>
        ) : (<p>Loading...</p> )}
    </Box>
    </>
  );
}
