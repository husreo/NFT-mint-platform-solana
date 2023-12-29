import dbConnect from '../../../lib/dbConnect';
import Users from "@/models/users";

export default async function handler(
    req,
    res
) {
    
    await dbConnect();
    try {
        const check = await Users.find({}, {
            imgSRC: 1,
            name: 1,
            walletAddress: 1,
            currentPoint: 1
        }).sort({ currentPoint: -1 });
        if (!check) {
            return res.status(400).json({ message: "There is no data related with this address!" });
        }
        res.status(200).json({ check });
    } catch (error) {
        res.status(400).json({ success: false })
    }
}