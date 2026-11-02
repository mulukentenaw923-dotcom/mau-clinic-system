import { Router } from 'express';
import { getPatientQueue, getPatients, postPatient, updateTriage } from '../controllers/patientController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(requireAuth);
router.get('/queue', requireRole('receptionist', 'triage_nurse', 'doctor'), getPatientQueue);
router.patch('/queue/:id/triage', requireRole('triage_nurse'), updateTriage);
router.get('/', requireRole('receptionist', 'triage_nurse', 'doctor'), getPatients);
router.post('/', requireRole('super_admin', 'receptionist'), postPatient);

export default router;
