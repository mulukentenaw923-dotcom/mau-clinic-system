import { Router } from 'express';
import { dispenseMedicine, getInventory, patchMedicine, postMedicine, removeMedicine } from '../controllers/inventoryController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole('super_admin', 'pharmacist'));
router.get('/', getInventory);
router.post('/', postMedicine);
router.patch('/:id', patchMedicine);
router.delete('/:id', removeMedicine);
router.post('/:id/dispense', requireRole('pharmacist'), dispenseMedicine);

export default router;
