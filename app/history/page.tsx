"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { IBeer } from "@/app/models/beer";
import BeerListItem from "@/components/Beer/BeerListItem";
import TextField from "@mui/material/TextField";
import { Get } from "../util/RequestHelper";
import { useBeers, useEvents } from "@hooks/hooks";
import { IEvent } from "../models/event";

export default function History() {
  const { events, eventsError, eventsLoading } = useEvents();
  const { beers, beersError, beersLoading } = useBeers();
  const [q, setQ] = useState("");
  const [searchParamters] = useState(["beer", "brewer"]);

  function search(items: any): IBeer[] {
    return items.filter((item: any) => {
      return searchParamters.some((newItem: any) => {
        return (
          item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
        );
      });
    });
  }

  return (
    <div className="w-full flex flex-col">
      <List dense={true} className="flex flex-row w-full justify-start gap-3">
        <Typography>Go to advent:</Typography>
        {events && events.toSorted( (a,b) => b.year - a.year )
            .filter((e) => e.year !== new Date().getFullYear())
            .map((event: IEvent) => {
              return (
                <Button
                  variant="outlined"
                  className="border bg-slate-100 border-slate-950 rounded"
                  href={`/event/${event.year}`}
                >
                  <ListItemText primary={event.year} />
                </Button>
              );
            })}
      </List>

      <div className="w-full h-full overflow-clip bg-white rounded-lg border border-slate-900">
        <div className="flex flex-row items-center gap-1 border-b-2 border-solid bg-slate-200 border-black">
          <label
            className="ml-2 bg-slate-200 border-r-1 border-solid border-black justify-center"
            htmlFor="search-beers"
          >
            Search
          </label>
          <input
            type="text"
            id="search-beers"
            name="search-beers"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border-none bg-slate-100"
          />
        </div>

        {beers ? (
          <ul className="max-h-full overflow-auto">
            {search(beers).map((beer) => (
              <BeerListItem
                key={`${beer.year}${beer.day}${beer.beer}`}
                beer={beer}
              />
            ))}
            <li className="h-16"></li>
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>

    // <>
    //   <Box sx={{ width: '100%', height:'90vh', overflow:'clip', bgcolor: 'background.paper' }}>
    //     <TextField
    //       value={q}
    //       onChange={(  e:any) => setQ(e.target.value)}
    //       sx={{mb: 1}} className="bg-slate-200 l border-b-2 border-solid border-black"
    //       fullWidth id="outlined-basic" label="Search" variant="outlined" />
    //     { beers ? (
    //       <List sx={{ mb: 2}} style={{maxHeight: '100%', overflow: 'auto'}}>
    //         {search(beers).map( beer =>
    //             <BeerListItem key={`${beer.year}${beer.day}${beer.beer}`} beer={beer}/>
    //         )}
    //         <ListItem sx={{ height: '60px' }}></ListItem>
    //       </List>
    //     ) : (<p>Loading...</p> )}
    // </Box>
    // </>
  );
}
