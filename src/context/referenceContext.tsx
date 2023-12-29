'use client'

import React, { ReactNode, useState, useContext } from "react";
import { createContext } from 'react';

type ReferContextType = {
    refer: string;
    setRefer: (name: string) => void;
};

const ReferContextDefaultValues: ReferContextType = {
    refer: '',
    setRefer: (name: string) => {},
};

const ReferContext = createContext<ReferContextType>(ReferContextDefaultValues);

export function useAuth() {
    return useContext(ReferContext);
}

type Props = {
    children: ReactNode;
};

export function ReferProvider({ children }: Props) {
    const [refer, setReferval] = useState<string>('');

    const setRefer = (name: string) => {
        setReferval(name);
    };

    const refervalue = {
        refer,
        setRefer,
    };
    
    return (
        <>
            <ReferContext.Provider value={refervalue}>
                {children}
            </ReferContext.Provider>
        </>
    );
}