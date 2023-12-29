'use client'

import React, { ReactNode, useState, useContext } from "react";
import { createContext } from 'react';

type ParamContextType = {
    param: string;
    setParam: (name: string) => void;
};

const ParamContextDefaultValues: ParamContextType = {
    param: '',
    setParam: (name: string) => {},
};

const ParamContext = createContext<ParamContextType>(ParamContextDefaultValues);

export function useParam() {
    return useContext(ParamContext);
}

type Props = {
    children: ReactNode;
};

export function ParamProvider({ children }: Props) {
    const [param, setParamVal] = useState<string>('');

    const setParam = (name: string) => {
        setParamVal(name);
    };

    const refervalue = {
        param,
        setParam,
    };
    return (
        <>
            <ParamContext.Provider value={refervalue}>
                {children}
            </ParamContext.Provider>
        </>
    );
}