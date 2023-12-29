import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect'
import Items from '../../../models/items'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const {
    body,
    method,
  } = req;

  await dbConnect()

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const allItems = await Items.find();
        if (!allItems) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: allItems })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST' /* Get a model by its ID */:
      try {
        const newItem = new Items({
          itemType: body.itemType,
          imgSRC: body.imgSRC,
          point: body.point,
          content: body.content
        });

        await newItem.save();
        res.status(200).send({ success: true, data: newItem });
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'PUT' /* Edit a model by its ID */:
      try {
        const item = await Items.findById(body._id)
        if (!item) {
          return res.status(400).json({ message: "Item no exists!" });
        }
        res.status(200).send({ success: true, data: item });
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}