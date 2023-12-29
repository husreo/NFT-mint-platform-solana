import mongoose from 'mongoose'

export interface Refferal extends mongoose.Document {
    receiverID: string,
    name: string,
    senderID: string,
    used: boolean,
    createdAt: Date
}

const RefferalSchema = new mongoose.Schema<Refferal>({
    receiverID: {
        type: String
    },
    name: {
        type: String,
    },
    senderID: {
        type: String,
    },
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

// Check if the model already exists
if (mongoose.models && mongoose.models.Refferals) {
    // Use the existing model
    module.exports = mongoose.models.Refferals;
  } else {
    // Define the model
    const Refferals = mongoose.model('Refferals', RefferalSchema);
    module.exports = Refferals;
  }
  
