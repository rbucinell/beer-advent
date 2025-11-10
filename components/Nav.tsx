"use client";

import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, Container, Typography } from '@mui/material';
import NavBarUserOrLogin from './NavBarUserOrLogin';
import { Session } from '@/lib/auth-client';
import { Home, EventRepeat, SportsBar  } from "@mui/icons-material";
import ToolBarLinkDynamic from './ToolbarLinkDynamic';

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
              
              <ToolBarLinkDynamic text="Home" link="/" icon={Home} />
              <ToolBarLinkDynamic text="Events" link="/event" icon={EventRepeat} />
              <ToolBarLinkDynamic text="Beers" link="/history" icon={SportsBar} />
              
              { session && <h6 className="h-6 flex flex-grow uppercase font-bold disabled-link"><Link href="/submitbeer">Submit</Link></h6>}

              <NavBarUserOrLogin session={session} />
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </nav>
  );
}
