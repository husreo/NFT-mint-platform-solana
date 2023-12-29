import dbConnect from '../../../lib/dbConnect'
import Referral from '../../../models/referral'
import Users from '../../../models/users'
import { getToken } from "next-auth/jwt";
import { sendRenderResult } from 'next/dist/server/send-payload';

export default async function handler(req, res) {

  const { body, method } = req;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });


  await dbConnect()

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        if (token) {
          const allItems = await Referral.find({ senderID: token.id }).sort({ createdAt: -1 });
          if (allItems.length > 0) {
            // const setPoint = await Users.findOneAndUpdate({ twitterId: token.id }, { $inc: { currentPoint: allItems.length * 10 } });
            // const setTrue = await Referral.updateMany({ senderID: token.id }, {
            //   $set: {
            //     used: true
            //   }
            // })
            res.status(200).json({ allItems });
          } else {
            res.status(200).json({ })
          }
        }
      } catch (error) {
        console.log("Database error", error);
      }
      break
    case 'POST' /* Get a model by its ID */:

      try {
        const sender = body;
        if (sender) {
          const receiver = token.id;
          const name = token.name;
          if (sender != receiver) {
            const recSearch = await Referral.findOne({ receiverID: sender });
            if (recSearch) {
              res.status(400).json({ msg: 'This user was refered before!' });
            } else {
              const referralSearch = await Referral.findOne({ senderID: sender, receiverID: receiver });
              if (referralSearch) {
                res.status(400).json({ msg: 'This user has visited before!' });
              } else {
                const newReferral = new Referral({ senderID: sender, receiverID: receiver, name: name, used: false });
                await newReferral.save();
                await Users.findOneAndUpdate({ twitterId: sender }, { $inc: { currentPoint: 10 } });

                res.status(200).json({ success: true })
              }
            }
          } else {
            res.status(400).json({ msg: 'Sender is same with receiver!' });
          }
        }

      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false })
      }
      break
    case 'PUT' /* Edit a model by its ID */:
      // try {
      //   const item = await Items.findById(body._id)
      //   if (!item) {
      //     return res.status(400).json({ message: "Item no exists!" });
      //   }

      //   res.status(200).send({ success: true, data: item });
      // } catch (error) {
      //   res.status(400).json({ success: false })
      // }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}