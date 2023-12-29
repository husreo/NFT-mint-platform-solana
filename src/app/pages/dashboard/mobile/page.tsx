'use client'

import react, { useState, useContext, useEffect } from 'react'
import { AppContext } from "../../../context/holder_context"
import { FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';
import SimpleBar from 'simplebar-react';

interface userType {
    imgSRC: string,
    name: string,
    walletAddress: string,
    currentPoint: number
}

const Competion = () => {
    const [user, setUsers] = useState<userType[]>()

    useEffect(() => {
        (async () => {
            const result = await fetch("/api/user/getallusers", { method: "GET" })
                .then((response) => response.json())
                .then((data) => {
                    setUsers(data.check)
                })
                .catch(err => { console.log(err); })
        })();
    }, [])

    return (
        <div className=' flex w-full justify-center flex-col'>
            {/* -------------------------------------------------- Header --------------------------------------------------------- */}
            <div className='w-full flex justify-center py-[24px]'>
                <div className='w-full flex justify-start '>
                    <Link href="/dashboard" className='flex py-1 pr-3 pl-1 items-center rounded-full border-[1px] border-black bg-white'>
                        <FaChevronLeft />
                        <p className='text-3 leading-[21px] bg-white'>Back</p>
                    </Link>
                </div>
            </div>
            {/* -------------------------------------------------- Header End --------------------------------------------------------- */}
            <div className='w-full flex flex-col items-center px-[16px] pt-[16px] pb-[8px] bg-cardBack border-[1px] border-[#000] rounded-[15px] '>
                <div className='flex justify-start mb-[8px] w-full'>
                    <img src="/image/icon/competitions.png" alt="" />
                    <p className='text-[24px] font-smibold leading-[32px] font-semibold uppercase '>Leaderboard</p>
                </div>
                <SimpleBar forceVisible="x" autoHide={true} className="w-full h-5/6">
                    {user?.map((val, i) => {
                        return <div className='flex py-[12px] justify-between border-b-[0.5px] border-[#8A8A8] w-full' key={i + val.name}>
                            <div className='flex items-center gap-[8px]'>
                                <p className='text-center text-[16px] font-semibold leading-[24px]'>{i + 1}</p>
                                <img src={val.imgSRC} alt="" className='h-[32px] w-[32px] rounded-[6px]' />
                                <div className='flex flex-col'>
                                    <p className='text-[16px] font-normal leading-[22px]'>{val.name}</p>
                                    <p className='text-[#686E77] text-[12px] leading-[16px]'>{val.walletAddress!.slice(0, 8) + "..." + val.walletAddress!.slice(val.walletAddress.length - 8, val.walletAddress.length)}</p>
                                </div>
                            </div>
                            <div className='flex gap-[4px] items-center'>
                                <img src="/image/icon/coin@3x.png" alt="" className='h-[13px] w-[13px]' />
                                <p className='text-[14px] font-semibold leading-[20px]'>
                                    {val.currentPoint} pts
                                </p>
                            </div>
                        </div>
                    })}
                </SimpleBar>
            </div>
        </div>
    )
}

export default Competion