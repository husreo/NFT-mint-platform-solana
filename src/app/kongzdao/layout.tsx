'use client'
import { useState, useMemo, useEffect } from "react";
import 'simplebar-react/dist/simplebar.min.css';

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ToastContainer, toast } from 'react-toastify';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const network = WalletAdapterNetwork.Mainnet;
  const wallet = new PhantomWalletAdapter();

  return (
      <ConnectionProvider endpoint={process.env.RPC_HOST || 'https://api.devnet.solana.com'}>
        <WalletProvider wallets={[wallet]} autoConnect>
          <WalletModalProvider>
              <ToastContainer/> 
                {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  )
}
