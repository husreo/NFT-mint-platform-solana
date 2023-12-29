"use client"
import Image from 'next/image'
import ScholashipBtn from '../../component/ScholashipBtn'
import Link from 'next/link'
import { FaAlignJustify, FaHouse, FaPlus, FaMinus } from "react-icons/fa6";
import { useEffect, useState } from 'react';
// import Carousel from 'react-multi-carousel';
export default function Home() {

  const [isOpen, setOpen] = useState(false);

  return (
    <div className='w-full bg-[#000] font-ShPinscher'>
        {/* --------------------------------- Header --------------------------------- */}
        <div className='w-full flex flex-col justify-center items-center relative'>
            <div className='w-5/6 flex justify-between mt-8 h-[40px]'>
            <ScholashipBtn content = "BACK TO THE JUNGLE" url = "./dashboard" />
            <div className='hidden md:flex justify-between gap-6 text-white text-content'>
                <Link href = "#" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Shop</Link>
                <Link href = "https://t.co/I52MPobQbV" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Twitter</Link>
                <Link href = "https://discord.gg/hrQX37Cs" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Discord</Link>
            </div>
            <div
                onClick={() => setOpen(!isOpen)}
                className='flex md:hidden justify-center items-center bg-white p-3 rounded-[10px] border-[1px] border-[#000] w-[32] sm:w-[50px] text-black hover:bg-btnYellow cursor-pointer'
            >
                <FaAlignJustify className="w-[16px] h-[16px]" />
            </div>
            {isOpen && (
                <div className='absolute w-full bg-bgColor top-[5rem] left-0 p-4 text-white flex md:hidden flex-col gap-4'>
                <Link href="#"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Kongz Dao</Link>
                <Link href="#"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Shop</Link>
                <Link href="https://t.co/I52MPobQbV" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Twitter</Link>
                <Link href="https://discord.gg/hrQX37Cs" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Discord</Link>
                </div>
            )}
            </div>
        </div>
        {/* --------------------------------- Header End ----------------------------- */}
        {/* --------------------------------- Body ----------------------------------- */}

        <div className='w-full flex flex-col justify-between items-center gap-20 pb-14'>
            <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/65538cbacb0d5c7a11b62978_Screenshot%202023-11-14%20150417.png' alt='no imgage' />
            <div className='flex w-full gap-8'>
                <div className='flex flex-col w-1/2'>
                    <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/652d2cd90269ade5118a64b2_Screenshot%202023-09-27%20195616.png' />
                    <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/652d2cd99002ba1fdcde0d08_Screenshot%202023-09-27%20195721.png' />
                </div>
                <div className='flex flex-col w-1/2'>
                    <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/652d2cd94a892af6d07342f3_Screenshot%202023-09-27%20195651.png' />
                    <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/652d2cdac2f3782031aa3059_Screenshot%202023-09-27%20195743.png' />
                </div>
            </div>
        </div>
      {/* --------------------------------- Body End-------------------------------- */}   
    </div>
  )
}
