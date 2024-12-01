import { nanoid} from 'nanoid';
import crypto from 'crypto';
import Schedule from '../models/schedule.model.js';

const scheduleDetails = new Schedule();
export async function scheduleMeeting(req,res){
    const { title, desc, when, duration} = req.body;
    console.log(req.body);
    // Generate Meeting ID
    const meetingID = nanoid(12); // Example: "2F4gT8k9L3Mn"

    // Generate Meeting Password
    const meetingPassword = crypto.randomBytes(4).toString('hex'); // Example: "a3f7b9e4"

    console.log({ meetingID, meetingPassword });
    const scheduleDetails = new Schedule({
        title: title,
        description: desc,
        startTime: when,
        duration: duration,
        isHost: true,
        user: req.session.username,
        meetingId: meetingID,
        psw: meetingPassword
    })
    res.send(scheduleDetails);
}
export async function meetingDetails(req,res){
    const meetingDetails = await scheduleDetails.find({user: req.session.username});
    console.log('meeting details: ',meetingDetails);

    res.send(meetingDetails);
}