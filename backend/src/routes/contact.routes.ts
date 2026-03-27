import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import contactController from '../controllers/contact.controller';

const router = Router();

/**
 * Validation rules for contact form
 */
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters'),
];

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
// ✅ Correct code in contact.routes.ts
router.post(
  '/', 
  contactValidation, // Runs the rules you defined above
  validate,          // Your middleware that checks if validation failed
  contactController.submit // The actual controller logic that saves to DB
);

/**
 * @route   GET /api/contact
 * @desc    Get all contacts (admin only)
 * @access  Private/Admin
 */
router.get('/', contactController.getAll);

/**
 * @route   PATCH /api/contact/:id
 * @desc    Update contact status (admin only)
 * @access  Private/Admin
 */
router.patch('/:id', contactController.updateStatus);

export default router;