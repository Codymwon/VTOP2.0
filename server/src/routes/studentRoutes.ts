import { Router } from 'express';
import {
  getStudentProfile,
  getAcademicKPIs,
  getTodaySchedule,
  getAttendanceRecords,
  getAssignments,
  submitAssignment,
  getOutings,
  applyOuting,
  getMarksAndGrades,
  getPayments,
} from '../controllers/studentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Student routes (accessible with token, with fallback for demo)
router.get('/profile', authenticateToken, getStudentProfile);
router.get('/kpis', authenticateToken, getAcademicKPIs);
router.get('/schedule', authenticateToken, getTodaySchedule);
router.get('/attendance', authenticateToken, getAttendanceRecords);
router.get('/assignments', authenticateToken, getAssignments);
router.post('/assignments/submit', authenticateToken, submitAssignment);
router.get('/outings', authenticateToken, getOutings);
router.post('/outings/apply', authenticateToken, applyOuting);
router.get('/marks-grades', authenticateToken, getMarksAndGrades);
router.get('/payments', authenticateToken, getPayments);

export default router;
