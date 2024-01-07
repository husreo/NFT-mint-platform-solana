import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import React, { FC, useCallback } from "react";

const { connection } = useConnection();
const { publicKey, sendTransaction } = useWallet();

const sendSol = (amount: Number) => {

}