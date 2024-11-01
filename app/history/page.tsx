"use client";

import { useState, useEffect } from "react";
import { Box,Button,List, Modal, Typography } from '@mui/material';
import { IBeer } from "@/app/models/beer";
import BeerListItem from "@/app/components/Beer/BeerListItem";
import TextField from '@mui/material/TextField';
import { Get } from "@/app/util/RequestHelper";
import BeerModal from "@/app/components/Beer/BeerModal";

export default function History() {

  const [beers, setBeers] = useState<IBeer[]>([]);
  const [q, setQ] = useState("");
  const [searchParamters] = useState(["beer", "brewer"]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    (async () => { 
      let beers:IBeer[] = await Get<IBeer[]>('api/beer');
      beers = beers.filter<IBeer>( (b): b is IBeer => b.state !== "pending" );
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

  function clickListItem( e:any )
  {
    console.log( e );
    setOpen(true);
    console.log( 'page state:', open);
  }

  return (
    <>
      <Button onClick={ (e:any) =>{clickListItem(e)}}>Open modal</Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="Beer Details Modal" aria-describedby="A popup modal with expanded details of the given beer">
          <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">Text in a modal</Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          </Box>
      </Modal>
      <Box sx={{ width: '100%', height:'90vh', overflow:'clip', bgcolor: 'background.paper' }}>
        <TextField value={q} sx={{mb: 1}} className="bg-slate-200 l border-b-2 border-solid border-black" fullWidth id="outlined-basic" label="Search" variant="outlined"
          onChange={(e:any) => setQ(e.target.value)} 
        />
        { beers ? (
          <List sx={{ mb: 2}} style={{maxHeight: '100%', overflow: 'auto'}}>
            {search(beers).map( beer => 
                <BeerListItem key={`${beer.year}${beer.day}${beer.beer}`} {...beer} onclick={(e)=> {
                  console.log( e );
                }}/>
            )}
          </List>
        ) : (<p>Loading...</p> )}
    </Box>
    </>
  );
}
