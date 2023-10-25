"use client";

import { useState, useEffect } from "react";
import {Box,List, Divider} from '@mui/material';
import { IBeer } from "@/app/models/beer";
import BeerListItem from "@/components/Beer/BeerListItem";
import TextField from '@mui/material/TextField';


export default function History() {

  const [data, setData] = useState<IBeer[]>([]);
  const [q, setQ] = useState("");
  const [searchParamters] = useState(["beer", "brewer"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/beer', { method: 'GET' });
        if (response.ok) {
          const result = await response.json();
          setData(result.beers );
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchData();
  }, []);

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
      <Box sx={{ width: '100%', height:'90vh', overflow:'clip', bgcolor: 'background.paper' }}>
      <TextField value={q} onChange={(e:any) => setQ(e.target.value)} sx={{my: 1}} fullWidth id="outlined-basic" label="Search" variant="outlined" />
      { data ? (
        <List style={{maxHeight: '100%', overflow: 'auto'}}>
          {search(data).map( beer => 
            <>
              <BeerListItem key={`${beer.year}${beer.day}${beer.beer}`} {...beer}/>
              <Divider variant="middle" component="li" color="black" />
            </>
          )}
        </List>
      ) : (<p>Loading...</p> )}
    </Box>
    </>
  );
}
