import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { createContactMessage, downloadCertificate, getPublicQueue, getPublicSummary } from '../controllers/publicController.js';

const router = Router();
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false });
const portalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });

router.post('/contact', contactLimiter, createContactMessage);
router.get('/queue', portalLimiter, getPublicQueue);
router.get('/summary', portalLimiter, getPublicSummary);
router.post('/certificates', portalLimiter, downloadCertificate);

export default router;