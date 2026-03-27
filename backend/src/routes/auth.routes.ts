import { Router } from 'express';
import { register, verifyEmail, login } from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post('/register', register);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify user email via token
 */
router.get('/verify', verifyEmail);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 */
router.post('/login', login);

export default router;