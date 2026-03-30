import express from 'express';
import { getAdminStats } from '../controllers/adminController';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Only Admins can hit this route
router.get('/stats', authenticate, getAdminStats);

export default router;