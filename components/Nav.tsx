import Link from 'next/link';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Nav() {
    return (
        <nav>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar component="nav" position="static" >
                    <Toolbar>
                    {/*<IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link href="/">Home </Link>
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link href="/history">History </Link>
                    </Typography>
                    {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link className='disabled-link' href="/addbeer">Add Beer </Link>
                    </Typography> */}
                    </Toolbar>
                </AppBar>
            </Box>
        </nav>
    );
}