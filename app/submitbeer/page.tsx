import BeerForm from '@/app/components/Beer/BeerForm';
import { Box, Typography } from '@mui/material';
import { Roboto } from 'next/font/google';

const roboto = Roboto({ weight: "700", subsets: ['latin']});

export default function SubmitBeer() {
  return (
    <>
      <Box display="flex" justifyContent="center" sx={{p:2, bgcolor:'white'}} alignItems="center" height="100%" width="100%" flexDirection={'column'}>
        <Typography fontFamily={roboto.className} variant='h5'>Submit your beer here!</Typography>
        <BeerForm />
    </Box>
    </>    
  );
}
