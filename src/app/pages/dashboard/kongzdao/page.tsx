"use client"
import Image from 'next/image'
import ScholashipBtn from '../../../component/ScholashipBtn'
import assets from '../../../util/images';
import Countdown from '../../../component/CountDown';
import { MINT_STATES, OG_TOKEN, WL_TOKEN } from '../../../util/config';
import { errorAlert, infoAlert, successAlert } from '../../../component/ToastGroup';
import { getAtaForMint } from '../../../util/misc';

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
  process.env.NEXT_PUBLIC_CANDYMACINE_ID ?? "EowhSrBSgR4ogjKZBh11Z6TvWjKXszHS6sup2e8JQZyP";

export default function Home() {

  const [isOpen, setOpen] = useState(false);
  const wallet: wallet = useAnchorWallet();

  const [candyMachine, setCandyMachine] = useState<
    CandyMachine<DefaultCandyGuardSettings> | undefined
  >(undefined);
  const [numberValue, setNumberValue] = useState<number>(1);
  const [mintText, setMintText] = useState<string>('Pixelated Apes'); 
  const [mintLimited, setMintLimited] = useState<number>(0);

  const [mintState, setMintState] = useState<keyof typeof MINT_STATES>("NOT_STARTED");
  const [nextTime, setNextTime] = useState<Date>(new Date());

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsMinted, setItemsMinted] = useState(0);
  const [soldOut, setSoldOut] = useState(false);

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
    console.log("cndy wallet: ", cndy?.candyGuard?.groups[4].guards.addressGate?.address.toBase58());

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
          cndy?.candyGuard?.groups[3].guards.startDate?.date.toNumber() * 1000
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

    if (mintState == "OG")
      setMintLimited(3);
    else if (mintState == "WL")
      setMintLimited(2);
    else
      setMintLimited(10);
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
                <ScholashipBtn content = "BACK TO THE JUNGLE" url = "/pages/dashboard" />
                <div className='hidden md:flex'>
                    <WalletMultiButton style={{color: '#FFAB24', height: "32px", border: "1px solid #FFAB24", borderRadius: "10px", backgroundColor: "transparent", fontSize: '15px', fontFamily: "SHPinscher, sans-serif'"}} />
                </div>
                <div className='hidden md:flex justify-between gap-6 text-white text-content'>
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
                    <div className='absolute w-full bg-[#000] top-[5rem] left-0 p-4 text-white flex md:hidden flex-col gap-4'>
                        <div className='w-full flex justify-center'>
                            <WalletMultiButton style={{color: '#FFAB24', height: "32px", border: "1px solid #FFAB24", borderRadius: "10px", backgroundColor: "transparent", fontSize: '15px', fontFamily: "SHPinscher, sans-serif'"}} />
                        </div>
                        <Link href="/pages/dashboard/shop"className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Shop</Link>
                        <Link href="https://t.co/I52MPobQbV" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Twitter</Link>
                        <Link href="https://discord.gg/hrQX37Cs" className='w-full Kongz Dao text-center hover:bg-[#907848] duration-300'>Discord</Link>
                    </div>
                )}
            </div>
        </div>
        {/* --------------------------------- Header End ----------------------------- */}
        {/* --------------------------------- Body ----------------------------------- */}

        <div className='w-full flex flex-col justify-between items-center gap-20 pb-14'>
            <div className='w-full md:w-1/3 border-[6px] ro unded-2xl border-borderYellow bg-bgColor flex flex-col gap-4 items-center p-4'>
                <div className='text-title text-white text-center gap-6 w-full'><span>SOLKONGZ</span> - HL TOKEN <span className = "text-borderYellow">#1/5000</span><span className='text-title' > 1 SOL</span></div>
                <div className = "relative">
                    <img src = {assets[1].url} alt="no image" className = "w-[550px] z-10" />
                    <button className = "text-[38px] text-borderYellow border-[0.5rem] border-b-[#111] border-r-[#111] absolute bottom-[-20px] bg-bgColor left-[calc(50%-6.7rem)] rounded-full px-4" >Comming Soon!</button>
                </div>
                <p className = "text-borderYellow text-content" ><span className = "text-[#ff0000]">Requirement</span>: 2000 $PELL - 1x SOLKONGZ</p>
                <p className = "text-white text-title text-center" >This WL Token grants the holder access to the newly discovered Jungle Orphanage, and the chance to adopt their very own BabyKong</p>
            </div>
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
