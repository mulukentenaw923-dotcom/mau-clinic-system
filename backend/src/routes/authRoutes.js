import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { login, register } from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });

router.post('/register', authLimiter, requireAuth, requireRole('super_admin'), register);
router.post('/login', authLimiter, login);

export default router;
