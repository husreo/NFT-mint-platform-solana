
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { Types } from 'mongoose';
import dbConnect from '../../../lib/dbConnect';
import Users from "@/models/users";
import { getToken } from 'next-auth/jwt';


export default NextAuth({

    providers: [
        Providers.Twitter({
            clientId: process.env.TWITTER_CONSUMER_KEY,
            clientSecret: process.env.TWITTER_CONSUMER_SECRET,
            // clientId: 'ETm3Dy9ruO8Q1BIEAwz3p6Xm5',
            // clientSecret: 'rjBrBIopIW7ZzkRyStLdtuOaLmxHvOMZ9tuxWr2sNlH8TdqAxk',
            // authorization: {
            //   params: { scope: "tweet.write" },
            // },
        }),

        // Providers.Discord({
        //   clientId: process.env.DISCORD_ID,
        //   clientSecret: process.env.DISCORD_PUBLIC_KEY,
        //   scope: "guilds"
        // }),

    ],

    callbacks: {
        async signIn(user, account, profile) {
            if (user) {
                try {
                    await dbConnect();
                    const check = await Users.findOne({ twitterId: user.id })
                    if (!check) {
                        const users = new Users({
                            alias: profile.screen_name,
                            name: profile.name,
                            walletAddress: "",
                            twitterId: user.id,
                            imgSRC: profile.profile_image_url_https,
                            email: profile.email,
                            currentPoint: 0
                        });
                        await users.save();
                    }
                } catch (error) {
                    console.log("error==========================", error);
                    return false
                }
            }
            return true
        },
        async session(session, user) {
            user.image = user.picture;
            user.email = user.id;
            session.user = user;
            await dbConnect();
            const check = await Users.findOne({ twitterId: user.id })
            if (check) {
                session.walletAddress = check.walletAddress
            }
            return session;
        },
        async jwt(token, user, account, profile, isNewUser) {
            await dbConnect();
            if (user) {
                token.id = user.id
                // console.log(user)

                const check = await Users.findOne({ twitterId: user.id })

                if (check) {
                    token.walletAddress = check.walletAddress
                }
            }
            if (account) {
                token.twitter = account;

            }

            return token
        }

    },

    secret: process.env.NEXTAUTH_SECRET,
});
