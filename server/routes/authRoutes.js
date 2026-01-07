import express from 'express';
import { googleLogin, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Google OAuth
router.post('/google', googleLogin);
router.get('/me', protect, getCurrentUser);

export default router;
