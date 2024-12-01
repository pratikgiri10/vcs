import express from 'express';
import { scheduleMeeting, meetingDetails } from '../controllers/meeting.controller.js';
const router = express.Router();

router.post('/schedule',scheduleMeeting);
router.get('/details', meetingDetails);


export default router;
