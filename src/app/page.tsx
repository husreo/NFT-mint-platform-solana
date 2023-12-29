"use client"
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThreeCircles } from 'react-loader-spinner'

export default function Home() {

  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {router.push('/pages/dashboard')}, 3000);
  }, []);

  return (
    <div className='w-full flex justify-center items-center h-screen flex-col bg-bgColor'>
      <ThreeCircles
        height="70"
        width="70"
        color="#fff"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="three-circles-rotating"
      />
    </div>
  )
}
