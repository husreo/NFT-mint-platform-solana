"use client"
import Image from 'next/image'
import ScholashipBtn from '../../../component/ScholashipBtn'
import assets from '../../../util/images';
import Countdown from '../../../component/CountDown';
import { MINT_STATES, OG_TOKEN, WL_TOKEN } from '../../../util/config';
import { errorAlert, infoAlert, successAlert } from '../../../component/ToastGroup';
import { getAtaForMint } from '../../../util/misc';
import { BsDash, BsPlusLg } from 'react-icons/bs';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import Link from 'next/link'
import { FaAlignJustify, FaHouse, FaPlus, FaMinus } from "react-icons/fa6";
import { useEffect, useState, useContext } from 'react';
import {
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
// import Carousel from 'react-multi-carousel';
import {
    AnchorWallet,
    ConnectionContext,
    useAnchorWallet, 
} from "@solana/wallet-adapter-react";
  
import {
    CandyMachine,
    DefaultCandyGuardSettings,
    Metaplex,
    PublicKey,
    SolAmount,
    walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { Keypair, Transaction } from '@solana/web3.js';
type wallet = AnchorWallet | undefined;

const candyMachineId =
  process.env.NEXT_PUBLIC_CANDYMACINE_ID ?? "71TofHCQhck3DzEq3mg363nGEAGjrxTdd7JYLyvq8ftD";

export default function Home() {

  const [isOpen, setOpen] = useState(false);
  const wallet: wallet = useAnchorWallet();

  const [candyMachine, setCandyMachine] = useState<
    CandyMachine<DefaultCandyGuardSettings> | undefined
  >(undefined);
  const [numberValue, setNumberValue] = useState<number>(1);
//   const [mintText, setMintText] = useState<string>('Pixelated Apes'); 
  const [mintLimited, setMintLimited] = useState<number>(0);

  const [mintState, setMintState] = useState<keyof typeof MINT_STATES>("NOT_STARTED");
  const [nextTime, setNextTime] = useState<Date>(new Date());

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsMinted, setItemsMinted] = useState(0);
  const [soldOut, setSoldOut] = useState(false);
  const percentage = 66;

  const incrementValue = (e: boolean) => {
    let newNumber = 0
    let totalBudget = 0
    if (e === false) newNumber = numberValue - 1
    else newNumber = numberValue + 1

    if (newNumber < 1) newNumber = 1
    if (newNumber > mintLimited) newNumber = mintLimited
    totalBudget = Math.round(newNumber * MINT_STATES[mintState].solPrice * 100) / 100
    setNumberValue(newNumber)
  }

  const accountChangeListner = () => {
    let id = connection.onAccountChange(new PublicKey(candyMachineId), () => {
      refreshCandyMachineState();
    });
    return id;
  };

  useEffect(() => {
    // setCandyMachine(undefined);
    const cndyEventListener = accountChangeListner();

    refreshCandyMachineState();

    return () => {
      connection.removeAccountChangeListener(cndyEventListener);
    };
  }, [wallet, candyMachineId, mintState]);

  useEffect(() => {
    refreshCandyMachineState();
  }, [])

  const { connection } = useContext(ConnectionContext);

  const refreshCandyMachineState = async () => {
    let cndy;
    if (!wallet) {
      const METAPLEX = Metaplex.make(connection); //.use(keypairIdentity(WALLET));
      cndy = await METAPLEX.candyMachines().findByAddress({
        address: new PublicKey(candyMachineId),
      });

      setCandyMachine(cndy);
    } else {
      const METAPLEX = Metaplex.make(connection).use(
        walletAdapterIdentity(wallet)
      );
      cndy = await METAPLEX.candyMachines().findByAddress({
        address: new PublicKey(candyMachineId),
      });

      setCandyMachine(cndy);
    }

    const now = Date.now() / 1000;

    console.log("wallet: ", wallet?.publicKey.toBase58());
    if (now < cndy?.candyGuard?.groups[0].guards.startDate?.date.toNumber()) {
      console.log("mint not started");
      setMintState("NOT_STARTED");
      setNextTime(
        new Date(
          cndy?.candyGuard?.groups[1].guards.startDate?.date.toNumber() * 1000
        )
      );
    } else if (now < cndy?.candyGuard?.groups[1].guards.startDate?.date.toNumber()) {
      console.log("og mint");
      setMintState("OG");
      setNextTime(
        new Date(
          cndy?.candyGuard?.groups[2].guards.startDate?.date.toNumber() * 1000
        )
      );
    } else if (now < cndy?.candyGuard?.groups[2].guards.startDate?.date.toNumber()) {
      console.log("wl mint");
      setMintState("WL");
      setNextTime(
        new Date(
          cndy?.candyGuard?.groups[2].guards.startDate?.date.toNumber() * 1000
        )
      );
    } else if (now > cndy?.candyGuard?.groups[2].guards.startDate?.date.toNumber()) {
      console.log("public mint");
      setMintState("PUBLIC");
      setNextTime(
        new Date(
          cndy?.candyGuard?.groups[2].guards.startDate?.date.toNumber() * 1000
        )
      );
    } else {
      console.log("mint ended");
      setMintState("ENDED");
      setNextTime(new Date());
    }

    setItemsAvailable(cndy.itemsLoaded);
    setItemsMinted(cndy.itemsMinted.toNumber());

    if (cndy.itemsLoaded == cndy.itemsMinted.toNumber())
      setSoldOut(true);
    setMintLimited(cndy.itemsLoaded - cndy.itemsMinted.toNumber());
    // if (mintState == "OG")
    //   setMintLimited(3);
    // else if (mintState == "WL")
    //   setMintLimited(2);
    // else
    //   setMintLimited(10);
  };

  const onMint = async () => {
    if (!wallet) {
      console.log("wallet is null");
      errorAlert("Connect your wallet");
      return;
    }

    if (!candyMachine || mintState == "NOT_STARTED" || mintState == "ENDED") {
      console.log("mint param error");
      console.log(candyMachine);
      return;
    }

    if (mintState == "OG" || mintState == "WL") {
      let tBalance = 0;
      try {
        tBalance =
          (
            await connection.getTokenAccountBalance(
              (
                await getAtaForMint(mintState == "OG" ? OG_TOKEN : WL_TOKEN, wallet.publicKey)
              )[0]
            )
          ).value.uiAmount ?? 0;
      } catch (e) {
        console.log(e);
      }

      console.log("token balance: ", tBalance);
      if (tBalance == 0) {
        errorAlert(mintState == "OG" ? "You don't have enough OG token" : "You don't have enough WL token");
        return;
      }
    }

    const METAPLEX = Metaplex.make(connection).use(
      walletAdapterIdentity(wallet)
    );

    infoAlert("Waiting for sign transaction ...");

    try {
      let transactions = [];

      const blockhash = await connection.getLatestBlockhash();
      for (let i = 0; i < numberValue; i++) {
        const mint = Keypair.generate();
        const tx = (await METAPLEX.candyMachines().builders().mint({
          candyMachine,
          collectionUpdateAuthority: candyMachine.authorityAddress,
          mint,
          group: mintState
        })).toTransaction(blockhash);

        tx.feePayer = wallet.publicKey;
        tx.partialSign(mint);

        transactions.push(tx);
      }

      const signedTxs = await wallet.signAllTransactions(transactions);

      let confirmed = 0;

      try {
        console.log(signedTxs[0]);
        const signatures = await Promise.all(signedTxs.map((o) => connection.sendRawTransaction(o.serialize())))

        infoAlert("Confirming transactions ...");

        const confirmations = await Promise.all(signatures.map((o) => connection.confirmTransaction({
          signature: o,
          blockhash: blockhash.blockhash,
          lastValidBlockHeight: blockhash.lastValidBlockHeight
        }, "confirmed")))

        confirmed = confirmations.reduce((val, cur) => cur.value.err === null ? val + 1 : val, 0)
      } catch (e) {
        console.log("error while send and confirm transaction");
        console.log(e);
      }

      // const mintTxId = (await mintOneToken(candyMachine, wallet.publicKey))[0]
      if (confirmed == 1) {
        successAlert("Congratulations! Mint a pixelated ape!");
      } else if (confirmed > 1) {
        successAlert("Congratulations! Mint pixelated apes!");
      } else {
        errorAlert("Mint failed! Please try again!");
      }
    } catch (e) {
      errorAlert("Mint failed!");
      console.log(e);
    }
  }

  return (
    <div className='w-full bg-[#000] font-ShPinscher'>
        {/* --------------------------------- Header --------------------------------- */}
        <div className='w-full flex flex-col justify-center items-center relative'>
            <div className='w-5/6 flex justify-between mt-8 h-[40px]'>
                <div className='flex gap-2'>
                    <ScholashipBtn content = "BACK TO THE JUNGLE" url = "/pages/dashboard" />
                    <div className='hidden md:flex'>
                        <WalletMultiButton style={{color: '#FFAB24', height: "32px", border: "1px solid #FFAB24", borderRadius: "10px", backgroundColor: "transparent", fontSize: '15px', fontFamily: "SHPinscher, sans-serif'"}} />
                    </div>
                </div>
                
                <div className='hidden md:flex justify-between gap-6 text-white text-content'>
                    <Link href = "/pages/dashboard/shop" className='hover:border-b-4 hover:border-darkYello pb-1 duration-200'>Shop</Link>
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
                    <div className='absolute w-full bg-[#000] top-[5rem] left-0 p-4 text-white flex md:hidden flex-col gap-4 z-20'>
                        <div className='w-full flex justify-center'>
                            <WalletMultiButton style={{color: '#FFAB24', height: "32px", border: "1px solid #FFAB24", borderRadius: "10px", backgroundColor: "transparent", fontSize: '15px', fontFamily: "SHPinscher, sans-serif'"}} />
                        </div>
                        <Link href="/pages/dashboard/shop"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Shop</Link>
                        <Link href="https://twitter.com/solkongz" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Twitter</Link>
                        <Link href="https://discord.gg/hrQX37Cs" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Discord</Link>
                    </div>
                )}
            </div>
        </div>
        {/* --------------------------------- Header End ----------------------------- */}
        {/* --------------------------------- Body ----------------------------------- */}

        <div className='w-full flex flex-col justify-between items-center gap-15 pb-14'>
            <div className='w-5/6 md:w-1/3 border-[6px] ro unded-2xl border-borderYellow bg-bgColor flex flex-col gap-4 items-center p-4 mt-8'>
                <div className='text-title text-white text-center gap-6 w-full'>KongzDAO <span className = "text-borderYellow">#{itemsMinted}/{itemsAvailable}</span></div>
                {soldOut == true &&
                    <div className='w-full text-center font-extrabold text-[80px] text-amber-800 md2:text-[60px]' >
                        Sold Out
                    </div>
                }
                {soldOut == false && 
                    <div>
                        <div className = "relative">
                            <img src = "/img/SolKongzWLToken50.gif" alt="no image" className = "w-[550px] z-10" />
                            <div className='w-full absolute bottom-[-30px] flex items-center justify-center' onClick={() => onMint()}>
                                {mintState != "NOT_STARTED" && mintState != "ENDED" && (
                                  <div className='w-[100px] cursor-pointer rounded-full'>
                                    <CircularProgressbar value={itemsMinted/itemsAvailable*100} text="Mint" strokeWidth = {11} styles={
                                      buildStyles({
                                        textSize: '35px',
                                        backgroundColor: "#0E263C",
                                        textColor: '#FFAB24',
                                        pathColor: "#111"
                                      })
                                    }  background/>
                                  </div>
                                )}
                              
                            </div>
                        </div>
                        <Countdown nextTime={mintState == "ENDED" ? null : nextTime} mintState={mintState} refresh={refreshCandyMachineState} />
                        {mintState != "NOT_STARTED" && mintState != "ENDED" && (
                            <div className='flex flex-col items-center justify-center w-full h-full gap-6'>
                                <div className='flex flex-row items-center justify-between w-full h-full px-3 text-white md2:px-10' >
                                    <div
                                        onClick={() => incrementValue(false)}
                                        className={`${numberValue < 2
                                        ? 'cursor-not-allowed'
                                        : 'cursor-pointer'
                                        } w-[60px] h-[60px] flex flex-row rounded-full bg-[#10141f] items-center justify-center hover:bg-[#36272b]`
                                        }
                                    >
                                        <BsDash style={{ color: '#ffffff', fontSize: '20px' }} />
                                    </div>
                                    <div className='text-[24px] md2:text-[36px] font-bold' >
                                        {numberValue}
                                    </div>
                                    <div
                                        onClick={() => incrementValue(true)
                                        }
                                        className={`${numberValue >= mintLimited
                                        ? 'cursor-not-allowed'
                                        : 'cursor-pointer'
                                        } w-[60px] h-[60px] flex flex-row rounded-full bg-[#10141f] items-center justify-center hover:bg-[#36272b]`}
                                    >
                                        <BsPlusLg
                                        style={{ color: '#ffffff', fontSize: '20px' }}
                                        />
                                    </div>
                                </div>
                                {
                                    (mintState == "OG" || mintState == "WL") && (<div className='w-full flex justify-center text-white text-[16px] font-semibold' >
                                        {mintLimited} Mint per wallet allowed
                                    </div>)
                                }
                            </div>
                        )}
                    </div>
                }

                <p className = "text-borderYellow text-content" ><span className = "text-[#ff0000]">Requirement</span>: {MINT_STATES[mintState].solPrice} SOL - 1x SOLKONGZ</p>
                <p className = "text-white text-title text-center" >This WL Token grants the holder access to the newly discovered Jungle Orphanage, and the chance to adopt their very own BabyKong</p>
            </div>
            <img src='https://assets-global.website-files.com/6358359a8c87f073fb0540bb/65538cbacb0d5c7a11b62978_Screenshot%202023-11-14%20150417.png' alt='no imgage' />
            <img src='/img/KongzDAOSUBBER1280black.png' alt='no imgage' />
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
