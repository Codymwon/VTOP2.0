import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { config } from '../config.js';
import { AuthRequest } from '../middleware/auth.js';
import {
  sendOtpEmail,
  sendOtpSms,
  maskDestination,
} from '../services/notificationService.js';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean phone number for comparison (removes spaces, dashes, parentheses)
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role, deliveryMethod, targetEmail, targetPhone } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username/ID and password are required' });
      return;
    }

    const cleanInput = String(username).trim();
    const cleanUsername = cleanInput.toUpperCase();
    const cleanEmail = cleanInput.toLowerCase();

    // 1. Find user by ID, username, email, or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { id: cleanUsername },
          { email: cleanEmail },
          { phone: cleanInput },
        ],
      },
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid Registration/Employee ID or Password.' });
      return;
    }

    // Role check if provided
    if (role && user.role !== role) {
      res.status(401).json({ message: `Account exists but does not have the '${role}' role.` });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid Registration/Employee ID or Password.' });
      return;
    }

    // 2. Determine and validate OTP destination & channel
    let channel: 'EMAIL' | 'SMS' = (deliveryMethod === 'sms' || targetPhone) ? 'SMS' : 'EMAIL';
    let destination: string = '';

    if (channel === 'EMAIL') {
      const enteredEmail = targetEmail ? String(targetEmail).trim().toLowerCase() : user.email.toLowerCase();

      // Enforce institutional domain constraint for Student vs Faculty
      if (user.role === 'student') {
        if (!enteredEmail.endsWith('@vitapstudent.ac.in')) {
          res.status(400).json({
            message: 'Student email must end with @vitapstudent.ac.in (e.g. anything@vitapstudent.ac.in)',
          });
          return;
        }
      } else if (user.role === 'faculty') {
        if (!enteredEmail.endsWith('@vitap.ac.in')) {
          res.status(400).json({
            message: 'Faculty email must end with @vitap.ac.in (e.g. anything@vitap.ac.in)',
          });
          return;
        }
      }

      // Send OTP to this entered email, even if not pre-stored in the database!
      destination = enteredEmail;
    } else {
      // SMS channel: Send OTP to the mobile number
      const phoneToUse = targetPhone ? String(targetPhone).trim() : (user.phone || '');
      const digitsOnly = phoneToUse.replace(/\D/g, '');

      if (!digitsOnly || digitsOnly.length < 10) {
        res.status(400).json({
          message: 'Please enter a valid 10-digit mobile phone number to receive the SMS OTP.',
        });
        return;
      }

      destination = phoneToUse;
    }

    // 3. Generate 6-digit 2FA OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

    // Save OTP session with channel and destination
    const otpSession = await prisma.otpSession.create({
      data: {
        userId: user.id,
        otpCode: otp,
        otpChannel: channel,
        otpDestination: destination,
        expiresAt,
        attemptsRemaining: 4,
        isVerified: false,
      },
    });

    // 4. Dispatch OTP via chosen channel
    if (channel === 'EMAIL') {
      await sendOtpEmail(destination, otp, user.name);
    } else {
      await sendOtpSms(destination, otp, user.name);
    }

    const masked = maskDestination(destination, channel);

    res.json({
      requiresOtp: true,
      channel,
      message: channel === 'EMAIL'
        ? `Two-factor OTP dispatched to registered institutional email (${masked}).`
        : `Two-factor OTP sent via SMS to registered mobile number (${masked}).`,
      maskedEmail: masked,
      destinationMasked: masked,
      cooldownSeconds: config.otpCooldownSeconds,
      otpSessionId: otpSession.id,
      devOtpHint: otp,
    });
  } catch (err: any) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const validateSecurityOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otpCode, otpSessionId } = req.body;

    if (!otpCode) {
      res.status(400).json({ message: 'OTP code is required' });
      return;
    }

    let otpSession;
    if (otpSessionId) {
      otpSession = await prisma.otpSession.findUnique({
        where: { id: otpSessionId },
        include: { user: true },
      });
    } else {
      otpSession = await prisma.otpSession.findFirst({
        where: { isVerified: false },
        orderBy: { lastResentAt: 'desc' },
        include: { user: true },
      });
    }

    if (!otpSession) {
      res.status(400).json({
        status: 'ERROR',
        message: 'No pending OTP verification session found. Please log in again.',
      });
      return;
    }

    if (new Date() > otpSession.expiresAt) {
      res.status(400).json({
        status: 'EXPIRED',
        message: 'Security OTP has expired. Please resend.',
      });
      return;
    }

    if (otpSession.attemptsRemaining <= 0) {
      res.status(403).json({
        status: 'MAX_ATTEMPTS_EXCEEDED',
        message: 'Maximum OTP attempts exceeded. Please login again.',
      });
      return;
    }

    // Accept real OTP or dev override 123456
    const isCorrect = (otpCode === otpSession.otpCode) || (otpCode === '123456');

    if (!isCorrect) {
      const updated = await prisma.otpSession.update({
        where: { id: otpSession.id },
        data: { attemptsRemaining: otpSession.attemptsRemaining - 1 },
      });

      res.status(400).json({
        status: 'INVALID',
        message: 'Incorrect security OTP.',
        attemptsRemaining: updated.attemptsRemaining,
      });
      return;
    }

    // Mark as verified
    await prisma.otpSession.update({
      where: { id: otpSession.id },
      data: { isVerified: true },
    });

    const user = otpSession.user;

    const tokenPayload = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '12h' });

    const session = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || undefined,
        role: user.role,
        school: user.school || undefined,
        program: user.program || undefined,
        semester: user.semester || undefined,
        designation: user.designation || undefined,
        department: user.department || undefined,
        campus: user.campus,
        avatarUrl: user.avatarUrl || undefined,
      },
      authenticatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    };

    res.json({
      status: 'SUCCESS',
      message: 'OTP verified successfully.',
      session,
    });
  } catch (err: any) {
    console.error('Error validating OTP:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resendSecurityOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otpSessionId } = req.body;

    let otpSession;
    if (otpSessionId) {
      otpSession = await prisma.otpSession.findUnique({
        where: { id: otpSessionId },
        include: { user: true },
      });
    } else {
      otpSession = await prisma.otpSession.findFirst({
        where: { isVerified: false },
        orderBy: { lastResentAt: 'desc' },
        include: { user: true },
      });
    }

    if (!otpSession) {
      res.status(400).json({
        status: 'ERROR',
        message: 'No active authentication session found.',
        cooldownSeconds: 0,
      });
      return;
    }

    const elapsedSeconds = (Date.now() - new Date(otpSession.lastResentAt).getTime()) / 1000;
    if (elapsedSeconds < config.otpCooldownSeconds) {
      res.status(429).json({
        status: 'COOLDOWN_ACTIVE',
        message: `Please wait ${Math.ceil(config.otpCooldownSeconds - elapsedSeconds)}s before requesting a new OTP.`,
        cooldownSeconds: Math.ceil(config.otpCooldownSeconds - elapsedSeconds),
      });
      return;
    }

    const newOtp = generateOtp();
    const newExpiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

    await prisma.otpSession.update({
      where: { id: otpSession.id },
      data: {
        otpCode: newOtp,
        expiresAt: newExpiresAt,
        attemptsRemaining: 4,
        lastResentAt: new Date(),
      },
    });

    const targetDest = otpSession.otpDestination || otpSession.user.email;
    const channel = (otpSession.otpChannel as 'EMAIL' | 'SMS') || 'EMAIL';

    if (channel === 'EMAIL') {
      await sendOtpEmail(targetDest, newOtp, otpSession.user.name);
    } else {
      await sendOtpSms(targetDest, newOtp, otpSession.user.name);
    }

    const masked = maskDestination(targetDest, channel);

    res.json({
      status: 'SUCCESS',
      message: `A fresh security OTP has been dispatched to ${masked}.`,
      cooldownSeconds: config.otpCooldownSeconds,
      devOtpHint: newOtp,
    });
  } catch (err: any) {
    console.error('Error resending OTP:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({ status: 'SUCCESS', message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      school: user.school,
      program: user.program,
      semester: user.semester,
      designation: user.designation,
      department: user.department,
      campus: user.campus,
      avatarUrl: user.avatarUrl,
    });
  } catch (err: any) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
