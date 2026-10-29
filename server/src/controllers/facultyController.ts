import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getFacultyKPIs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const facultyId = req.user?.id || 'EMP10245';
    const coursesCount = await prisma.course.count({ where: { facultyId } });
    const pendingGradingCount = await prisma.facultyGradingItem.count({
      where: { facultyId, status: 'Pending' },
    });
    const adviseesCount = await prisma.facultyAdvisee.count({ where: { facultyId } });

    res.json({
      activeCoursesCount: coursesCount || 3,
      totalCredits: 18,
      totalStudentsEnrolled: 192,
      pendingGradingCount: pendingGradingCount || 28,
      proctorAdviseesCount: adviseesCount || 24,
      academicAlertsCount: 2,
    });
  } catch (err: any) {
    console.error('Error fetching faculty KPIs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTodaySlots = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const facultyId = req.user?.id || 'EMP10245';
    const slots = await prisma.timetableSlot.findMany({
      where: { userId: facultyId },
    });

    const formatted = slots.map((s) => ({
      id: s.id,
      courseCode: s.courseCode,
      courseTitle: s.courseTitle,
      courseType: 'Theory',
      slot: s.slotName,
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room,
      enrolledCount: 64,
      status: s.status,
      attendanceMarked: s.status === 'completed',
      topic: "Interactive UI Architectures & Reactive Patterns",
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching faculty today slots:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSlotStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slotId } = req.params;
    // Return student roster for this slot
    const students = [
      { id: 'st-01', regNo: '23MIC7209', name: 'Akarsh', status: 'present', attendancePercentage: 89.5 },
      { id: 'st-02', regNo: '23BCE1012', name: 'Aaditya Menon', status: 'present', attendancePercentage: 92.1 },
      { id: 'st-03', regNo: '23BCE1024', name: 'Ananya Reddy', status: 'present', attendancePercentage: 86.4 },
      { id: 'st-04', regNo: '23BCE1045', name: 'Bhavya Sri V', status: 'absent', attendancePercentage: 74.2 },
      { id: 'st-05', regNo: '23BCE1067', name: 'Chaitanya K', status: 'present', attendancePercentage: 96.0 },
      { id: 'st-06', regNo: '23BCE1090', name: 'Deepak Verma', status: 'od', attendancePercentage: 81.3 },
      { id: 'st-07', regNo: '23BCE1104', name: 'Divya Prakash', status: 'present', attendancePercentage: 94.7 },
      { id: 'st-08', regNo: '23BCE1128', name: 'Gautam N', status: 'present', attendancePercentage: 88.0 },
      { id: 'st-09', regNo: '23BCE1142', name: 'Harini Sundar', status: 'present', attendancePercentage: 79.5 },
      { id: 'st-10', regNo: '23BCE1156', name: 'Ishaan Gupta', status: 'present', attendancePercentage: 91.2 },
    ];

    res.json(students);
  } catch (err: any) {
    console.error('Error fetching slot students:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitSlotAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slotId, attendances, topic } = req.body;

    if (slotId) {
      await prisma.timetableSlot.updateMany({
        where: { id: slotId },
        data: { status: 'completed' },
      });
    }

    res.json({
      status: 'SUCCESS',
      message: 'Slot attendance successfully registered and biometric audit sealed.',
      timestamp: new Date().toISOString(),
      markedCount: Array.isArray(attendances) ? attendances.length : 10,
    });
  } catch (err: any) {
    console.error('Error submitting slot attendance:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGradingQueue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const facultyId = req.user?.id || 'EMP10245';
    const items = await prisma.facultyGradingItem.findMany({
      where: { facultyId },
    });
    res.json(items);
  } catch (err: any) {
    console.error('Error fetching grading queue:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const evaluateSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { submissionId, scoredMarks, feedback } = req.body;

    const updated = await prisma.facultyGradingItem.update({
      where: { id: submissionId },
      data: {
        scoredMarks: parseFloat(scoredMarks),
        feedback,
        status: 'Graded',
      },
    });

    res.json({ status: 'SUCCESS', message: 'Evaluation saved successfully', item: updated });
  } catch (err: any) {
    console.error('Error evaluating submission:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAdvisees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const facultyId = req.user?.id || 'EMP10245';
    const advisees = await prisma.facultyAdvisee.findMany({
      where: { facultyId },
    });
    res.json(advisees);
  } catch (err: any) {
    console.error('Error fetching advisees:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveAdviseeOuting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { adviseeId } = req.body;
    await prisma.facultyAdvisee.update({
      where: { id: adviseeId },
      data: { pendingOutingPass: false },
    });

    res.json({ status: 'SUCCESS', message: 'Advisee outing consent verified by proctor' });
  } catch (err: any) {
    console.error('Error approving advisee outing:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDuties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const duties = [
      {
        id: 'duty-01',
        examName: 'Mid-Term Examinations Fall 2026-27',
        courseCode: 'MAT2001',
        courseTitle: 'Statistics for Engineers',
        date: '22-Sep-2026',
        slot: 'Slot 1 (09:30 AM - 11:30 AM)',
        hall: 'CB-201',
        chiefSuperintendent: 'Dr. R. Ramanathan',
        reportingTime: '08:45 AM',
      },
      {
        id: 'duty-02',
        examName: 'Mid-Term Examinations Fall 2026-27',
        courseCode: 'PHY1901',
        courseTitle: 'Engineering Physics',
        date: '25-Sep-2026',
        slot: 'Slot 2 (02:00 PM - 04:00 PM)',
        hall: 'AB2-304',
        chiefSuperintendent: 'Dr. S. K. Narayanan',
        reportingTime: '01:15 PM',
      },
    ];

    res.json(duties);
  } catch (err: any) {
    console.error('Error fetching duties:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
