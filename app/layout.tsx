import type { Metadata } from 'next'
import './globals.css'
import QueryClientWrapper from '@/components/QuertWrapper'
import Navbar from '@/components/components/NavBar'
import ScrollReveal from '@/components/components/ScrollReveal'
import FooterComp from '@/components/components/FooterComp'


export const metadata: Metadata = {
  title: 'Vemre',
  description: 'Vemre admin dashbroad',
  generator: 'vemre',
  
  icons: {
    icon: [
      { url: '/favicon.ico' },
      {url:"/android-chrome-192x192.png", sizes:"192x192", type:"image/png"},
      {url:"/android-chrome-512x512.png", sizes:"512x512", type:"image/png", }
    ],
    apple: [
      { url: '/apple-touch-icon.png',},
    ],
  },
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
      <QueryClientWrapper>
        <Navbar />
        {children}
        <ScrollReveal><FooterComp /></ScrollReveal> 
        </QueryClientWrapper>
        </body>
    </html>
  )
}
