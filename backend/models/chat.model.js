import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

    roomId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Chat = mongoose.model('Chat',chatSchema);