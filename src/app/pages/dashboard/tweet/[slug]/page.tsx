"use client"
import { useEffect } from 'react';
import Leaderboard from "@/component/Leaderboard";
import { FaXTwitter } from "react-icons/fa6"
import { FaChevronLeft } from 'react-icons/fa';
import { signIn } from "next-auth/client";
import { useState } from 'react';
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import {
  useSessionContext
} from '@/context/SessionContext';
import moment from 'moment-timezone';
import Head from "next/head";
const meta = {
  title: 'ELEMENTALS-T2E',
  description: 'The vision of the project is to allow users to earn $ELMNT token by tweeting once per day for the public and twice for token holders.',
  icons: "../favicon.ico",
  image: "https://elemental-v6.vercel.app/main.jpg",
  type: "website",
};
const itemList = [
  {
    url: "/image/event/1.jpg",
    pts: 100
  },
  {
    url: "/image/event/2.jpg",
    pts: 100
  },
  {
    url: "/image/event/3.jpg",
    pts: 100
  },
  {
    url: "/image/event/4.jpg",
    pts: 100
  },
  {
    url: "/image/event/5.jpg",
    pts: 100
  },
  {
    url: "/image/event/6.jpg",
    pts: 100
  },
  {
    url: "/image/nft/1.png",
    pts: 100
  },
  {
    url: "/image/nft/2.png",
    pts: 100
  },
  {
    url: "/image/nft/3.png",
    pts: 100
  },
  {
    url: "/image/nft/4.png",
    pts: 100
  },
  {
    url: "/image/nft/5.png",
    pts: 100
  },
  {
    url: "/image/nft/6.png",
    pts: 100
  },
  {
    url: "/image/nft/7.png",
    pts: 100
  },
  {
    url: "/image/nft/8.png",
    pts: 100
  },
  {
    url: "/image/nft/9.png",
    pts: 100
  },
  {
    url: "/image/nft/10.png",
    pts: 100
  },
];

export default function Page({ params }: { params: { slug: string } }) {
  // const [session] = useSession();
  const [tweetContent, setTweetContent] = useState("Gm to everyone! Join @Elementals_NFT_ and start farming $ELMNT Airdrop.");
  const wallet = useWallet();
  const [userCre, setUserCre] = useState(false);
  const { session } = useSessionContext();
  const [time, setTime] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [userData, setUserData] = useState({
    currentPoint: 0,
    lastTweetime: "",
    createdAt: ""
  });

  const handleLinkClick = async () => {
    if (!disabled) {
      setDisabled(true);

      if (!wallet.connected) {
        toast.error("Please connect your wallet first"); setDisabled(false); return;
      } else {
        if (session?.walletAddress !== "" && session?.walletAddress !== wallet.publicKey?.toString()) {
          toast.error("Wallet address does not match Twitter account");
          setDisabled(false);
          return;
        } else {
          if (tweetContent.trim() === "" || tweetContent.indexOf("@Elementals_NFT_") === -1) {
            toast.warning("Please mention our project on your tweet");
            return;
          } else {

            const referURL = localStorage.getItem('referURL');
            if (referURL !== 'null' || !referURL) {
              const referral = await fetch("/api/referral", {
                method: "POST",
                body: referURL
              })
                .then((response) => {
                  localStorage.removeItem('referURL');
                })
                .catch(err => { console.log(err); })
            } else {
              console.log('referURL is null or undefined');
            }

            updateUser();

            // const referURL = localStorage.getItem('referURL');
            // if (referURL) {
            //   const referral = await fetch("/api/referral", {
            //     method: "POST",
            //     body: JSON.parse(referURL)
            //   })
            //     .then((response) => {
            //       localStorage.removeItem('referURL');
            //     })
            //     .catch(err => { console.log(err); })
            // } else {
            //   console.log('referURL is null or undefined');
            // } 
          }
          setDisabled(false);
        }
      }
    }
  };

  const tweetLink = () => {
    const encodedText = encodeURIComponent(tweetContent);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  }

  const updateUser = async () => {
    await fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify({
        walletAddress: wallet.publicKey
      }),
    })
      .then((response) => {
        toast.success('Due to twitter API updates your points may update slower than expected, No points will be lost.', {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: 1,
          theme: "colored",
        });
        tweetLink();
      })
      .catch(err => { console.log(err); })
  }

  const tweet = async () => {
    if (!disabled) {
      setDisabled(true);

      if (!wallet.connected) {
        toast.error("Please connect your wallet first"); setDisabled(false); return;
      } else {
        if (session?.walletAddress !== "" && session?.walletAddress !== wallet.publicKey?.toString()) {
          toast.error("Wallet address does not match Twitter account");
          setDisabled(false);
          return;
        } else {
          if (tweetContent.trim() === "" || tweetContent.indexOf("@Elementals_NFT_") === -1) {
            toast.warning("Please mention our project on your tweet");
            setDisabled(false);
            return;
          } else {
            if (time > 0 && userData.currentPoint !== 0) {
              // User has already tweeted within cooldown period
              toast.error("You can tweet once a day"); setDisabled(false); return;
            } else {
              const results = await fetch("/api/history/tweet", {
                method: "POST",
                body: JSON.stringify({
                  tweetContent,
                  slug: itemList[Number(params.slug) - 1].url,
                  walletAddress: wallet.publicKey
                }),
              }).then(async (res) => {
                console.log(res, "///////////");
                if (res.status == 401) {
                  toast.error("You can tweet once a day."); setDisabled(false); return;
                }
                if (res.status == 200) {
                  toast.success("Successfully tweeted! You got +100 point");
                  // setUserPoint(userPoint + 100);
                  setTime(24 * 60 * 60 * 1000);
                  setDisabled(false);
                  userFetch();
                  const referURL = localStorage.getItem('referURL');
                  if (referURL) {
                    const referral = await fetch("/api/referral", {
                      method: "POST",
                      body: JSON.parse(referURL)
                    })
                      .then((response) => {
                        localStorage.removeItem('referURL');
                      })
                      .catch(err => { console.log(err); })
                  } else {
                    console.log('referURL is null or undefined');
                  }

                }
                if (res.status == 400) {

                  toast.error("Something went wrong."); setDisabled(false); return;
                }
              }).catch((err) => {
                toast.error("Something went wrong"); setDisabled(false);
                console.log(err);
              })
            }
          }
        }
      }
    }
  }

  const userFetch = async () => {
    await fetch("/api/user/", {
      method: "GET"
    }).then((res) => {
      res.json().then(hol => {
        setUserData(hol);
        setUserPoint(hol.currentPoint);
      });
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    userFetch();
  }, []);

  useEffect(() => {
    if (userData.lastTweetime) {
      if (userData.lastTweetime == userData.createdAt) {
        setTime(0); return;
      }
      const interval = setInterval(() => {

        const currentTime = moment(); // Get the current time

        const convertedTime = currentTime.utcOffset(0).format(); // Convert and format the time

        const lastTweetTime = userData.lastTweetime;
        const diff = 24 * 60 * 60 * 1000 - moment(convertedTime).diff(moment(lastTweetTime), "milliseconds");

        setTime(diff);
        if (diff < 1000) {
          setTime(0);
          clearInterval(interval);
        }
      }, 1000); // Update the timer every 1000ms (1 second)
      return () => clearInterval(interval); // C
    }
  }, [userData])

  const formatTime = (time: any) => {
    const hours = Math.floor(time / (60 * 60 * 1000));
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);
    return `${hours}:${minutes}:${seconds}`;
  };

  const [userPoint, setUserPoint] = useState(0);

  useEffect(() => {
    if (wallet.connected) {
      setUserCre(true);
    }
    if (wallet.publicKey) {
    }
    return () => { }
  }, [wallet]);

  return <>
    <Head>
      <title>{"T2E | Tweet"}</title>
      <link rel="icon" href="../../favicon.ico" sizes="any" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Elementals_NFT_" />
      <meta name="twitter:image" content={`https://tweet2earn.xyz${itemList[Number(params.slug) - 1].url}`} />
      <meta property="og:url" content={`https://tweet2earn.xyz`} />
      <link rel="canonical" href={`https://tweet2earn.xyz`} />
      <link rel="icon" href={meta.icons} sizes="any" />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="Elementals-T2E" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={`https://tweet2earn.xyz${itemList[Number(params.slug) - 1].url}`} />
    </Head>
    <main className='w-full grid grid-cols-12 gap-6 pb-10 mt-10'>
      <div className="w-full flex flex-col gap-[28px] col-span-12 sm:col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
        <div className='flex justify-between w-full'>
          <Link href="/dashboard" className='flex py-1 pr-3 pl-1 items-center rounded-full border-[1px] border-black bg-white'>
            <FaChevronLeft />
            <p className='text-3 leading-[21px] bg-white'>Back</p>
          </Link>
          {session?.user && wallet.publicKey ?
            <div className='flex w-[120x] py-[4px] pl-[4px] pr-[12px] gap-[8px] bg-white rounded-full border-[1px] border-[#000]'>
              <div className='1/4'>
                <img src="../../image/icon/coin@3x.png" alt="" className='w-[24px] h-[24px]' />
              </div>
              <div className='2/4'>
                <p>{userPoint}</p>
              </div>
              <div className='1/4'>pts</div>
            </div> : null}
        </div>
        <div className='flex justify-between w-full items-center'>
          <p className="text-md1 font-semibold leading-[40px] uppercase">Compose Tweet</p>
          {/* {remainingTime && <span> {remainingTime} </span>} */}
          {/* {session?.user && wallet.publicKey ?
            <h2 className='font-semibold text-md1'>{formatTime(time)}</h2> : null} */}

        </div>
        <div className="flex w-full gap-[24px] flex-col lg:flex-row">
          <div className="w-full rounded-[16px] border-[1px] border-dark bg-cardBack p-[12px]">
            <textarea className="w-full h-[316px] rounded-[16px] bg-[#F4E7D6] p-[16px] resize-none" defaultValue={tweetContent} onChange={(e) => { setTweetContent(e.target.value) }} maxLength={249}></textarea>
            <div className="w-full flex justify-between items-center">
              <div>
                {`${tweetContent.length}/250`}
              </div>
              {session?.user ?
                <button
                  className={`flex justify-center items-center gap-2 px-[16px] py-[12px] bg-[#222] rounded-[10px] border-[1px] border-[#F4E7D6] mt-2 text-white ${disabled ? "opacity-40" : ""}`} disabled={disabled} onClick={() => { handleLinkClick() }}>
                  <FaXTwitter />TWEET
                </button> :
                <button className='flex justify-center items-center gap-2 px-[16px] py-[12px] bg-[#222] rounded-[10px] border-[1px] border-[#F4E7D6] mt-2 text-white' onClick={() => { signIn() }}>
                  <FaXTwitter />CONNECT
                </button>}
            </div>
          </div>
          <div className='flex p-[12px] flex-col items-center gap-[16px] rounded-[16px] border-[1px] border-dark bg-cardBack'>
            <div className='relative'>
              <img src={itemList[Number(params.slug) - 1].url} alt="" width={400} height={400} className="rounded-[13px]" />
              <div className='w-full h-[13px]'>
                <div className='flex w-[120x] py-[4px] pl-[4px] pr-[12px] gap-[8px] bg-white rounded-full border-[1px] border-[#000] absolute bottom-0 left-[calc(50%-2.8rem)]'>
                  <div className='1/4'>
                    <img src="../../image/icon/coin@3x.png" alt="" className='w-[24px] h-[24px]' />
                  </div>
                  <div className='2/4'>
                    <p>{itemList[Number(params.slug) - 1].pts}</p>
                  </div>
                  <div className='1/4'>pts</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Leaderboard />
    </main></>
}