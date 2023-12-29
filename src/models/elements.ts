import mongoose from 'mongoose'

export interface Elements extends mongoose.Document {
    toeknAddress: string,
    type: number,
    tokenDesc: string,
    formula: string
    createdAt: Date,
    updatedAt: Date
}

const ElementSchema = new mongoose.Schema<Elements>({
    toeknAddress: {
        type: String
    },
    type: {
        type: Number,
        default: 0,
    },
    tokenDesc: {
        type: String,
    },
    formula: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

export default mongoose.models.ElementSchema || mongoose.model<Elements>('Elements', ElementSchema)