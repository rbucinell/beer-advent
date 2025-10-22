import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css'
import Nav from '@/components/Nav';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beer Advent',
  description: 'Cheers for beers',
  icons: 'favicon.ico',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html className="h-full" lang="en">      
        <body className={`${inter.className} flex flex-col h-full items-stretch bg-green-200 repeating-beer-bg`}>
          <Nav />
          <div className='p-2 h-full w-full flex max-w-3xl mx-auto justify-center overflow-hidden'>
            {children}
          </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
