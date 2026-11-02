import { Router } from 'express';
import { createConsultation, createSickLeave, getSickLeaves, reviewSickLeave } from '../controllers/ehrController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(requireAuth);
router.post('/consultations', requireRole('doctor'), createConsultation);
router.get('/sick-leaves', requireRole('doctor', 'super_admin'), getSickLeaves);
router.post('/sick-leaves', requireRole('doctor'), createSickLeave);
router.patch('/sick-leaves/:id', requireRole('doctor', 'super_admin'), reviewSickLeave);

export default router;
