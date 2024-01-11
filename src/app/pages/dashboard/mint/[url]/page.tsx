"use client"
import Image from 'next/image'
import ScholashipBtn from '../../../../component/ScholashipBtn'
import Link from 'next/link'
import { FaAlignJustify } from "react-icons/fa6";
import { useState } from 'react';
import {
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { toast } from "react-toastify";
import { PublicKey, SystemProgram, Transaction, Connection } from "@solana/web3.js"
import axios from "axios";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { FC, useCallback } from "react";

export default function Home({ params }: { params: { url:string}}) {
    const [isOpen, setOpen] = useState(false);
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useWallet()

    return (
        <div className='w-full mint__gradient_background font-ShPinscher'>
        {/* --------------------------------- Header --------------------------------- */}
            <div className='w-full flex flex-col justify-center items-center relative'>
                <div className='w-5/6 flex justify-between mt-8 h-[40px]'>
                    <div className='flex gap-1'>
                        <ScholashipBtn content = "BACK TO THE JUNGLE" url = "/pages/dashboard" />
                        
                    </div>
                    
                    <div className='hidden md:flex justify-between gap-6 text-white text-content'>
                        <Link href = "/pages/dashboard/kongzdao" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Kongz Dao</Link>
                        <Link href = "/pages/dashboard/shop" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Shop</Link>
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
                        <div className='absolute w-full bg-[rgb(255,107,255)] top-[5rem] left-0 p-4 text-white flex md:hidden flex-col gap-4 z-20'>
                            <div className='w-full flex justify-center'>
                                <WalletMultiButton style={{color: '#FFAB24', height: "32px", border: "1px solid #FFAB24", borderRadius: "10px", backgroundColor: "transparent", fontSize: '15px', fontFamily: "SHPinscher, sans-serif'"}} />
                            </div>

                            <Link href="/pages/dashboard/kongzdao"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Kongz Dao</Link>
                            <Link href="/pages/dashboard/shop"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Shop</Link>
                            <Link href="https://t.co/I52MPobQbV" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Twitter</Link>
                            <Link href="https://discord.gg/hrQX37Cs" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Discord</Link>
                        </div>
                    )}
                </div>
            </div>
            {/* --------------------------------- Header End ----------------------------- */}
            {/* --------------------------------- Body ----------------------------------- */}

            <div className='w-full flex flex-col justify-center items-center gap-20 pb-14 mt-12'>
                
            </div>
            {/* --------------------------------- Body End-------------------------------- */}   
        </div>
    )
}
