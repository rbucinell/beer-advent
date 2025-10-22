import Link from 'next/link';
import { headers } from "next/headers";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, Container, Typography } from '@mui/material';
import NavBarUserOrLogin from './NavBarUserOrLogin';
import { auth } from "@/lib/auth";

export default async function Nav() {

  const session = await auth.api.getSession({
        headers: await headers()
      });

  return (
    <nav>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <AppBar component="nav" position="static" >
          <Container>
            <Toolbar>
              
              <h6 className="h-6 flex flex-grow uppercase font-bold"><Link href="/">Home</Link></h6>
              <h6 className="h-6 flex flex-grow uppercase font-bold"><Link href="/history">History</Link></h6>
              
              { session && <h6 className="h-6 flex flex-grow uppercase font-bold disabled-link"><Link href="/submitbeer">Submit</Link></h6>}

              <NavBarUserOrLogin />
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </nav>
  );
}
