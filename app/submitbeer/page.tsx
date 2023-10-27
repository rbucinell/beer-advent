import BeerForm from '@/components/Beer/BeerForm';
import { Box, Grid, Typography } from '@mui/material';

export default function SubmitBeer() {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="80vw"
        flexDirection={'column'}
      >
        <Typography variant="h4">Submit your beer here!</Typography>
        <BeerForm />
    </Box>
    </>    
  );
}
