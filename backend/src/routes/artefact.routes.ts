import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import artefactController from '../controllers/artefact.controller';
import multer from 'multer';

const router = Router();

// Multer configuration
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Validation rules
 */
const createArtefactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('era').trim().notEmpty().withMessage('Era is required'),
  body('materials').notEmpty().withMessage('Materials are required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

/**
 * Combined POST Route
 * 1. upload.array('images') parses the multipart form and files
 * 2. validate(...) checks the text fields
 * 3. create handles the database logic
 */
router.post(
  '/',
  upload.array('images', 5), 
  validate(createArtefactValidation),
  artefactController.create
);

// --- Other Routes ---

router.get('/stats', artefactController.getStats);
router.get('/', artefactController.getAll);
router.get('/:id', artefactController.getById);

export default router;