import { PublicKey } from "@solana/web3.js";
export const MINT_STATES = {
    "NOT_STARTED": {
        solPrice: 0
    },
    "OG": {
        solPrice: 0
    },
    "WL": {
        solPrice: 0.11
    },
    "PUBLIC": {
        solPrice: 0.22
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

export const OG_TOKEN = new PublicKey("Epj886ocojGbny7qdFgaJHgqU21eoxWhJ65JH25tEHKZ");
export const WL_TOKEN = new PublicKey("5PouzKSqGoWjcBngnFz4BEKFqFBa2GotwdbCpnmN77Sd");
