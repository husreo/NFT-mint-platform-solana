import mongoose from 'mongoose'

export interface Claims extends mongoose.Document {
   type: number,
   point: number,
   userId: string,
   twitterId: string,
   walletAddress: string,
   delflag: number,
   createdAt: Date,
   updatedAt: Date
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const ClaimSchema = new mongoose.Schema<Claims>({
    userId: {
        type: String,
    },
    twitterId: {
        type: String,
    },
    type: {
        type: Number,
        default: 1,
    },
    walletAddress: {
        type: String
    },
    delflag: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

let Claims;
if (mongoose.models.Claims) {
    Claims = mongoose.model('Claims');
} else {
    Claims = mongoose.model('Claims', ClaimSchema);
}

module.exports = Claims;