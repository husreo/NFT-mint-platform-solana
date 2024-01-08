import { SystemProgram, PublicKey, SYSVAR_RENT_PUBKEY, TransactionInstruction, Connection } from "@solana/web3.js";
import axios from 'axios'
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createTransferCheckedInstruction,
} from "@solana/spl-token";
import { Keypair } from '@solana/web3.js';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { WalletContextState } from "@solana/wallet-adapter-react";
import { web3 } from "@project-serum/anchor";

export const getAssociatedTokenAccount = (ownerPubkey: PublicKey, mintPk: PublicKey): PublicKey => {

    const associatedTokenAccountPubkey = (PublicKey.findProgramAddressSync(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],

        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
};

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: PublicKey,
    payer: PublicKey,
    walletAddress: PublicKey,
    splTokenMintAddress: PublicKey
) => {

    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
};

export const getATokenAccountsNeedCreate = async (
    connection: Connection,
    walletAddress: PublicKey,
    owner: PublicKey,
    nfts: PublicKey[],
) => {
    const instructions = []; const destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        if (walletAddress != owner) {
            const userAccount = getAssociatedTokenAccount(walletAddress, mint);
            response = await connection.getAccountInfo(userAccount);
            if (!response) {
                const createATAIx = createAssociatedTokenAccountInstruction(
                    userAccount,
                    walletAddress,
                    walletAddress,
                    mint,
                );
                instructions.push(createATAIx);
            }
        }
    }
    return {
        instructions,
        destinationAccounts,
    };
};


export const buildSplTransferTx = async (connection: Connection, sender: PublicKey, tokenMint: PublicKey, tokenDecimal: number, receiver: PublicKey, amount: number, wallet: WalletContextState) => {

    let senderTokenAccount = getAssociatedTokenAccount(sender, tokenMint);

    let transaction = new web3.Transaction()

    const { instructions, destinationAccounts } =
        await getATokenAccountsNeedCreate(connection, receiver, receiver, [tokenMint]);
    const aTokenAddress = destinationAccounts[0];
    if (instructions && instructions.length !== 0) {
        transaction.add(instructions[0]);
    }

    transaction.add(
        createTransferCheckedInstruction(
            senderTokenAccount,
            tokenMint,
            aTokenAddress,
            sender,
            amount * Math.pow(10, tokenDecimal),
            tokenDecimal
        )
    );
    console.log("initial transaction:", transaction);
    
    const blockhash = await connection.getLatestBlockhash();
    if (!wallet || !wallet.publicKey || !wallet.signTransaction)
        return null;

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = blockhash.blockhash;

    const signedTx = await wallet.signTransaction(transaction);

    const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true
    })
    
      //  finalizing SOL tx
    await connection.confirmTransaction(signature, "finalized");
}