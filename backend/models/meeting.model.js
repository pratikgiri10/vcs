import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    roomId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    host: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    participants: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    ],
    
  }, { timestamps: true });
  
  const Room = mongoose.model('Room', roomSchema);
  