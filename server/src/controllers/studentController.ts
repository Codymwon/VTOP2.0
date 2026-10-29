import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getStudentProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const profile = await prisma.studentProfile.findUnique({
      where: { studentId },
      include: { user: true },
    });

    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    const address = JSON.parse(profile.addressJson);
    const education = JSON.parse(profile.educationJson);

    res.json({
      name: profile.user.name,
      regNo: profile.studentId,
      applicationNo: profile.applicationNo,
      dob: profile.dob,
      gender: profile.gender,
      bloodGroup: profile.bloodGroup,
      nativeLanguage: profile.nativeLanguage,
      nativeState: profile.nativeState,
      degree: profile.degree,
      program: profile.user.program,
      school: profile.user.school,
      semester: profile.user.semester,
      admissionYear: profile.admissionYear,
      isHosteller: profile.isHosteller,
      hostelBlock: profile.hostelBlock,
      roomNo: profile.roomNo,
      address,
      education,
    });
  } catch (err: any) {
    console.error('Error fetching student profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAcademicKPIs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const kpis = await prisma.academicKPI.findUnique({
      where: { studentId },
    });

    if (!kpis) {
      res.status(404).json({ message: 'KPIs not found' });
      return;
    }

    res.json({
      overallAttendancePercentage: kpis.overallAttendancePercentage,
      totalAttendedClasses: kpis.totalAttendedClasses,
      totalConductedClasses: kpis.totalConductedClasses,
      debarSafetyStatus: kpis.debarSafetyStatus,
      cgpa: kpis.cgpa,
      totalEarnedCredits: kpis.totalEarnedCredits,
      currentSemesterCredits: kpis.currentSemesterCredits,
      enrolledSubjectsCount: kpis.enrolledSubjectsCount,
      enrolledComponentsCount: kpis.enrolledComponentsCount,
    });
  } catch (err: any) {
    console.error('Error fetching student KPIs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTodaySchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const slots = await prisma.timetableSlot.findMany({
      where: { userId: studentId },
    });

    res.json(slots);
  } catch (err: any) {
    console.error('Error fetching today schedule:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAttendanceRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
    });

    const records = await Promise.all(
      enrollments.map(async (e) => {
        const dayLogs = await prisma.attendanceDayLog.findMany({
          where: { studentId, courseCode: e.courseCode },
          orderBy: { slNo: 'asc' },
        });

        return {
          courseCode: e.courseCode,
          courseTitle: e.courseTitle,
          courseType: e.courseType,
          slot: e.slot,
          facultyName: e.facultyName,
          credits: e.credits,
          attendedClasses: e.attendedClasses,
          totalClasses: e.totalClasses,
          attendancePercentage: e.attendancePercentage,
          debarSafety: e.debarSafety,
          dayLogs: dayLogs.map((log) => ({
            slNo: log.slNo,
            date: log.date,
            slot: log.slot,
            dayTime: log.dayTime,
            status: log.status,
            remark: log.remark || undefined,
          })),
        };
      })
    );

    res.json(records);
  } catch (err: any) {
    console.error('Error fetching attendance records:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const assignments = await prisma.assignment.findMany({
      where: { studentId },
    });

    res.json(assignments);
  } catch (err: any) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const { assignmentId, fileName } = req.body;

    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        status: 'Submitted',
        submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        submissionFileName: fileName || 'Assignment_Submission.pdf',
      },
    });

    res.json({ status: 'SUCCESS', message: 'Assignment submitted successfully', assignment: updated });
  } catch (err: any) {
    console.error('Error submitting assignment:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOutings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const outings = await prisma.hostelOuting.findMany({
      where: { studentId },
      orderBy: { requestedAt: 'desc' },
    });

    res.json(outings);
  } catch (err: any) {
    console.error('Error fetching outings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const applyOuting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const user = await prisma.user.findUnique({ where: { id: studentId } });
    const profile = await prisma.studentProfile.findUnique({ where: { studentId } });

    const { outingType, placeOfVisit, fromDate, toDate, purpose, parentPhone } = req.body;

    const newOuting = await prisma.hostelOuting.create({
      data: {
        studentId,
        studentName: user?.name || 'Arjun K Sharma',
        gender: profile?.gender || 'Male',
        hostelBlock: profile?.hostelBlock || 'MH-1',
        roomNo: profile?.roomNo || '705B',
        outingType: outingType || 'Weekend Outing',
        placeOfVisit: placeOfVisit || 'Home Visit',
        fromDate,
        toDate,
        purpose: purpose || 'General visit',
        parentConsentVerified: true,
        parentPhone: parentPhone || '+91 98401 23456',
        mentorApproved: false,
        mentorName: 'Dr. Hussain Syed (EMP10245)',
        adminStatus: 'Pending Review',
        gatePassCode: `GP-${Math.floor(100000 + Math.random() * 900000)}`,
        requestedAt: new Date().toISOString(),
      },
    });

    res.json({ status: 'SUCCESS', message: 'Outing request submitted', outing: newOuting });
  } catch (err: any) {
    console.error('Error applying for outing:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMarksAndGrades = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const marks = await prisma.markItem.findMany({ where: { studentId } });
    const grades = await prisma.gradeHistory.findMany({ where: { studentId } });

    res.json({ marks, grades });
  } catch (err: any) {
    console.error('Error fetching marks and grades:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id || '23MIC7209';
    const payments = await prisma.paymentRecord.findMany({
      where: { studentId },
    });

    res.json(payments);
  } catch (err: any) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
