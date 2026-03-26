import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import artefactController from '../controllers/artefact.controller';

const router = Router();

/**
 * Validation rules for creating artefact
 */
const createArtefactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('era').trim().notEmpty().withMessage('Era is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

/**
 * @route   GET /api/artefacts/stats
 * @desc    Get artefact statistics
 * @access  Public
 */
router.get('/stats', artefactController.getStats);

/**
 * @route   GET /api/artefacts
 * @desc    Get all artefacts with filtering
 * @access  Public
 */
router.get('/', artefactController.getAll);

/**
 * @route   GET /api/artefacts/:id
 * @desc    Get single artefact by ID
 * @access  Public
 */
router.get('/:id', artefactController.getById);

/**
 * @route   POST /api/artefacts
 * @desc    Create new artefact (contribution)
 * @access  Public (should be protected in production)
 */
router.post(
  '/',
  validate(createArtefactValidation),
  artefactController.create
);

export default router;