"use client"
import Image from 'next/image'
import ScholashipBtn from '../../component/ScholashipBtn'
import Link from 'next/link'
// import { useRouter } from 'next/router';
import assets from '../../util/images';
import { FaAlignJustify, FaHouse, FaPlus, FaMinus, FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import {Accordion, AccordionItem} from "@nextui-org/react";
import { Carousel } from '@trendyol-js/react-carousel';


export default function Home() {
  const [isOpen, setOpen] = useState(false);
  // const router = useRouter();
  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex justify-between items-center",
    indicator: "text-borderYellow",
    content: "text-small px-2",
  };

  return (
    <div className='w-full bg-bgColor font-ShPinscher'>
      {/* --------------------------------- Header --------------------------------- */}
      <div className='w-full flex flex-col justify-center items-center relative'>
        <div className='w-5/6 flex justify-between mt-8 h-[40px]'>
          <ScholashipBtn content = "APPLY FOR A SCHOLARSHIP" url = "/pages/dashboard/contact" />
          <div className='hidden md:flex justify-between gap-6 text-white text-content'>
            <Link href = "dashboard/kongzdao" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Kongz Dao</Link>
            <Link href = "dashboard/shop" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Shop</Link>
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
            <div className='absolute w-full bg-bgColor top-[4.6rem] left-0 p-4 text-white flex md:hidden flex-col gap-4'>
              <Link href="#"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Kongz Dao</Link>
              <Link href="#"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Shop</Link>
              <Link href="https://t.co/I52MPobQbV" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Twitter</Link>
              <Link href="https://discord.gg/hrQX37Cs" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Discord</Link>
            </div>
          )}
        </div>
      </div>
      {/* --------------------------------- Header End ----------------------------- */}
      <img src='https://cdn.discordapp.com/attachments/1187092566752116806/1188207607949828126/KongzDAObySolKongzV2.png?ex=6599af91&is=65873a91&hm=7b1949b9bd160b7efb628e0e841855f589e04a8b6318ceb32ce93318174c2c91&' className='w-full' />
      {/* --------------------------------- Body ----------------------------------- */}      

      <div className='w-full flex flex-col justify-between items-center gap-20'>
        <p className='text-white text-content text-center'>{`The SOLKONGZ are a collection of 2,222 NFTs that grant the holder exclusive access to 'The Jungle' and the strong community of degenerates that call it home.`}</p>
        <p className='text-borderYellow text-title text-center'>CHECK OUT THE <Link href='https://www.solkongz.net/kongzdao' className='text-white underline'>KONGZ DAO</Link>  PAGE FOR THE LATEST UPDATES ON THE PROJECT!</p>
        <div className='w-4/5 md:w-2/3 border-1 border-[1px] border-white rounded-[10px] border-dotted p-[25px] md:p-[50px] flex flex-col gap-6 text-white text-content'>
          <p>Dear Kongz</p>
          <p>I hope this letter finds you in good health and high spirits, even during these confusing market conditions. But fuck the bears, we are The Kongz and we have some exciting news.</p>
          <p>[No Roadmap, Pure Fun] <br/>
            {`In keeping with our community's adventurous spirit, we have decided to take a bold step by not providing a traditional roadmap. Instead, we are placing our trust in the collective wisdom and creativity of the SolKongz community. We believe that by relinquishing some control, we can foster a more dynamic and exciting environment where the possibilities are endless.`}
          </p>
          <p>[New Art] <br/>
            {`The new art will go by the name of KongzDAO, and it is a testament to our original art and community. We have curated a whole new collection of NFTs, that not only reflect the spirit of 'crypto culture' but also remains in line with our OG branding and values. With a brand new look and an important role to play in the SolKongz ecosystem, each unique Kong is a masterpiece in its own right.`}
          </p>
          <p>Our main vision with KongzDAO goes beyond just creating NFTs — we plan to introduce a transformative element to the SolKongz ecosystem, a catalyst in a self-sustaining universe where each exchange subtly contributes to the vitality and growth of our community. Interwoven with a unique mechanism, this  plays a pivotal role in nurturing the network and offering rewards to those embarking on this journey with us.</p>
          <p>{`Our approach isn't solely about creating value; it's also about fostering a prosperity within ‘The Jungle’.As we embark on this journey together, we want to reaffirm our community values of crypto culture, brotherhood, and having a blast while pursuing financial gains. These principles have been the bedrock of SolKongz, and they will continue to guide us into this new era of the Kongz.</p>
          <p>Our next plan of action will be dropped shortly.And we kinda forgot we to mention... we airdropped 268 WL tokens to all the OGs that participated in the snapshot. Check your wallets and thank you for your loyalty.</p>
          <p>Kongz Team`}</p>
        </div>
        <div className='w-4/5 border-1 border-[6px] border-borderYellow rounded-[10px] p-[20px] md:p-[30px] flex flex-col items-center gap-4 text-white'>
          <div className='text-[38px] shadow' >RARITY</div>
          <p>Each NFT is algorithmically generated by combining 96+ unique traits with varying rarity across categories.</p>
          <div className='flex flex-col md:flex-row  justify-between gap-2 w-full '>
            <div className='flex flex-col gap-2 w-full md:w-1/2'>
              <p className='text-title'>Type</p>
              <table>
                <tbody className='leading-8'>
                    <tr className="odd:bg-darkYellow">
                      <td>2,222</td>
                      <td>Total SolKongz</td>
                    </tr>
                    <tr className="odd:bg-darkYellow">
                      <td>18</td>
                      <td>1/1 Legandary Kongz</td>
                    </tr>
                </tbody>
              </table>
            </div>
            <div className='flex flex-col gap-2 w-full md:w-1/2 odd:bg-darkYello'>
              <p className='text-title'>Variation</p>
              <table>
                <tbody className='leading-8'>
                    <tr className="odd:bg-darkYellow">
                      <td>2,222</td>
                      <td>Total SolKongz</td>
                    </tr>
                    <tr className="odd:bg-darkYellow">
                      <td>18</td> 
                      <td>1/1 Legandary Kongz</td>
                    </tr>
                    <tr className="odd:bg-darkYellow">
                      <td>18</td>
                      <td>1/1 Legandary Kongz</td>
                    </tr>
                    <tr className="odd:bg-darkYellow">
                      <td>18</td>
                      <td>1/1 Legandary Kongz</td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <p className='text-[38px] text-borderYellow shadow'>1/1 Legendary Kongz</p>
        
        <Carousel show={2} slide={1} transition={0.5} swiping={true} useArrowKeys={true} leftArrow={<div className=' items-center justify-center cursor-pointer h-full w-[200px] lg:flex md:flex hidden rotate-180'>
          <FaAngleRight className='text-white text-title' />
        </div>} rightArrow={<div className=' items-center justify-center cursor-pointer h-full w-[200px] lg:flex md:flex hidden rotate-180'>
          <FaAngleLeft className='text-white text-title' />
        </div>} className='h-[600px]'>
          {
            assets.map((val, index) => {
              return <div key = {val.url + index} className='relative'>
                <img src={val.url} alt="" className='w-[300px] sm:w-[500px] rounded-[15px] border-8 border-borderYellow' />
                <Link href={`/pages/dashboard/mint/${index}`}><button className='absolute bottom-[-25px] left-[3.5rem] sm:left-[calc(50%-8.3rem)] text-white rounded-[10px] border-[6px] border-borderYellow px-4 bg-bgColor text-[38px]'>{val.title}</button></Link>
              </div>
              
            })
          }
        </Carousel>
        <div className='w-full relative overflow-hidden'>
          <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/6358359a8c87f04f39054152_unknown-p-2000.png' width={100} height={70} className='w-full' alt='noimage'></img>
          <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/6358359a8c87f0848e054151_unkno5668wn-p-500.png' className='bottom-9 right-0 md:right-[-5rem] absolute border-[6px] border-white rounded-xl w-1/2 md:w-1/3 lg:w-1/4 box_shadow' />
        </div>
        <p className='text-[38px] text-borderYellow shadow'>MEET THE NEW TEAM</p>
        <div className='flex flex-col md:flex-row justify-between w-full p-2 gap-5'>
          <div className='flex flex-col gap-4 w-full md:w-1/3'>
            <div className='relative dashoboard__teamimg'>
              <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/6358359a8c87f04be8054138_KERFASKEN.png'className=' border-[3px] border-borderYellow' />
              <p className='text-white text-content absolute border-[1px] border-borderYellow bottom-[-1rem] bg-bgColor p-2 left-[calc(50%-2.8rem)]'>KEFARSKEN</p>
            </div>
            <p className='text-content text-white p-1 md:p-8 '>{`Hi I'm kefarsken and I am an OG member of the SolKongz community. I'm here to guide the KONGZ on the journey through the Solana Jungle.`}</p>
            <Link href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fwww.solkongz.net%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5Ekefarsken&region=follow_link&screen_name=kefarsken" className="h-8 duration-300 text-borderYellow border-[1px] border-borderYellow rounded-[10px] px-3 py-1 hover:bg-[#907848] hover:text-[#132a3b] text-center">FOLLOW KEFARSKEN</Link>
          </div>
          <div className='flex flex-col gap-4 w-full md:w-1/3'>
            <div className='relative dashoboard__teamimg'>
              <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/6358359a8c87f01749054127_kFBsN2DoXnpuTJUEZB-t7nY0aHAqvDFIihlEQp0SREA.png'className=' border-[3px] border-borderYellow' />
              <p className='text-white text-content absolute border-[1px] border-borderYellow bottom-[-1rem] bg-bgColor p-2 left-[calc(50%-2.8rem)]'>NATE</p>
            </div>
            <p className='text-content text-white p-1 md:p-8 '>{`Yo its Nate the degenerate jpeg collector from Manchester, England. I like to create things but most importantly,
            I love the KONGZ. LET'S F*CKING GOOOO!`}</p>
            <Link href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fwww.solkongz.net%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5Ec0gnate&region=follow_link&screen_name=c0gnate" className="h-8 duration-300 text-borderYellow border-[1px] border-borderYellow rounded-[10px] px-3 py-1 hover:bg-[#907848] hover:text-[#132a3b] text-center">FOLLOW Nate</Link>
            
          </div>
          <div className='flex flex-col gap-4 w-full md:w-1/3'>
            <div className='relative dashoboard__teamimg'>
              <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/65538a4a6913d3aab0b9afe3_teaserv1.png'className=' border-[3px] border-borderYellow' />
              <p className='text-white text-content absolute border-[1px] border-borderYellow bottom-[-1rem] bg-bgColor p-2 left-[calc(50%-2.8rem)]'>???</p>
            </div>
            <p className='text-content text-white p-1 md:p-8 '>We are currently looking for a fulltime RUST developer to work on the project and help us build our dreams. Could this be you? If so please contact the team ASAP.</p>
            <Link href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fwww.solkongz.net%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5Esolkongz&region=follow_link&screen_name=solkongz" className="h-8 duration-300 text-borderYellow border-[1px] border-borderYellow rounded-[10px] px-3 py-1 hover:bg-[#907848] hover:text-[#132a3b] text-center">FOLLOW SolKongz</Link>
            
          </div>
        </div>
        <div className='w-full sm:w-2/3'>
          <p className='text-[38px] text-borderYellow shadow pl-2'>FAQ</p>

          <Accordion
            showDivider={false}
            className="p-2 flex flex-col gap-1 w-full"
            variant="shadow"
            itemClasses={itemClasses}
          >
            <AccordionItem
              key="1"
              aria-label="how can i join solkongz"
              title={<p className='text-borderYellow text-content sm:text-title w-full'>HOW CAN I JOIN SOLKONGZ</p>}
              indicator={({ isOpen }) => (isOpen ? <FaMinus /> : <FaPlus />)}
            >
              <p className='text-content text-white '>You can acquire a SOLKONG either through secondary marketplaces like <Link href="https://magiceden.io/marketplace/solkongz" className='text-borderYellow underline' >Magic Eden</Link> , <Link href = "https://solsea.io/c/620fd1cc5f38c6260eb65ca1" className='text-borderYellow underline'>OpenSea</Link>  and SolSea OR you can apply to our <Link href="https://www.solkongz.net/scholarship-program" className='text-borderYellow underline'>Scholarship program</Link> . You might even get lucky in one of our giveaways </p>
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="how can i join solkongz"
              title={<p className='text-borderYellow text-content sm:text-title w-full'>WHAT IS THE TREEHOUSE</p>}
              indicator={({ isOpen }) => (isOpen ? <FaMinus /> : <FaPlus />)}
            >
              <p className='text-content text-white '>The Treehouse is an exclusive corner of the Jungle where all of the SOLKONGZ gather to socialize and share their knowledge/creations. The KONGZ are a solid tribe of gorillas that take care of one another to provide a safe-haven to grow within the mysterious Solana Jungle. This will also serve as a platform we can expand and add utility to in the future.</p>
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="how can i join solkongz"
              title={<p className='text-borderYellow text-content sm:text-title w-full'>{`WHAT'S NEXT`}</p>}
              indicator={({ isOpen }) => (isOpen ? <FaMinus /> : <FaPlus />)}
            >
              <p className='text-content text-white '>Keep an eye on our <Link href="https://twitter.com/SolKongz" className='text-borderYellow underline'>Twitter</Link> . We will be releasing more updates very soon.</p>
            </AccordionItem>
          </Accordion>
        </div>
        <div className='flex flex-col justify-center items-center gap-1 py-6'>
          <ScholashipBtn content = "JOIN THE GANG" url = "https://magiceden.io/marketplace/solkongz"/>
          <Link href="http://creativecommons.org/publicdomain/zero/1.0/"><img src='https://licensebuttons.net/p/zero/1.0/88x31.png' /></Link>
          <p className='text-white/55'>To the extent possible under law, The SolKongz Team has waived all copyright and related or neighboring rights to SolKongz.</p>
        </div>
      </div>
      {/* --------------------------------- Body End-------------------------------- */}   
    </div>
  )
}
