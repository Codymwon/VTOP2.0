import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Parse CLI arguments (--role student --id 23BCE9999 --name "Rahul" --email ... --phone ...)
function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : 'true';
      result[key] = value;
      if (value !== 'true') i++;
    }
  }

  return result;
}

async function main() {
  const args = parseArgs();

  const role = (args.role || 'student').toLowerCase();
  const id = (args.id || '').toUpperCase();
  const name = args.name || '';
  const email = (args.email || '').toLowerCase();
  const phone = args.phone || '+91 98401 23456';
  const password = args.password || 'password123';

  if (!id || !name || !email) {
    console.log(`
========================================================================
➕ VTOP 2.0 - Add New User Utility
========================================================================

Usage:
  npm --prefix server run user:add -- --role <student|faculty|admin> --id <ID> --name "<Name>" --email <Email> [--phone <Phone>] [--password <Password>]

Examples:
  1. Add a Student:
     npm --prefix server run user:add -- --role student --id 24BCE1001 --name "Karthik Verma" --email karthik.24bce1001@vitapstudent.ac.in --phone "+91 98765 01234"

  2. Add a Faculty:
     npm --prefix server run user:add -- --role faculty --id EMP20400 --name "Dr. Ananya Roy" --email ananya.roy@vitap.ac.in --phone "+91 94444 55555"
========================================================================
`);
    process.exit(1);
  }

  // Domain verification rule
  if (role === 'student' && !email.endsWith('@vitapstudent.ac.in')) {
    console.error(`❌ Error: Student email must end with @vitapstudent.ac.in. Provided: ${email}`);
    process.exit(1);
  }

  if (role === 'faculty' && !email.endsWith('@vitap.ac.in')) {
    console.error(`❌ Error: Faculty email must end with @vitap.ac.in. Provided: ${email}`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Check if user already exists
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ id }, { username: id }, { email }],
    },
  });

  if (existing) {
    console.error(`❌ Error: User with ID '${id}' or Email '${email}' already exists.`);
    process.exit(1);
  }

  // Create User
  const user = await prisma.user.create({
    data: {
      id,
      username: id,
      passwordHash,
      name,
      email,
      phone,
      role,
      campus: 'VIT-AP University, Amaravati',
      school: role === 'student' ? 'School of Computer Science & Engineering (SCOPE)' : 'School of Computer Science & Engineering',
      program: role === 'student' ? 'Integrated M.Tech - Computer Science and Engineering' : undefined,
      semester: role === 'student' ? 'Fall Semester 2026-27' : undefined,
      designation: role === 'faculty' ? 'Assistant Professor' : undefined,
      department: role === 'faculty' ? 'Department of Software Engineering' : undefined,
    },
  });

  // If student, create StudentProfile and AcademicKPI
  if (role === 'student') {
    await prisma.studentProfile.create({
      data: {
        studentId: user.id,
        applicationNo: `2024${Math.floor(100000 + Math.random() * 900000)}`,
        dob: '01-Jan-2006',
        gender: 'MALE',
        bloodGroup: 'B+',
        nativeLanguage: 'ENGLISH',
        nativeState: 'ANDHRA PRADESH',
        degree: 'INTEGRATED POSTGRADUATE',
        admissionYear: 2024,
        isHosteller: true,
        hostelBlock: 'MH-1',
        roomNo: '101A',
        addressJson: JSON.stringify({
          street: 'Campus Hostel',
          area: 'Beside AP Secretariat',
          city: 'Amaravati',
          state: 'Andhra Pradesh',
          pincode: '522237',
          country: 'INDIA',
        }),
        educationJson: JSON.stringify({
          schoolName: 'CENTRAL SCHOOL',
          board: 'CBSE',
          qualification: '12TH / SENIOR SECONDARY',
          percentage: '92.0%',
          yearOfPassing: '2024',
        }),
      },
    });

    await prisma.academicKPI.create({
      data: {
        studentId: user.id,
        overallAttendancePercentage: 90.0,
        totalAttendedClasses: 90,
        totalConductedClasses: 100,
        debarSafetyStatus: 'safe',
        cgpa: 8.5,
        totalEarnedCredits: 40.0,
        currentSemesterCredits: 20.0,
        enrolledSubjectsCount: 5,
        enrolledComponentsCount: 6,
      },
    });
  }

  console.log(`
✅ SUCCESS: New ${role.toUpperCase()} created successfully!
======================================================
🆔 User ID:      ${user.id}
👤 Name:         ${user.name}
📧 Email:        ${user.email}
📱 Phone:        ${user.phone}
🔑 Password:     ${password}
🎓 Role:         ${user.role}
======================================================
You can now log in immediately on the VTOP portal!
`);
}

main()
  .catch((e) => {
    console.error('Fatal error adding user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
