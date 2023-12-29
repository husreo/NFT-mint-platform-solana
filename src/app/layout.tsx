import type { Metadata } from 'next';
import Head from 'next/head';
import './globals.css';

export const metadata: Metadata = {
  title: 'Solkongz',
  description: 'The vision of the project is to allow users to earn by minting.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body>
        <div className='w-full flex'>
          {children}
        </div>
      </body>
    </html>
  )
}
