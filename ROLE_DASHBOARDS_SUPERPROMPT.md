# MISSION: Implement Role-Specific Faculty & Administrator Dashboards in VTOP 2.0

## 1. Project Background & Context
We are working on **VTOP 2.0** (`/home/aadith/development/active-projects/VTOP2.0`), a modern, high-performance redesign of VIT-AP University's student and staff portal.
- **Tech Stack**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React icons.
- **Authentication**: Supports 3 distinct authenticable roles (`UserRole = 'student' | 'faculty' | 'admin'`) with a unified 3-button switcher on the login page, 2FA OTP simulation, and session storage via `AuthContext.tsx`.
- **Active Mock Accounts**:
  - **Student**: Arjun K Sharma (`23BCE1088`, B.Tech CSE, Hosteller)
  - **Faculty**: Dr. Hussain Syed (`EMP10245`, Professor & Head of UI/UX Research Lab)
  - **Admin**: Dr. S. K. Narayanan (`ADM1001`, Chief Administrative Officer & Registrar)

### The Problem
Currently, when logging in as **Faculty** or **Admin**, the application renders the exact same **Student Dashboard** (showing student CGPA, hostel outing requests, student tuition fees, and student class attendance), with only a minor banner or name change on top. 
Faculty and Admins need **role-tailored navigation, dashboard home widgets, and dedicated views** that reflect their real university responsibilities.

---

## 2. Mandatory Skill Invocations & Design Guidance

Before designing or modifying files, you MUST consult and strictly follow these two skills:

### A. Skill: `/ui-ux-pro-max` (Design Intelligence)
- Read `/home/aadith/.gemini/config/skills/ui-ux-pro-max/SKILL.md`.
- Run the local CLI search tool to generate a coherent design system for enterprise higher-ed portals:
  ```bash
  python3 ~/.gemini/config/skills/ui-ux-pro-max/scripts/search.py "higher education faculty administrator cockpit dashboard" --design-system -p "VTOP Enterprise"
  ```
- Search for high-density dashboard patterns and accessibility rules:
  ```bash
  python3 ~/.gemini/config/skills/ui-ux-pro-max/scripts/search.py "dense data dashboard table approval workflow" --domain ux
  python3 ~/.gemini/config/skills/ui-ux-pro-max/scripts/search.py "accessible status badge interactive data row" --domain ux
  ```
- Ensure WCAG 2.2 AA compliance: minimum touch targets $\ge 44\text{px}$, 4.5:1 text contrast, visible focus rings, ARIA live regions for interactive updates, and zero Cumulative Layout Shift (CLS).

### B. Skill: `/design-taste-frontend` (Anti-Slop Philosophy)
- Read `/home/aadith/.gemini/config/skills/design-taste-frontend/SKILL.md`.
- **Anti-Default Discipline**: Reject AI-slop tropes (no arbitrary purple gradient meshes, no generic 3-card marketing heroes on an operations dashboard, no blurry glassmorphism on tabular data).
- **Configure the Three Dials**:
  - `Student Dashboard`: `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 4`, `VISUAL_DENSITY: 5` (balanced student portal).
  - `Faculty Dashboard`: `DESIGN_VARIANCE: 4`, `MOTION_INTENSITY: 3`, `VISUAL_DENSITY: 7` (focused academic workflow, rapid grading & attendance).
  - `Admin Dashboard`: `DESIGN_VARIANCE: 3`, `MOTION_INTENSITY: 2`, `VISUAL_DENSITY: 8` (operational cockpit, high data-density, institutional oversight, approval queues).
- Output a 1-line **Design Read** before writing UI code.

---

## 3. Detailed Role Requirements & Information Architecture

### A. Student Experience (PRESERVE & MAINTAIN)
- Preserve all existing student views: Timetable, Attendance, Hostel Outing Requests, Exams, Assignments, Fee Payments, and Profile.
- Ensure refactoring does not regress any student features.

---

### B. Faculty Dashboard Experience (`role === 'faculty'`)
A faculty member's core workflows revolve around **teaching, evaluating, student mentoring (proctoring), and academic duties**.

1. **Faculty Navigation (`SidebarNav.tsx`)**:
   - `Dashboard` (Academic Cockpit)
   - `My Courses & Slots` (Assigned subjects, syllabus progress, classroom allocations)
   - `Attendance Tracker` (Class attendance marking roster)
   - `Evaluation & Grading` (Assignment/DA submissions queue, CAT/FAT marks entry)
   - `Proctoree Roster` (Assigned student advisees, academic warnings, leave approvals)
   - `Duties & Leave` (Invigilation schedule, faculty duty leave requests)

2. **Faculty Dashboard Home Widgets**:
   - **Classes Today / Live Slot**: Banner showing the next or active class (e.g. `CSE4012 - Human-Computer Interaction`, Slot `C1+TC1`, 10:00 AM – 10:50 AM, Room `CB-402`, 64 students enrolled) with a one-click **"Mark Attendance"** modal/drawer.
   - **Faculty Academic KPI Bar**:
     - *Active Courses*: 3 courses (18 credits)
     - *Total Enrolled Students*: 192 students
     - *Submissions Pending Evaluation*: 28 Digital Assignments
     - *Proctor Students*: 24 advisees (2 on academic alert)
   - **Quick Attendance Marking Widget**: Select slot $\rightarrow$ list of students with 1-click "Mark All Present", quick toggles for Absent/On-Duty, and submit with timestamp.
   - **Pending Grading Queue**: List of student submissions awaiting review with course tag, due date, and quick-grade action.
   - **Invigilation & Academic Calendar**: Upcoming mid-term examination duties with hall and reporting time.

---

### C. Administrator Dashboard Experience (`role === 'admin'`)
The administrator (Registrar, Chief Warden, Academic Dean, Exam Controller) requires an **institutional governance cockpit with high data density, real-time metrics, and action-oriented queues**.

1. **Admin Navigation (`SidebarNav.tsx`)**:
   - `Dashboard` (Institutional Operations Cockpit)
   - `Outing & Leave Desk` (Hostel weekend & general outing approval desk)
   - `Academic Administration` (Course scheduling, faculty allocations, classroom allocation)
   - `Fee & Clearance Audit` (Fee reconciliation, defaulter lists, clearance slips)
   - `Announcements & Circulars` (Campus spotlight publisher, emergency broadcast)
   - `User & Security Directory` (Student, Faculty & Staff identity lookup, permission audit)

2. **Admin Dashboard Home Widgets**:
   - **Campus Real-Time Health Metrics**:
     - *Campus Headcount*: 9,420 students on campus (842 currently out on approved gate pass)
     - *Pending Outing Requests*: 47 pending warden review (critical queue)
     - *Faculty On Duty*: 342 / 360 present today (95% attendance)
     - *Pending Fee Clearances*: 18 hall-ticket clearance requests
   - **Hostel Outing Approval Desk (Interactive Queue)**:
     - Live table of student outing requests (`23BCE1088`, Arjun K Sharma, Weekend Outing to Hyderabad, Parent Approved: Yes).
     - Single-click **"Approve"** / **"Reject"** and **"Batch Approve All Verified"** with instant visual feedback and audit log badge.
   - **Emergency Circular & Broadcast Banner Publisher**:
     - Widget to post urgent announcements directly to the Campus Spotlight and student portals.
   - **Security Operations & Gate Log**:
     - Recent biometric gate turnstile swipes (In/Out) with timestamps.

---

## 4. Key Architectural Files to Inspect & Refactor

1. **Navigation Engine**:
   - `src/components/dashboard/SidebarNav.tsx`: Compute navigation items dynamically based on `user.role`.
   - `src/components/dashboard/TopNavbar.tsx`: Ensure search, shortcuts, and notifications match the active role.
2. **Dashboard Coordinator**:
   - `src/screens/DashboardScreen.tsx`: Split into role-specific sub-dashboards:
     - `<StudentDashboardView />` (existing student dashboard components)
     - `<FacultyDashboardView />` (new dedicated faculty cockpit)
     - `<AdminDashboardView />` (new dedicated admin cockpit)
3. **Mock Data & Services**:
   - Create `src/services/mockFacultyService.ts`: Faculty courses, today's schedule, grading queue, proctor students.
   - Create `src/services/mockAdminService.ts`: Real-time campus KPIs, outing requests queue, fee audits, gate logs.
4. **Types**:
   - `src/types/dashboard.ts` or `src/types/faculty.ts` / `src/types/admin.ts`: Strongly typed interfaces for faculty slots, grading items, outing approvals, and campus metrics.
5. **Data Privacy**:
   - Maintain 100% anonymized, realistic mock data (no personal user names or phone numbers; use Arjun K Sharma, Dr. Hussain Syed, Dr. S. K. Narayanan).

---

## 5. Execution & Verification Workflow

1. Research existing structures in `src/components/dashboard/` and `src/services/`.
2. Generate the design system using `/ui-ux-pro-max` CLI and establish high-density cockpit layout rules from `/design-taste-frontend`.
3. Create the mock data services for Faculty and Admin workflows.
4. Implement `<FacultyDashboardView />` and `<AdminDashboardView />` with responsive layout and WCAG 2.2 AA standards.
5. Make `SidebarNav.tsx` role-aware with dedicated nav groupings and active view switching.
6. Verify:
   - Run `npm run build` (`tsc -b && vite build`) with zero errors.
   - Test login switching:
     - Log in as **Student** (`23BCE1088`) $\rightarrow$ Verify student dashboard & outing pages work seamlessly.
     - Log in as **Faculty** (`EMP10245`) $\rightarrow$ Verify faculty teaching schedule, attendance marker, and grading queue.
     - Log in as **Admin** (`ADM1001`) $\rightarrow$ Verify admin operational cockpit and interactive outing approval desk.
