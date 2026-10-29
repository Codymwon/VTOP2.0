import { Router } from 'express';
import {
  getAdminKPIs,
  getAdminOutingRequests,
  reviewOutingRequest,
  batchApproveOutings,
  getGatePassSwipes,
  getEmergencyCirculars,
  createEmergencyBroadcast,
  getUserDirectory,
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/kpis', authenticateToken, getAdminKPIs);
router.get('/outings', authenticateToken, getAdminOutingRequests);
router.patch('/outings/:id', authenticateToken, reviewOutingRequest);
router.post('/outings/batch-approve', authenticateToken, batchApproveOutings);
router.get('/turnstiles', authenticateToken, getGatePassSwipes);
router.get('/circulars', authenticateToken, getEmergencyCirculars);
router.post('/circulars', authenticateToken, createEmergencyBroadcast);
router.get('/users', authenticateToken, getUserDirectory);

export default router;
