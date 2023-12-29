"use client"
import Image from 'next/image'
import ScholashipBtn from '../../../../component/ScholashipBtn'
import Link from 'next/link'
import { FaAlignJustify, FaHouse, FaPlus, FaMinus } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import assets from '../../../../util/images';
import {
	WalletConnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export default function Home({ params }: { params: { url:string}}) {
    console.log("params ->", params);
    const [isOpen, setOpen] = useState(false);

    return (
        <div className='w-full mint__gradient_background font-ShPinscher'>
        {/* --------------------------------- Header --------------------------------- */}
            <div className='w-full flex flex-col justify-center items-center relative'>
                <div className='w-5/6 flex justify-between mt-8 h-[40px]'>
                    <div className='flex gap-1'>
                        <ScholashipBtn content = "BACK TO THE JUNGLE" url = "../dashboard" />
                        <WalletMultiButton style={{color: '#FFAB24', height: "32px", border: "1px solid #FFAB24", borderRadius: "10px", backgroundColor: "transparent", fontSize: '15px', fontFamily: "SHPinscher, sans-serif'"}} />
                    </div>
                    
                    <div className='hidden md:flex justify-between gap-6 text-white text-content'>
                        <Link href = "dashboard/kongzdao" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Kongz Dao</Link>
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

            <div className='w-full flex flex-col justify-center items-center gap-20 pb-14 mt-12'>
                <div className='w-full md:w-1/3 border-[6px] ro unded-2xl border-borderYellow bg-bgColor flex flex-col gap-4 items-center p-4'>
                    <div className='text-title text-white text-center gap-6 w-full'><span>SOLKONGZ</span> - HL TOKEN <span className = "text-borderYellow">#1/5000</span><span className='text-title' > 1 SOL</span></div>
                    <div className = "relative">
                        <img src = {assets[parseInt(params.url)].url} alt="no image" className = "w-[550px]" />
                        <button className = "text-[38px] text-borderYellow border-[0.5rem] border-b-[#111] border-r-[#111] absolute bottom-[-20px] bg-bgColor left-[calc(50%-6.7rem)] rounded-full px-4" >Comming Soon!</button>
                    </div>
                    <p className = "text-borderYellow text-content" ><span className = "text-[#ff0000]">Requirement</span>: 2000 $PELL - 1x SOLKONGZ</p>
                    <p className = "text-white text-title text-center" >This WL Token grants the holder access to the newly discovered Jungle Orphanage, and the chance to adopt their very own BabyKong</p>
                </div>
            </div>
            {/* --------------------------------- Body End-------------------------------- */}   
        </div>
    )
}
