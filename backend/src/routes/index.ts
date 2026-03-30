import { Router } from 'express';
import classifyRoutes from './classify.routes';
import artefactRoutes from './artefact.routes';
import contactRoutes from './contact.routes';
import authRoutes from './auth.routes';
import adminRoutes from './adminRoutes';

const router = Router();

/**
 * Mount all route modules
 */
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/classify', classifyRoutes);
router.use('/artefacts', artefactRoutes);
router.use('/heritage', artefactRoutes); // Heritage uses same endpoints
router.use('/contact', contactRoutes);

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Ūgwati Backend API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;