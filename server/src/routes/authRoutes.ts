import { Router } from 'express';
import {
  login,
  validateSecurityOtp,
  resendSecurityOtp,
  logout,
  getMe,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Endpoints matching existing liveAuthService conventions:
// /api/vtop/login, /api/vtop/validateSecurityOtp, etc.
router.post('/login', login);
router.post('/validateSecurityOtp', validateSecurityOtp);
router.post('/resendSecurityOtp', resendSecurityOtp);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);

export default router;
