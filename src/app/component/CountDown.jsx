import { default as ReactCountdown } from "react-countdown";
import { useEffect, useState } from "react";

const Countdown = ({ nextTime, mintState, refresh }) => {
    const [mintText, setMintText] = useState("")

    const renderer = ({ days, hours, minutes, seconds }) => {
        return (
            <>
                {nextTime == null ? (
                    <div className="mt-5 text-2xl font-extrabold text-white md:text-3xl animate-bounce">
                        Mint Ended
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <h1 className="text-xl text-white mt-8">{mintText}</h1>
                        <div className="mt-5 text-xl font-extrabold animate-bounce text-white [&>span]:text-[#ff1109] [&>span]:text-3xl">
                            <span>{days}</span> D : <span>{hours}</span> H : <span>{minutes}</span> M : <span>{seconds}</span> S
                        </div>
                    </div>
                )}
            </>
        );
    };

    useEffect(() => {
        if (mintState === "NOT_STARTED") setMintText("OG mint starts in :");
        else if (mintState === "OG") setMintText("OG mint ends in :");
        else if (mintState === "WL") setMintText("WL mint ends in:");
        else if (mintState === "PUBLIC") setMintText("Public mint");

    }, [mintState])

    const update = () => {
        refresh();
    };

    return (
        <ReactCountdown
            key={nextTime}
            date={nextTime}
            renderer={renderer}
            onComplete={update}
        />
    );
};

export default Countdown;
