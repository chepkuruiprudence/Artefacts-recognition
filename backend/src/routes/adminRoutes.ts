import express from 'express';
import { getAdminStats, getReport, verifyArtefact } from '../controllers/adminController';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Only Admins can hit this route
router.get('/stats', authenticate, getAdminStats);

router.patch('/admin/verify/:id', verifyArtefact);

router.get('/admin/report', getReport);
export default router;