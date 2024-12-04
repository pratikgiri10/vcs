import express from 'express';
import { scheduleMeeting, meetingDetails, deleteMeeting, getMeetingId } from '../controllers/meeting.controller.js';
const router = express.Router();

router.post('/schedule',scheduleMeeting);
router.get('/details', meetingDetails);
router.delete('/delete',deleteMeeting);
router.get('/:id', getMeetingId);

export default router;
