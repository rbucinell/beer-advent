import BeerForm from '@/components/Beer/BeerForm';
import { Box, Typography } from '@mui/material';
import { Roboto } from 'next/font/google';

const roboto = Roboto({ weight: "700", subsets: ['latin']});
const year = new Date().getFullYear(); 

export default function SubmitBeer() {
  return (
    <div className={`flex flex-col justify-start w-full h-full p-2 font-${roboto.className}`}>
      <p className="self-center">Submit your {year} advent beer here!</p>
      <BeerForm year={year} />
    </div>
  );
}
