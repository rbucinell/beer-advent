"use client";

import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, Container, Typography } from '@mui/material';
import NavBarUserOrLogin from './NavBarUserOrLogin';
import { Session } from '@/lib/auth-client';

interface NavProps {
  session: Session | null;
}

export default function Nav({ session }: NavProps) {
  return (
    <nav>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <AppBar component="nav" position="static" >
          <Container>
            <Toolbar>
              
              <h6 className="h-6 flex flex-grow uppercase font-bold"><Link href="/">Home</Link></h6>
              <h6 className="h-6 flex flex-grow uppercase font-bold"><Link href="/history">History</Link></h6>
              
              { session && <h6 className="h-6 flex flex-grow uppercase font-bold disabled-link"><Link href="/submitbeer">Submit</Link></h6>}

              <NavBarUserOrLogin session={session} />
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </nav>
  );
}
