import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container, CssBaseline } from '@mui/material';
import './globals.css'
import Nav from '@/components/Nav';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beer Advent',
  description: 'Cheers for beers',
  viewport: 'initial-scale=1, width=device-width'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-green-200 repeating-beer-bg`}>
        <CssBaseline /> 
        <Nav />      
        <Container sx={{ p:2, minHeight: '70vh'}}>          
          {children}
        </Container>
      </body>
    </html>
  )
}
