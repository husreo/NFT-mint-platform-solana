"use client"
import Image from 'next/image'
import ScholashipBtn from '../../../component/ScholashipBtn'
import Link from 'next/link'
import { FaAlignJustify, FaHouse, FaPlus, FaMinus } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import assets from '../../../util/images';
import {
	WalletConnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"

export const Model = () => {
    // location of the 3D model
    const gltf = useGLTF("/img/3Dhoodiev3.glb");
    console.log("glft -> ", gltf);
    
    return (
      <>
        {/* Use scale to control the size of the 3D model */}
        <primitive object={gltf.scene} />
      </>
    );
};

export default function Home() {
    const [isOpen, setOpen] = useState(false);

    return (
        <div className='w-full bg-bgColor font-ShPinscher'>
        {/* --------------------------------- Header --------------------------------- */}
            <div className='w-full flex flex-col justify-center items-center relative'>
                <div className='w-5/6 flex justify-between mt-8 h-[40px]'>
                    <div className='flex gap-1'>
                        <ScholashipBtn content = "BACK TO THE JUNGLE" url = "../dashboard" />
                        <WalletMultiButton style={{color: '#FFAB24', height: "32px", border: "1px solid #FFAB24", borderRadius: "10px", backgroundColor: "transparent", fontSize: '15px', fontFamily: "SHPinscher, sans-serif'"}} />
                    </div>
                    
                    <div className='hidden md:flex justify-between gap-6 text-white text-content'>
                        <Link href = "/pages/dashboard/kongzdao" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Kongz Dao</Link>
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
                            <Link href="/pages/dashboard/kongzdao"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Kongz Dao</Link>
                            <Link href="https://t.co/I52MPobQbV" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Twitter</Link>
                            <Link href="https://discord.gg/hrQX37Cs" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Discord</Link>
                        </div>
                    )}
                </div>
            </div>
            {/* --------------------------------- Header End ----------------------------- */}
            {/* --------------------------------- Body ----------------------------------- */}

            <div className='w-full flex flex-col justify-center items-center gap-20 pb-14 mt-12'>
                <p className='text-title text-borderYellow'> SOLKONGZ OG HOODIE</p>
                <p className='text-title text-white'> 1 $SOL EACH</p>
                <Canvas shadows camera={{ position: [0, 0, -70], fov: 3 }} >
                    <Suspense fallback={null}>
                        <Model />
                        {/* To add environment effect to the model */}
                        <Environment preset="city" />
                    </Suspense>
                </Canvas>
            </div>
            {/* --------------------------------- Body End-------------------------------- */}   
        </div>
    )
}
