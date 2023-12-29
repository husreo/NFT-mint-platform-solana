'use client'

import React, { ReactNode, useState } from "react";

import { StaticImageData } from "next/image";
import { type } from "os";

type appContextType = {
  user: { url: string, name: string, wallet: string, pts: number }[];
};

type Props = {
  children: ReactNode
}

let avatar = "image/icon/user.png";

const AppContextDefaultValues: appContextType = {
    user: [
        {
          url: avatar,
          name: 'Amanda',
          wallet: "2312132ds235lkkk5k6klk7l87kjjk2j3223wcsds",
          pts: 20000
        },
        {
          url: avatar,
          name: 'Nika',
          wallet: "2312132ds235lkkk5k6klk7l87kjjk2j3223wcsds",
          pts: 20000
        },
        {
          url: avatar,
          name: 'Honda',
          wallet: "2312132ds235lkkk5k6klk7l87kjjk2j3223wcsds",
          pts: 20000
        },
        {
          url: avatar,
          name: 'Yeni',
          wallet: "2312132ds235lkkk5k6klk7l87kjjk2j3223wcsds",
          pts: 235457
        },
        {
          url: avatar,
          name: 'Natasha',
          wallet: "2312132ds235lkkk5k6klk7l87kjjk2j3223wcsds",
          pts: 20000
        },
        {
          url: avatar,
          name: 'Solman',
          wallet: "2312132ds235lkkk5k6klk7l87kjjk2j3223wcsds",
          pts: 20000
        },
    ]
};

// export const TrackerContext = React.createContext();
// export const SetTrackerContext = React.createContext();
export const AppContext = React.createContext<appContextType>(AppContextDefaultValues);

export function HolderProvider({ children }:Props) {
    const [tracker, setHolder] = useState()

    const [user, setUser] = useState(AppContextDefaultValues)
    // function settraker(object) {
    //     setHolder(object)
    // }

    return (
      <AppContext.Provider value={user} >
        {children}
      </AppContext.Provider>
    )
}