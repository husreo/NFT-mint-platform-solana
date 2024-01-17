"use client"
import Image from 'next/image'
import ScholashipBtn from '../component/ScholashipBtn'
import Link from 'next/link'
import { FaAlignJustify, FaHouse, FaPlus, FaMinus } from "react-icons/fa6";
import { useEffect, useState } from 'react';
// import Carousel from 'react-multi-carousel';
export default function Home() {

  const [isOpen, setOpen] = useState(false);

  return (
    <div className='w-full bg-bgColor font-ShPinscher'>
      {/* --------------------------------- Header --------------------------------- */}
      <div className='w-full flex flex-col justify-center items-center relative'>
        <div className='w-5/6 flex justify-between mt-8 h-[40px]'>
          <ScholashipBtn content = "BACK TO THE JUNGLE" url = "/" />
          <div className='hidden md:flex justify-between gap-6 text-white text-content'>
            <Link href = "/kongzdao" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Kongz Dao</Link>
            <Link href = "/shop" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Shop</Link>
            <Link href = "https://twitter.com/solkongz" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Twitter</Link>
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
              <Link href="/kongzdao"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Kongz Dao</Link>
              <Link href="/shop"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Shop</Link>
              <Link href="https://twitter.com/solkongz" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Twitter</Link>
              <Link href="https://discord.gg/hrQX37Cs" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Discord</Link>
            </div>
          )}
        </div>
      </div>
      {/* --------------------------------- Header End ----------------------------- */}
      {/* --------------------------------- Body ----------------------------------- */}

      <div className='w-full flex flex-col justify-between items-center gap-20 pb-14'>
        <div className='w-4/5 pt-20'>
          <p className='text-borderYellow text-[38px] shadow text-center'>SolKongz Scholarship Program</p>
          <p className='text-white text-content'>{`The Scholarship Program is our way of onboarding skilled individuals into our community. Individuals that can benefit the KONGZ in one way or another gets the chance to receive their own SOLKONG free of charge and become a member of 'The Jungle'. If you believe that you have what it takes to become a community member, fill out the form and apply below.`}</p>
        </div>
        <div className='w-4/5 border-1 border-[6px] border-borderYellow rounded-[10px] px-[20px] md:p-[30px] flex flex-col sm:flex-row justify-around items-center gap-4'>
            <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/6358359a8c87f06f35054141_pyM-3fPYw6JI5FRONxrYXHaIJHUFrZQ0Xg2ciLVm2q4-p-800.png' alt='no image' className='w-1/2 mt-3 sm:mt-0 sm:w-1/5' />
            <div className='w-full sm:w-1/2 flex flex-col gap-1'>
              <p className='text-borderYellow text-title shadow'>Discord ID</p>
              <input name='discord_id' className='w-full p-2 h-[40px]' placeholder='cryptobro#69428' />
              <p className='text-borderYellow text-title shadow'>Wallet Address</p>
              <input name='wallet_address' className='w-full p-2 h-[40px]' placeholder='solana wallet address' />
              <p className='text-borderYellow text-title shadow'>What can you bring to the SOLKONGZ community?</p>
              <textarea name='content' className='w-full p-2 h-[200px]' placeholder='skill/benefit etc' />
              <div className='text-center text-borderYellow text-[15px] py-2'>*YOU MUST JOIN OUR <Link href="https://t.co/I52MPobQbV" className='text-white underline' >DISCORD</Link> ONCE COMPLETING THIS FORM FOR YOUR SUBBMISSION TO BE ELIGIBLE*</div>
              <button className='text-white w-[70px] px-3 py-2 bg-sky-500'>Apply</button>
            </div>
        </div>
        <Link href="https://magiceden.io/marketplace/solkongz" className="duration-300 text-borderYellow border-[2px] border-borderYellow rounded-[10px] px-4 py-1 hover:bg-[#907848] hover:text-[#132a3b] text-title">JOIN THE GANG</Link>
      </div>
      {/* --------------------------------- Body End-------------------------------- */}   
    </div>
  )
}
