import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with updated student 23MIC7209...');

  // Clean existing tables
  await prisma.otpSession.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.academicKPI.deleteMany();
  await prisma.timetableSlot.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.attendanceDayLog.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.markItem.deleteMany();
  await prisma.gradeHistory.deleteMany();
  await prisma.hostelOuting.deleteMany();
  await prisma.paymentRecord.deleteMany();
  await prisma.emergencyCircular.deleteMany();
  await prisma.gatePassSwipe.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.facultyAdvisee.deleteMany();
  await prisma.facultyGradingItem.deleteMany();
  await prisma.facultyDutyLeave.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  // Student: Akarsh (23MIC7209)
  const student = await prisma.user.create({
    data: {
      id: '23MIC7209',
      username: '23MIC7209',
      passwordHash,
      name: 'AKARSH',
      email: 'akarsh.23mic7209@vitapstudent.ac.in',
      phone: '+91 98401 23456',
      role: 'student',
      school: 'School of Computer Science & Engineering (SCOPE)',
      program: 'Integrated M.Tech - Computer Science and Engineering',
      semester: 'Fall Semester 2026-27',
      campus: 'VIT-AP University, Amaravati',
      profile: {
        create: {
          applicationNo: '2023720911',
          dob: '18-Aug-2005',
          gender: 'MALE',
          bloodGroup: 'O+',
          nativeLanguage: 'TELUGU',
          nativeState: 'ANDHRA PRADESH',
          degree: 'INTEGRATED POSTGRADUATE',
          admissionYear: 2023,
          isHosteller: true,
          hostelBlock: 'MH-1',
          roomNo: '705B',
          addressJson: JSON.stringify({
            street: 'Flat 402, Sri Sai Residency, Madhapur',
            area: 'HITEC City',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500081',
            country: 'INDIA',
          }),
          educationJson: JSON.stringify({
            schoolName: 'DELHI PUBLIC SCHOOL',
            board: 'CENTRAL BOARD OF SECONDARY EDUCATION (CBSE)',
            qualification: '12TH / SENIOR SECONDARY (SCIENCE)',
            percentage: '95.4%',
            yearOfPassing: '2023',
          }),
        },
      },
    },
  });

  // Faculty
  const faculty = await prisma.user.create({
    data: {
      id: 'EMP10245',
      username: 'EMP10245',
      passwordHash,
      name: 'Dr. Hussain Syed',
      email: 'hussain.syed@vitap.ac.in',
      phone: '+91 94432 10987',
      role: 'faculty',
      designation: 'Professor & Head of UI/UX Research Lab',
      department: 'Department of Software and Systems Engineering',
      school: 'School of Computer Science and Engineering (SCOPE)',
      campus: 'VIT-AP University, Amaravati',
    },
  });

  // Admin
  const admin = await prisma.user.create({
    data: {
      id: 'ADM1001',
      username: 'ADM1001',
      passwordHash,
      name: 'Dr. S. K. Narayanan',
      email: 'sk.narayanan@vitap.ac.in',
      phone: '+91 98765 43210',
      role: 'admin',
      designation: 'Chief Administrative Officer & Registrar',
      department: 'Office of Academic Administration & Security Operations',
      campus: 'VIT-AP University, Amaravati',
    },
  });

  console.log('✅ Users seeded: Student (23MIC7209), Faculty (EMP10245), Admin (ADM1001)');

  // 2. Student Academic KPIs
  await prisma.academicKPI.create({
    data: {
      studentId: student.id,
      overallAttendancePercentage: 89.5,
      totalAttendedClasses: 129,
      totalConductedClasses: 143,
      debarSafetyStatus: 'safe',
      cgpa: 8.38,
      totalEarnedCredits: 134.0,
      currentSemesterCredits: 21.0,
      enrolledSubjectsCount: 6,
      enrolledComponentsCount: 8,
    },
  });

  // 3. Courses
  await prisma.course.createMany({
    data: [
      {
        code: 'CSE4012',
        title: 'Human-Computer Interaction',
        courseType: 'Embedded Theory',
        credits: 4.0,
        slot: 'C1+TC1',
        room: 'CB-402',
        facultyId: faculty.id,
        facultyName: 'Dr. Hussain Syed',
      },
      {
        code: 'CSE3002',
        title: 'Internet & Web Programming',
        courseType: 'Theory',
        credits: 3.0,
        slot: 'E2+TE2',
        room: 'AB1-204',
        facultyId: faculty.id,
        facultyName: 'Dr. Hussain Syed',
      },
      {
        code: 'CSE3001',
        title: 'Database Management Systems',
        courseType: 'Embedded Theory',
        credits: 4.0,
        slot: 'A1+TA1',
        room: 'CB-301',
        facultyName: 'Dr. S. R. Balaji',
      },
    ],
  });

  // 4. Student Timetable Slots
  await prisma.timetableSlot.createMany({
    data: [
      {
        userId: student.id,
        dayOfWeek: 'Monday',
        courseCode: 'CSE4012',
        courseTitle: 'Human-Computer Interaction',
        slotName: 'C1',
        startTime: '10:00 AM',
        endTime: '10:50 AM',
        room: 'CB-402',
        status: 'ongoing',
      },
      {
        userId: student.id,
        dayOfWeek: 'Monday',
        courseCode: 'CSE3002',
        courseTitle: 'Internet & Web Programming',
        slotName: 'E2',
        startTime: '11:40 AM',
        endTime: '12:30 PM',
        room: 'AB1-204',
        status: 'upcoming',
      },
      {
        userId: student.id,
        dayOfWeek: 'Monday',
        courseCode: 'CSE3001',
        courseTitle: 'Database Management Systems',
        slotName: 'A1',
        startTime: '08:30 AM',
        endTime: '09:20 AM',
        room: 'CB-301',
        status: 'completed',
      },
      // Faculty timetable slots
      {
        userId: faculty.id,
        dayOfWeek: 'Monday',
        courseCode: 'CSE4012',
        courseTitle: 'Human-Computer Interaction',
        slotName: 'C1+TC1',
        startTime: '10:00 AM',
        endTime: '10:50 AM',
        room: 'CB-402',
        status: 'ongoing',
      },
      {
        userId: faculty.id,
        dayOfWeek: 'Monday',
        courseCode: 'CSE3002',
        courseTitle: 'Internet & Web Programming',
        slotName: 'E2+TE2',
        startTime: '11:40 AM',
        endTime: '12:30 PM',
        room: 'AB1-204',
        status: 'upcoming',
      },
    ],
  });

  // 5. Enrollments & Attendance Records
  await prisma.enrollment.createMany({
    data: [
      {
        studentId: student.id,
        courseCode: 'CSE4012',
        courseTitle: 'Human-Computer Interaction',
        courseType: 'Embedded Theory',
        credits: 4.0,
        slot: 'C1+TC1',
        facultyName: 'Dr. Hussain Syed',
        attendedClasses: 28,
        totalClasses: 31,
        attendancePercentage: 90.3,
        debarSafety: 'safe',
      },
      {
        studentId: student.id,
        courseCode: 'CSE3002',
        courseTitle: 'Internet & Web Programming',
        courseType: 'Theory',
        credits: 3.0,
        slot: 'E2+TE2',
        facultyName: 'Dr. Hussain Syed',
        attendedClasses: 25,
        totalClasses: 28,
        attendancePercentage: 89.2,
        debarSafety: 'safe',
      },
      {
        studentId: student.id,
        courseCode: 'CSE3001',
        courseTitle: 'Database Management Systems',
        courseType: 'Embedded Theory',
        credits: 4.0,
        slot: 'A1+TA1',
        facultyName: 'Dr. S. R. Balaji',
        attendedClasses: 22,
        totalClasses: 29,
        attendancePercentage: 75.8,
        debarSafety: 'warning',
      },
    ],
  });

  // 6. Attendance Day Logs for CSE4012
  await prisma.attendanceDayLog.createMany({
    data: [
      { studentId: student.id, courseCode: 'CSE4012', slNo: 1, date: '08-Sep-2026', slot: 'TC2', dayTime: 'TUE / 17:00-17:50', status: 'Present' },
      { studentId: student.id, courseCode: 'CSE4012', slNo: 2, date: '04-Sep-2026', slot: 'C2', dayTime: 'FRI / 14:00-14:50', status: 'Absent', remark: 'No biometric punch recorded' },
      { studentId: student.id, courseCode: 'CSE4012', slNo: 3, date: '03-Sep-2026', slot: 'C2', dayTime: 'THU / 15:00-15:50', status: 'Present' },
      { studentId: student.id, courseCode: 'CSE4012', slNo: 4, date: '01-Sep-2026', slot: 'TC2', dayTime: 'TUE / 17:00-17:50', status: 'Present' },
    ],
  });

  // 7. Assignments
  await prisma.assignment.createMany({
    data: [
      {
        studentId: student.id,
        courseCode: 'CSE4012',
        courseTitle: 'Human-Computer Interaction',
        title: 'DA 1: Heuristic Evaluation & Redesign of VTOP Navigation',
        description: 'Complete Nielsen Norman heuristic evaluation with annotated wireframes.',
        dueDate: '15-Oct-2026',
        status: 'Pending',
        maxMarks: 100,
      },
      {
        studentId: student.id,
        courseCode: 'CSE3002',
        courseTitle: 'Internet & Web Programming',
        title: 'DA 2: Full-Stack Real-time Collaborative Board',
        description: 'Develop a responsive canvas app using WebSockets and TypeScript.',
        dueDate: '20-Oct-2026',
        status: 'Submitted',
        submissionDate: '10-Oct-2026',
        submissionFileName: '23MIC7209_DA2_WebSockets.zip',
        maxMarks: 100,
        scoredMarks: 94,
        facultyRemarks: 'Exceptional socket reconnection handling and clean state synchronization.',
      },
    ],
  });

  // 8. Marks and Grades
  await prisma.markItem.createMany({
    data: [
      {
        studentId: student.id,
        courseCode: 'CSE4012',
        courseTitle: 'Human-Computer Interaction',
        assessmentType: 'CAT-1',
        maxMarks: 50,
        weightage: 15,
        scoredMarks: 46.5,
        classAverage: 37.8,
      },
      {
        studentId: student.id,
        courseCode: 'CSE3002',
        courseTitle: 'Internet & Web Programming',
        assessmentType: 'CAT-1',
        maxMarks: 50,
        weightage: 15,
        scoredMarks: 48.0,
        classAverage: 39.2,
      },
    ],
  });

  await prisma.gradeHistory.createMany({
    data: [
      {
        studentId: student.id,
        courseCode: 'MAT1001',
        courseTitle: 'Calculus and Linear Algebra',
        credits: 4.0,
        grade: 'S',
        semester: 'Winter Semester 2025-26',
        examMonthYear: 'May 2026',
      },
      {
        studentId: student.id,
        courseCode: 'CSE1002',
        courseTitle: 'Problem Solving and Object Oriented Programming',
        credits: 4.0,
        grade: 'A',
        semester: 'Winter Semester 2025-26',
        examMonthYear: 'May 2026',
      },
    ],
  });

  // 9. Hostel Outings
  await prisma.hostelOuting.createMany({
    data: [
      {
        studentId: student.id,
        studentName: 'Akarsh',
        gender: 'Male',
        hostelBlock: 'MH-1',
        roomNo: '705B',
        outingType: 'Weekend Outing',
        placeOfVisit: 'Hyderabad (Home Visit)',
        fromDate: '2026-10-31 04:00 PM',
        toDate: '2026-11-02 08:00 PM',
        purpose: 'Family celebration and holidays',
        parentConsentVerified: true,
        parentPhone: '+91 98401 23456',
        mentorApproved: true,
        mentorName: 'Dr. Hussain Syed (EMP10245)',
        adminStatus: 'Pending Review',
        gatePassCode: 'GP-881920',
        requestedAt: '2026-10-28 09:30 AM',
      },
      {
        studentId: '23BCE1402',
        studentName: 'Priya Murugan',
        gender: 'Female',
        hostelBlock: 'LH-1',
        roomNo: 'LH-102',
        outingType: 'General Leave',
        placeOfVisit: 'Guntur City',
        fromDate: '2026-10-30 02:00 PM',
        toDate: '2026-10-30 08:30 PM',
        purpose: 'Medical appointment at Apollo Clinic Guntur',
        parentConsentVerified: true,
        parentPhone: '+91 97890 23411',
        mentorApproved: true,
        mentorName: 'Dr. Meenakshi S (EMP10118)',
        adminStatus: 'Pending Review',
        gatePassCode: 'GP-882104',
        requestedAt: '2026-10-28 10:15 AM',
      },
    ],
  });

  // 10. Payment Records
  await prisma.paymentRecord.createMany({
    data: [
      {
        studentId: student.id,
        refNo: 'PAY-2026-FALL-001',
        feeType: 'Tuition & Academic Facilities Fee',
        semester: 'Fall Semester 2026-27',
        amount: 145000,
        paymentDate: '12-Jul-2026',
        paymentMode: 'Net Banking (SBI)',
        status: 'Paid',
        receiptNumber: 'RCP-VITAP-98124',
      },
      {
        studentId: student.id,
        refNo: 'PAY-2026-FALL-002',
        feeType: 'Hostel & Mess Charges (MH-1 Special 2-Bed AC)',
        semester: 'Fall Semester 2026-27',
        amount: 82500,
        paymentDate: '14-Jul-2026',
        paymentMode: 'UPI Auto-Debit',
        status: 'Paid',
        receiptNumber: 'RCP-VITAP-98319',
      },
    ],
  });

  // 11. Emergency Circulars & Spotlight
  await prisma.emergencyCircular.createMany({
    data: [
      {
        title: 'Severe Weather Warning: Pre-Monsoon Heavy Rainfall Alert',
        tag: 'Urgent',
        date: '29-Oct-2026',
        content: 'Amaravati IMD has forecasted intense localized showers with winds exceeding 45km/h. All evening outdoor sports and open-ground gatherings stand suspended.',
        priority: 'high',
        issuedBy: 'Office of the Registrar & Campus Safety Division',
        active: true,
      },
      {
        title: 'Mid-Term Examinations Timetable Release & Seating Portal',
        tag: 'Academic',
        date: '28-Oct-2026',
        content: 'Fall Semester 2026-27 Mid-Term seating matrices and hall tickets are now active on VTOP. Please review your slots and venues.',
        priority: 'normal',
        issuedBy: 'Controller of Examinations',
        active: true,
      },
    ],
  });

  // 12. Biometric Gate Swipes
  await prisma.gatePassSwipe.createMany({
    data: [
      {
        studentRegNo: '23MIC7209',
        studentName: 'Akarsh',
        hostelBlock: 'MH-1',
        swipeTime: '29-Oct-2026 05:42 PM',
        gateName: 'Turnstile T-03 (Main University Gate)',
        direction: 'IN',
        status: 'Authorized',
        passId: 'GP-772910',
      },
      {
        studentRegNo: '23BCE1402',
        studentName: 'Priya Murugan',
        hostelBlock: 'LH-1',
        swipeTime: '29-Oct-2026 05:35 PM',
        gateName: 'Turnstile T-01 (Hostel Gate B)',
        direction: 'IN',
        status: 'Authorized',
        passId: 'GP-882104',
      },
    ],
  });

  // 13. Faculty Advisees
  await prisma.facultyAdvisee.createMany({
    data: [
      {
        facultyId: faculty.id,
        studentRegNo: student.id,
        studentName: 'Akarsh',
        program: 'Int. M.Tech CSE (4th Sem)',
        cgpa: 8.38,
        attendancePercentage: 89.5,
        pendingOutingPass: true,
        outingDetails: 'Hyderabad (Home Visit) - Diwali',
      },
      {
        facultyId: faculty.id,
        studentRegNo: '23BCE1156',
        studentName: 'Ishaan Gupta',
        program: 'B.Tech CSE (4th Sem)',
        cgpa: 9.42,
        attendancePercentage: 91.2,
        pendingOutingPass: false,
      },
    ],
  });

  // 14. Faculty Grading Items
  await prisma.facultyGradingItem.createMany({
    data: [
      {
        facultyId: faculty.id,
        courseCode: 'CSE4012',
        courseTitle: 'Human-Computer Interaction',
        assignmentTitle: 'DA 1: Nielsen Heuristic Evaluation',
        studentRegNo: '23MIC7209',
        studentName: 'Akarsh',
        submittedAt: '28-Oct-2026 11:20 PM',
        maxMarks: 100,
        status: 'Pending',
      },
      {
        facultyId: faculty.id,
        courseCode: 'CSE4012',
        courseTitle: 'Human-Computer Interaction',
        assignmentTitle: 'DA 1: Nielsen Heuristic Evaluation',
        studentRegNo: '23BCE1012',
        studentName: 'Aaditya Menon',
        submittedAt: '28-Oct-2026 09:40 PM',
        maxMarks: 100,
        status: 'Pending',
      },
    ],
  });

  console.log('🎉 Database seeding completed successfully with 23MIC7209!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
