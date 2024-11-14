import express from 'express';
import { checkSession } from '../controllers/auth.controller.js';
const router = express.Router();

router.get('/check',checkSession);


export default router;
