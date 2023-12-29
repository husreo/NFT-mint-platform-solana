import mongoose from 'mongoose'

export interface Transactions extends mongoose.Document {
    recepient: string,
    paymentWallet: string
    point: number,
    amount: number,
    elementType: number,
    signature: string,
    status: boolean
    createdAt: Date,
    updatedAt: Date
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const TransactionSchema = new mongoose.Schema<Transactions>({
    recepient: {
        type: String,
        required: true
    },
    paymentWallet: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    elementType: {
        type: Number,
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
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

export default mongoose.models.TransactionSchema || mongoose.model<Transactions>('Transactions', TransactionSchema)