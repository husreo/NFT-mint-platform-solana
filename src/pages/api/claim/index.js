import dbConnect from '../../../lib/dbConnect'
import Claim from '../../../models/claim'
import Users from '../../../models/users'
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {

  // const { body, method } = req;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // const { tweet_id } = body;
  const {
    body,
    method,
  } = req;

  const passbody = JSON.parse(body);

  const { type, walletAddress } = passbody;

  // if (!token) {
  //   return res.status(400).json("Unauthorized request!!!");
  // }

  await dbConnect()
  if (method == "POST") {

    const check = await Users.findOne({ walletAddress: walletAddress.toString() });
    if (!check) {
      return res.status(400).json({ message: "There is no data related with this address!" });
    } else {
      if (Number(type) == 1) {
        const requirePoint = 400;
        if (check.currentPoint < requirePoint) {
          return res.status(400).json({ message: "Not enough OG points!" });
        } else {
          const ogList = await Claim.find({ type: type });
          if (ogList.length >= 1000) {
            return res.status(400).json({ message: "OG listings are limited to 1K." });
          } else {
            const checkOne = await Claim.findOne({ walletAddress: walletAddress.toString(), type: Number(type), delflag: 0 });
            if (checkOne) {
              return res.status(400).json({ message: "You already have OG role." });
            }
            else {
              await Users.findOneAndUpdate({ walletAddress: walletAddress.toString() }, { $inc: { currentPoint: -requirePoint } });
              const claimInsert = new Claim({
                type: Number(type),
                point: requirePoint,
                userId: "",
                twitterId: token.id,
                walletAddress: token.walletAddress
              });

              await claimInsert.save();
              res.status(200).send({ message: "You have been successfully added to the OG!" });
            }
          }
        }
      } else if (Number(type) == 2) {
        const requirePoint = 250;
        if (check.currentPoint < requirePoint) {
          return res.status(400).json({ message: "Not enough WL points!" });
        } else {
          const checkOne = await Claim.findOne({ walletAddress: walletAddress.toString(), type: Number(type), delflag: 0 });
          if (checkOne) {
            return res.status(400).json({ message: "You already have WL role." });
          }
          else {
            await Users.findOneAndUpdate({ walletAddress: walletAddress.toString() }, { $inc: { currentPoint: -requirePoint } });

            const claimInsert = new Claim({
              type: Number(type),
              point: requirePoint,
              userId: "",
              twitterId: token.id,
              walletAddress: walletAddress.toString()
            });

            await claimInsert.save();
            res.status(200).send({ message: "You have been successfully added to the WL!" });
          }
        }
      }
    }
  }
}
