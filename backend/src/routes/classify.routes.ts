import { Router } from 'express';
import { upload } from '../middleware/upload.middleware';
import classifyController from '../controllers/classify.controller';

const router = Router();

/**
 * @route   POST /api/classify
 * @desc    Upload and classify an artefact image
 * @access  Public
 */
router.post('/', upload.single('image'), classifyController.classifyImage);

/**
 * @route   GET /api/classify/history
 * @desc    Get classification history
 * @access  Public
 */
router.get('/history', classifyController.getHistory);

export default router;