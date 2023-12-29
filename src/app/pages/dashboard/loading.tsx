'use client'
import { Inter } from 'next/font/google'
import { ThreeCircles } from  'react-loader-spinner'


export default function Loading({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='w-full flex justify-center items-center h-screen flex-col gap-5 bg-bgColor'>
      <ThreeCircles
        height="70"
        width="70"
        color="#fff"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="three-circles-rotating"
      />
    </main>

  )
}
