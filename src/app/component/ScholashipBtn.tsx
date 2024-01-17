import React from "react";
import Link from 'next/link'

type BtnProps = {
    url: string,
    content: string
}
const ScholashipBtn = (props: BtnProps) => {
    return (
        <Link href={props.url} className="h-8 duration-300 text-borderYellow border-[1px] border-borderYellow rounded-[10px] px-3 py-1 hover:bg-[#907848] hover:text-[#132a3b]">{props.content}</Link>
    )
}

export default ScholashipBtn;