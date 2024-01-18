import { PublicKey } from "@solana/web3.js";
export const MINT_STATES = {
    "NOT_STARTED": {
        solPrice: 0
    },
    "OG": {
        solPrice: 0
    },
    "WL": {
        solPrice: 0.25
    },
    "PUBLIC": {
        solPrice: 0.5
    },
    "ENDED": {
        solPrice: 0
    },
};

//  OG mint starts in :
//  OG mint ends in:
//  WL mint ends in:
//  Public mint ends in:
//  ENDED

export const OG_TOKEN = new PublicKey("5CY4inXAWEKDENqJ5ZLNaTYX8gzjHZNXimuj7VmFmVi6");
export const WL_TOKEN = new PublicKey("5CY4inXAWEKDENqJ5ZLNaTYX8gzjHZNXimuj7VmFmVi6");
