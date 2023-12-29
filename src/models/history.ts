import mongoose from 'mongoose'

export interface History extends mongoose.Document {
    userId: string,
    tweetId: string
    tweetContent: string,
    point: number,
    createdAt: Date,
    updatedAt: Date
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const HistorySchma = new mongoose.Schema<History>({
    userId: {
        type: String,
        required: true
    },
    tweetId: {
        type: String,
        required: true
    },
    tweetContent: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        required: true
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

let History;
if (mongoose.models.History) {
    History = mongoose.model('History');
} else {
    History = mongoose.model('History', HistorySchma);
}

module.exports = History;
