import { Router } from 'express';
import { submitFeedback, getFeedbackStats } from '../controllers/feedbackController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, submitFeedback);
router.get('/stats', authenticateToken, getFeedbackStats);

export default router;
