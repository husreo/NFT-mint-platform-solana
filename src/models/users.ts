import mongoose from 'mongoose'

export interface Users extends mongoose.Document {
    alias: string,
    name: string,
    walletAddress: string,
    twitterId: string,
    imgSRC: string,
    email: string,
    currentPoint: number,
    refferalList: mongoose.Schema.Types.Array,
    lastTweetime: Date,
    createdAt: Date,
    updatedAt: Date
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema<Users>({
    alias: {
        type: String,
        maxlength: [20, 'Name cannot be more than 60 characters'],
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    walletAddress: {
        type: String
    },
    twitterId: {
        type: String,
    },
    imgSRC: {
        type: String,
    },
    currentPoint: {
        type: Number,
    },
    lastTweetime: {
        type: Date,
        default: Date.now
    },
    refferalList: {
        type: mongoose.Schema.Types.Array,
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


let Users;
if (mongoose.models.Users) {
    Users = mongoose.model('Users');
} else {
    Users = mongoose.model('Users', UserSchema);
}

module.exports = Users;