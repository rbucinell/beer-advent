"use client";

import { useState, useEffect } from "react";
import {Box,List,Button} from '@mui/material';
import { IBeer } from "@/app/models/beer";
import BeerListItem from "@/components/Beer/BeerListItem";


export default function History() {

  const [data, setData] = useState<IBeer[]>([]);

  useEffect(() => {
    // Create an async function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('api/beer', {
            method: 'GET'
        });
        if (response.ok) {
          const result = await response.json();
          setData(result.beers );
        } else {
          // Handle errors, e.g., set an error state
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // The empty dependency array [] ensures the effect runs only once on component mount

  return (
    <>
      <Box sx={{ width: '100%', height:'100%', bgcolor: 'background.paper' }}>
      { data ? (
        <List>
          {data.map( beer => <BeerListItem key={`${beer.year}${beer.day}${beer.beer}`} {...beer}/>)}
          </List>
      ) : (<p>Loading...</p> )}
    </Box>
    </>
  );
}
