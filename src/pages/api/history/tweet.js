import dbConnect from '../../../lib/dbConnect'
import History from "@/models/history";
import OAuth from "oauth-1.0a";
import { createHmac } from "crypto";
import request from "request";
const fs = require('fs');
const path = require('path');
import Users from "@/models/users";
import moment from 'moment/moment';

import { getSession } from "next-auth/client";
import { getToken } from "next-auth/jwt";
import { TwitterApi } from 'twitter-api-v2';

// const oauth = new OAuth({
//   consumer: {
//     key: process.env.TWITTER_CONSUMER_KEY,
//     secret: process.env.TWITTER_CONSUMER_SECRET,
//   },
//   signature_method: "HMAC-SHA1",
//   hash_function(base_string, key) {
//     return createHmac("sha1", key).update(base_string).digest("base64");
//   },
// });

// function uploadMedia(imagePath, slug, tokenByUser, callback) {
//   const formData = {
//     media: {
//       value: require('fs').createReadStream(imagePath),
//       options: { filename: `Elementals${slug}.jpg` },
//     },
//   };

//   const request_media_data = {
//     url: 'https://upload.twitter.com/1.1/media/upload.json?media_category=tweet_image',
//     method: 'POST',
//   };

//   request(
//     {
//       url: request_media_data.url,
//       method: request_media_data.method,
//       headers: oauth.toHeader(oauth.authorize(request_media_data, tokenByUser)),
//       formData: formData,
//     },
//     function (error, response, body) {
//       if (!error && response.statusCode === 200) {
//         const mediaId = JSON.parse(body).media_id_string;
//         callback(null, mediaId);
//       } else {
//         callback(error || new Error(`Status code: ${response.statusCode}`));
//       }
//     }
//   );
// }

// export default async function handler(
//   req,
//   res
// ) {
//   const body = JSON.parse(req.body);
//   const { tweetContent, slug, walletAddress } = body;

//   const imagePath = path.join(process.cwd(), `/public${slug}`);

//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   const tokenByUser = {
//     key: token.twitter.accessToken,
//     secret: token.twitter.refreshToken,
//   }

//   try {

//     const user = await Users.findOne({ twitterId: token.id });

//     if (user && user.currentPoint !== 0) {
//       const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
//       const currentTime = moment(); // Get the current time
//       const convertedTime = currentTime.utcOffset(0).format(); // Convert and format the time

//       const lastTweetTime = user.lastTweetime;
//       const diff = moment(convertedTime).diff(moment(lastTweetTime), "milliseconds");

//       if (diff < cooldownPeriod) {
//         // User has already tweeted within cooldown period
//         return res.status(401).json({ error: 'You can only tweet once per day.' });
//       }
//     }


//     uploadMedia(imagePath, slug, tokenByUser, function (error, mediaId) {
//       if (error) {
//         console.error('Error uploading media:', error);
//         return res.status(400).send({ success: false });
//       }

//       const requestData = {
//         url: 'https://api.twitter.com/2/tweets',
//         method: 'POST'
//       };
//       request(
//         {
//           url: requestData.url,
//           method: requestData.method,
//           headers: {
//             ...oauth.toHeader(oauth.authorize(requestData, tokenByUser)),
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             text: tweetContent,
//             media: {
//               media_ids: [mediaId]
//             }
//           }),
//         },
//         async function (error, response, body) {
//           if (!error) {
//             console.log('Tweet posted!');
//             console.log('Body:', body);

//             await dbConnect();

//             const updatedUser = await Users.findOneAndUpdate(
//               { twitterId: token.id },
//               {
//                 $set: {
//                   walletAddress: walletAddress.toString(),
//                   lastTweetime: Date.now()
//                 },
//                 $inc: { currentPoint: 100 }
//               },
//               { new: true }
//             );

//             if (updatedUser) {
//               console.log('Updated user:', updatedUser);
//             }
//             const insertHistory = new History({
//               userId: token.id,
//               tweetId: mediaId,
//               tweetContent: tweetContent,
//               point: 100
//             });
//             await insertHistory.save();
//             res.status(200).send({ data: insertHistory });
//           } else {
//             console.error('Error posting tweet:', error);
//             console.error('Status code:', response.statusCode);
//             console.error('Body:', body);
//             return res.status(400).send({ success: false });
//           }
//         }
//       );
//     });

//   } catch (e) {
//     console.log('post error ==> ', e);
//     return res.status(400).json({
//       status: e.message,
//     });
//   }
// }

export default async (req, res) => {
  const body = JSON.parse(req.body);
  // const { tweet_id } = body;

  const { tweetContent, slug, walletAddress } = body;
  const imagePath = path.join(process.cwd(), `/public${slug}`);

  const session = await getSession({ req });
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return res.status(401).json({
      status: "ERR",
      message: "you are not allowed"
    })
  }

  const second_client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: token.twitter.accessToken,
    accessSecret: token.twitter.refreshToken
  })


  const twitter = second_client.readWrite;
  try {

    const user = await Users.findOne({ twitterId: token.id });

    if (user && user.currentPoint !== 0) {
      const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const currentTime = moment(); // Get the current time
      const convertedTime = currentTime.utcOffset(0).format(); // Convert and format the time

      const lastTweetTime = user.lastTweetime;
      const diff = moment(convertedTime).diff(moment(lastTweetTime), "milliseconds");

      if (diff < cooldownPeriod) {
        // User has already tweeted within cooldown period
        return res.status(401).json({ error: 'You can only tweet once per day.' });
      }
    }
    // const result = await twitter.v2.like(token.sub ,tweet_id);

    // const { data: createdTweet } = await twitter.v2.tweet('twitter-api-v2 is awesome!', {
    //   poll: { duration_minutes: 120, options: ['Absolutely', 'For sure!'] },
    // });

    // You can use media IDs generated by v1 API to send medias!
    const mediaId = await twitter.v1.uploadMedia(imagePath);

    await twitter.v2.tweetThread([
      { text: tweetContent, media: { media_ids: [mediaId] } },
    ]);

    console.log('Tweet posted!');
    console.log('Body:', body);

    await dbConnect();

    const updatedUser = await Users.findOneAndUpdate(
      { twitterId: token.id },
      {
        $set: {
          walletAddress: walletAddress.toString(),
          lastTweetime: Date.now()
        },
        $inc: { currentPoint: 100 }
      },
      { new: true }
    );

    if (updatedUser) {
      console.log('Updated user:', updatedUser);
    }
    const insertHistory = new History({
      userId: token.id,
      tweetId: mediaId,
      tweetContent: tweetContent,
      point: 100
    });
    await insertHistory.save();
    res.status(200).send({ data: insertHistory });

    return res.status(200).json({
      status: "Ok",
    });
  } catch (error) {
    console.error(error);
    console.error('Error posting tweet:', error);
    console.error('Status code:', response.statusCode);
    console.error('Body:', body);
    return res.status(400).send({ success: false });
  }
};
