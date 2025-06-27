import Link from 'next/link';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, Container, Typography } from '@mui/material';
import NavBarUserOrLogin from './NavBarUserOrLogin';

export default async function Nav() {

  return (
    <nav>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <AppBar component="nav" position="static" >
          <Container>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link href="/">Home </Link>
              </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link href="/history">History </Link>
              </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link className='disabled-link' href="/submitbeer">Submit Beer</Link>
              </Typography>
              <NavBarUserOrLogin />
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </nav>
  );
}
