import { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAdminKPIs = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pendingOutings = await prisma.hostelOuting.count({
      where: { adminStatus: 'Pending Review' },
    });

    res.json({
      campusHeadcountTotal: 10262,
      studentsOnCampus: 9420,
      studentsOutOnPass: 842,
      pendingOutingReviews: pendingOutings,
      facultyPresentCount: 342,
      facultyTotalCount: 360,
      facultyAttendanceRate: 95.0,
      pendingFeeClearances: 18,
      activeTurnstiles: 14,
    });
  } catch (err: any) {
    console.error('Error fetching admin KPIs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAdminOutingRequests = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const outings = await prisma.hostelOuting.findMany({
      orderBy: { requestedAt: 'desc' },
    });
    res.json(outings);
  } catch (err: any) {
    console.error('Error fetching outing requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const reviewOutingRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { status } = req.body; // 'Approved' | 'Rejected'

    const updated = await prisma.hostelOuting.update({
      where: { id },
      data: {
        adminStatus: status,
        gatePassCode: status === 'Approved' ? `GP-${Math.floor(100000 + Math.random() * 900000)}` : null,
      },
    });

    res.json({ status: 'SUCCESS', message: `Outing request ${status}`, outing: updated });
  } catch (err: any) {
    console.error('Error reviewing outing request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const batchApproveOutings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (Array.isArray(ids) && ids.length > 0) {
      await prisma.hostelOuting.updateMany({
        where: { id: { in: ids } },
        data: { adminStatus: 'Approved' },
      });
    } else {
      await prisma.hostelOuting.updateMany({
        where: {
          adminStatus: 'Pending Review',
          parentConsentVerified: true,
          mentorApproved: true,
        },
        data: { adminStatus: 'Approved' },
      });
    }

    res.json({ status: 'SUCCESS', message: 'Batch approved verified outing passes' });
  } catch (err: any) {
    console.error('Error batch approving outings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGatePassSwipes = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const swipes = await prisma.gatePassSwipe.findMany({
      take: 20,
    });
    res.json(swipes);
  } catch (err: any) {
    console.error('Error fetching gate swipes:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmergencyCirculars = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const circulars = await prisma.emergencyCircular.findMany({
      where: { active: true },
    });
    res.json(circulars);
  } catch (err: any) {
    console.error('Error fetching circulars:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEmergencyBroadcast = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, tag, content, priority } = req.body;

    const circular = await prisma.emergencyCircular.create({
      data: {
        title,
        tag: tag || 'Urgent',
        content,
        priority: priority || 'high',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        issuedBy: req.user?.name || 'Office of the Registrar',
        active: true,
      },
    });

    res.json({ status: 'SUCCESS', message: 'Emergency broadcast dispatched to campus telemetry', circular });
  } catch (err: any) {
    console.error('Error creating circular:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserDirectory = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        school: true,
        program: true,
        semester: true,
        designation: true,
        department: true,
        campus: true,
      },
    });
    res.json(users);
  } catch (err: any) {
    console.error('Error fetching user directory:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
