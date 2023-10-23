"use client";

import { useState, useEffect } from "react";
import {Box,List,Button} from '@mui/material';
import BeerListItem from "./BeerListItem";
import { IBeer } from "@/app/models/beer";

export default function BeerForm() {

  const [data, setData] = useState<IBeer[]>([]);
  const [name, setName] = useState("");
  const [brewer, setBrewer] = useState("");
  const [type, setType] = useState("");
  const [img, setImg] = useState("");
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(false);

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
          console.log( result.beers );
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


  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    const res = await fetch("api/beer", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name, brewer, type, img
      }),
    });

    const { msg, success } = await res.json();
    console.log( msg );
    setError(msg);
    setSuccess(success);

    if (success) {
      setName('');
      setBrewer('');
      setType('');
      setImg('');
    }
  };

  return (
    <>
    <Button variant="contained">Hello world</Button>
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      { data ? (
        <List>
          {data.map( beer => <BeerListItem key={`${beer.year}${beer.day}${beer.beer}`} {...beer}/>)}
          </List>
      ) : (<p>Loading...</p> )}
    </Box>

      <form onSubmit={handleSubmit} className="py-4 mt-4 border-t flex flex-col gap-5" >
        <div>
          <label htmlFor="name">Beer Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            id="name"
            placeholder=".394 San Diego Pale Ale"
          />
        </div>

        <div>
          <label htmlFor="brewer">Brewer</label>
          <input
            onChange={(e) => setBrewer(e.target.value)}
            value={brewer}
            type="text"
            id="brewer"
            placeholder="AleSmith Brewing Company"
          />
        </div>

        <div>
          <label htmlFor="type">Type of Beer</label>
          <input
            onChange={(e) => setType(e.target.value)}
            value={type}
            type="text"
            id="type"
            placeholder="American Pale Ale"
          />
        </div>

        <button className="bg-green-700 p-3 text-white font-bold" type="submit">Send</button>

      </form>

      <div className="bg-slate-100 flex flex-col">
        {error && error.map((e) => (
            <div key={e} className={ `${ success ? "text-green-800" : "text-red-600" } px-5 py-2`} >{e} </div>
        ))}
      </div>
    </>
  );
}