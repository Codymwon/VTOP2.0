import { Router } from 'express';
import {
  getFacultyKPIs,
  getTodaySlots,
  getSlotStudents,
  submitSlotAttendance,
  getGradingQueue,
  evaluateSubmission,
  getAdvisees,
  approveAdviseeOuting,
  getDuties,
} from '../controllers/facultyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/kpis', authenticateToken, getFacultyKPIs);
router.get('/slots/today', authenticateToken, getTodaySlots);
router.get('/slots/:slotId/students', authenticateToken, getSlotStudents);
router.post('/slots/attendance', authenticateToken, submitSlotAttendance);
router.get('/grading', authenticateToken, getGradingQueue);
router.post('/grading/evaluate', authenticateToken, evaluateSubmission);
router.get('/advisees', authenticateToken, getAdvisees);
router.post('/advisees/approve-outing', authenticateToken, approveAdviseeOuting);
router.get('/duties', authenticateToken, getDuties);

export default router;
