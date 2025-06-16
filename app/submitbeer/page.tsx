import BeerForm from '@/components/Beer/BeerForm';
import { Box, Typography } from '@mui/material';
import { Roboto } from 'next/font/google';

const roboto = Roboto({ weight: "700", subsets: ['latin']});
const year = new Date().getFullYear(); 

export default function SubmitBeer() {
  return (
    <>
      <Box display="flex" justifyContent="start" sx={{p:2, bgcolor:'white', height: ''}} alignItems="center" height="100%" width="100%" flexDirection={'column'}>
        <Typography fontFamily={roboto.className} variant='h5'>Submit your {year} advent beer here!</Typography>
        <BeerForm year={year} />
    </Box>
    </>    
  );
}
