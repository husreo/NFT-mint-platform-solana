import { NextApiRequest, NextApiResponse } from 'next'
import * as web3 from "@solana/web3.js"
import { Connection, clusterApiUrl, PublicKey, Signer, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import {
    Metaplex,
    keypairIdentity,
    bundlrStorage,
    toMetaplexFile,
    NftWithToken,
    walletAdapterIdentity,
    toBigNumber,
} from "@metaplex-foundation/js"
import * as fs from "fs";
import bs58 from 'bs58';
import { createTransferInstruction, getAssociatedTokenAddress, createAssociatedTokenAccount } from '@solana/spl-token';

interface NftData {
    name: string
    symbol: string
    description: string
    sellerFeeBasisPoints: number
    imageFile: string
}

interface CollectionNftData {
    name: string
    symbol: string
    description: string
    sellerFeeBasisPoints: number
    imageFile: string
    isCollection: boolean
    collectionAuthority: Signer
}

// example data for a new NFT
const nftData = [{
    name: "SolKongz #18",
    symbol: "WL",
    description: "Example nft for pioneer legends",
    sellerFeeBasisPoints: 500,
    imageFile: "public/img/solkongzog.png",
}]

async function uploadMetadata(
    metaplex: Metaplex,
    nftData: NftData
): Promise<string> {
    // file to buffer
    const buffer = fs.readFileSync(nftData.imageFile)

    // buffer to metaplex file
    const file = toMetaplexFile(buffer, nftData.imageFile)

    // upload image and get image uri
    const imageUri = await metaplex.storage().upload(file)
    // const imageUri = "https://ik.imagekit.io/u92vdglg9/spritebox/dracula.png";
    console.log("image uri:", imageUri);
    // upload metadata and get metadata uri (off chain metadata)
    const { uri } = await metaplex.nfts().uploadMetadata({
        name: nftData.name,
        symbol: nftData.symbol,
        description: nftData.description,
        seller_fee_basis_points: nftData.sellerFeeBasisPoints,
        external_url: "",
        properties: {
            files: [
                {
                    uri: imageUri,
                    type: "image/png",
                },
            ],
            category: "image",
            creators: [
                {
                    address: "nQGa8aXWfRSbzfsZ8dvQ7cu6K31LTc9rk7qoU6E217g",
                    share: 100
                }
            ],
        },
        attributes: [
            {
                trait_type: "Faction",
                value: "Third Faction"
            }
        ],
        image: imageUri,
    })

    console.log("metadata uri:", uri)
    return uri
}

async function mintMasterEdition(
    connection: Connection,
    keypair: Keypair,
    uri: string,
    metaplex : Metaplex
) {

    console.log("keypair publickey ==>", keypair.publicKey.toBase58());
    console.log("metadata uri ===>", uri);
    // const metaplex = new Metaplex(connection);
    // metaplex.use(keypairIdentity(keypair));

    // const feePayerAirdropSignature = await connection.requestAirdrop(
    //   keypair.publicKey,
    //   LAMPORTS_PER_SOL
    // );
    // await connection.confirmTransaction(feePayerAirdropSignature);

    const { nft } = await metaplex.nfts().create(
        {
        uri,
        name: "SolKongz #18",
        symbol: "WL",
        sellerFeeBasisPoints: 500,
        creators: [
            {
                address: new PublicKey("nQGa8aXWfRSbzfsZ8dvQ7cu6K31LTc9rk7qoU6E217g"),
                authority: keypair,
                share: 100,
            }
        ],
        tokenStandard: 4,
        mintAuthority : keypair,
         },
        // tokenOwner: new PublicKey("dc8TeANUnouWLK5MvfGRSTQMkofdgQ6kd4RawSUzuEg")
        {commitment : 'finalized'}
    );
    console.log("nft ===>", nft);

    // console.log(`Minted Master Edition: ${nft.address.toString()}`);

    return nft;
}

async function createCollectionNft(
    metaplex: Metaplex,
    uri: string,
    data: CollectionNftData
) {
    const { nft } = await metaplex.nfts().create(
        {
            uri: uri,
            name: data.name,
            sellerFeeBasisPoints: data.sellerFeeBasisPoints,
            symbol: data.symbol,
            isCollection: true,
        },
        { commitment: "finalized" }
    )

    console.log(
        `Collection Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
    )

    return nft
}
async function nftTransfer(
    connection : Connection,
    signer : Keypair
) {
    const receiveWallet = new PublicKey("HaSC4ZZFSmnBXtsqsZJ5VcXREBZKYBKbnzJYtLFsgPxu");
    const mintAddress = new PublicKey("GRVPzc18PqGkukVwWkHswe8VHbhb8VCXaJoQRKsigHEV");
    const sendWallet = new PublicKey("nQGa8aXWfRSbzfsZ8dvQ7cu6K31LTc9rk7qoU6E217g");
    const receiveACA = await getAssociatedTokenAddress(mintAddress,receiveWallet);
    const sendACA = await getAssociatedTokenAddress(mintAddress, sendWallet);
    console.log("receiveACA ===>", receiveACA);
    console.log("sendACA ==>", sendACA);
    // const ACA =await createAssociatedTokenAccount(connection, signer, mintAddress, receiveWallet, {commitment : 'finalized'});
    // console.log("ACA ==>", ACA);
    const transferInstruction = createTransferInstruction(
        sendACA,
        receiveACA,
        new PublicKey("nQGa8aXWfRSbzfsZ8dvQ7cu6K31LTc9rk7qoU6E217g"),
        1
    );
    const transaction = new web3.Transaction();
    transaction.add(transferInstruction);
    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [signer], {commitment:'finalized'} );
    console.log("signature ===>", signature);
    // const transferInstruction = new web3.TransactionInstruction({
    //     keys : [
    //         { pubkey: new PublicKey("DsHcLpzdg5hHQADzRxibXXrjEmU6kqHmahd9c7K3QwF6"), isSigner: false, isWritable: true },
    //         { pubkey: new PublicKey("HaSC4ZZFSmnBXtsqsZJ5VcXREBZKYBKbnzJYtLFsgPxu"), isSigner: false, isWritable: true },
    //         { pubkey: new PublicKey("nQGa8aXWfRSbzfsZ8dvQ7cu6K31LTc9rk7qoU6E217g"), isSigner: true, isWritable: false }
    //     ],
    //     programId : web3.SystemProgram.programId,
    //     data : Buffer.from([4,])
    // });
    // const transaction = new web3.Transaction();
    // transaction.add(transferInstruction);
    // const signature = await web3.sendAndConfirmTransaction(
    //     connection,
    //     transaction,
    //     [signer],
    //     {commitment: 'singleGossip'}
    // );
    // console.log("signature ==>", signature);
}

async function mintNft() {
    // const NETWORK = "mainnet-beta";
    const NETWORK = "devnet";
    const RPC = "https://api.devnet.solana.com";

    const connection = new Connection(RPC);
    const secret = "2h6WhashNFpMMPXtiuMXN5PiWbZ2kNK2C5pcBmQ4sHQt99b5PpaQsc4MJuLUrkiaekqwrfFd7mdjdkSoPbp6z7Bg";
    const secUint8 = Uint8Array.from(bs58.decode(secret));
    // console.log("secret====>", secUint8);

    const user = web3.Keypair.fromSecretKey(secUint8);
    console.log("PublicKey:", user.publicKey.toBase58());

    const balance = await connection.getBalance(user.publicKey);
    // console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL);

    const metaplex = Metaplex.make(connection, { cluster: NETWORK }).use(keypairIdentity(user)).use(bundlrStorage({
        // address: 'https://node1.bundlr.network',
        address: 'https://devnet.bundlr.network',
        providerUrl: RPC,
        timeout: 60000,
    }));
    
    // const uri = await uploadMetadata(metaplex, nftData[0])
    // const nft = await mintMasterEdition(connection, user, uri, metaplex);
    await nftTransfer(connection, user);

}

// main()
//     .then(() => {
//         console.log("Finished successfully")
//         process.exit(0)
//     })
//     .catch((error) => {
//         console.log(error)
//         process.exit(1)
//     })
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        query: { id },
        method,
    } = req

    switch (method) {
        case 'GET':
            mintNft()
                .then(() => {
                    console.log("Finished successfully")
                    res.status(200).json({ success: true })
                })
                .catch((error) => {
                    console.log(error)
                    res.status(400).json({ success: false })
                })
            break;
    
        default:
            break;
    }
}