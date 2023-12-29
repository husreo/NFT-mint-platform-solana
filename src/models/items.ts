import mongoose from 'mongoose'

export interface Items extends mongoose.Document {
    itemType: number,
    imgSRC: string,
    point: number,
    content: string
    createdAt: Date,
    updatedAt: Date
}

/* UserSchema will correspond to a collection in your MongoDB database. */
const ItemsSchema = new mongoose.Schema<Items>({
    itemType: {
        type: Number,
        default: 0
    },
    imgSRC: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    content: {
        type: String,
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

export default mongoose.models.ItemsSchema || mongoose.model<Items>('Items', ItemsSchema)