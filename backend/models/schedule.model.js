import mongoose from'mongoose';

const scheduleSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    startTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    isHost: {
        type: Boolean
    },
    user: {
        type: String
    },
    meetingId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    }
},{ timestamps: true });

const Schedule = mongoose.model('Schedule',scheduleSchema);
export default Schedule;