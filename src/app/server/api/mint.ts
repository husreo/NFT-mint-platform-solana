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
import { initializeKeypair } from "./initializeKeypair";

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
    imageFile: "https://assets-global.website-files.com/6358359a8c87f073fb0540bb/6358359a8c87f02e0c054133_Love%20Kong.png",
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
) {

    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(keypair));

    // const feePayerAirdropSignature = await connection.requestAirdrop(
    //   keypair.publicKey,
    //   LAMPORTS_PER_SOL
    // );
    // await connection.confirmTransaction(feePayerAirdropSignature);

    const { nft } = await metaplex.nfts().create({
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
        // tokenOwner: new PublicKey("dc8TeANUnouWLK5MvfGRSTQMkofdgQ6kd4RawSUzuEg")
    });

    console.log(`Minted Master Edition: ${nft.address.toString()}`);

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

async function mintNft() {
    // const NETWORK = "mainnet-beta";
    const NETWORK = "devnet";
    const RPC = "https://api.devnet.solana.com";

    const connection = new Connection(RPC);

    const user = await initializeKeypair(connection);
    console.log("PublicKey:", user.publicKey.toBase58());

    const balance = await connection.getBalance(user.publicKey);
    console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL);

    const metaplex = Metaplex.make(connection, { cluster: NETWORK }).use(keypairIdentity(user)).use(bundlrStorage({
        // address: 'https://node1.bundlr.network',
        address: 'https://devnet.bundlr.network',
        providerUrl: RPC,
        timeout: 60000,
    }));

    const uri = await uploadMetadata(metaplex, nftData[0])

    const nft = await mintMasterEdition(connection, user, uri);

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