# VTOP 2.0

> A high-performance, accessible redesign of VIT-AP University's Academic & Administrative Portal.

---

## Overview

**VTOP 2.0** is an enterprise-grade redesign of the institutional portal for VIT-AP University. Built on **React 19**, **TypeScript**, **Vite 8**, and **Tailwind CSS v4**, VTOP 2.0 replaces monolithic legacy interfaces with role-tailored operational cockpits for **Students**, **Faculty**, and **Administrators**.

The platform is designed with an **anti-default design discipline** — prioritizing data density, rapid transactional workflows, and strict **WCAG 2.2 AA** accessibility over decorative tropes.

---

## Architectural Highlights

- **Role-Based Experience Architecture**: Unified single-page application with dynamic role hydration (`student`, `faculty`, `admin`), contextual sidebar navigation rails, and tailored command palettes.
- **Two-Factor Authentication Simulation**: Enterprise 2FA OTP simulation with cooldown tracking, masked institutional email dispatch, and brute-force attempt limits.
- **High Data-Density Cockpits**: Optimized for rapid execution — single-click class attendance marking, inline submission grading, real-time campus telemetry, and batch hostel outing pass approvals.
- **Zero Cumulative Layout Shift (CLS)**: Strict layout reservation, font-metrics matching, and `tabular-nums` alignment for all numerical metrics, timestamps, and balances.
- **Accessibility by Default**: Full keyboard navigability, visible focus indicators (`focus-visible:ring-2`), minimum touch targets $\ge 44\text{px}$, minimum 4.5:1 text contrast ratios, and ARIA live regions for interactive updates.

---

## Role Experiences & Information Architecture

### 1. Student Portal (`role === 'student'`)
*Balanced collegiate dashboard for academic tracking, residential life, and university services.*
- **Design Configuration**: `DESIGN_VARIANCE: 6` | `MOTION_INTENSITY: 4` | `VISUAL_DENSITY: 5`
- **Active Mock Persona**: Arjun K Sharma (`23BCE1088`, B.Tech CSE, Hosteller, Room MH-304)
- **Features**:
  - Academic vitals summary (CGPA 9.18, 88.5% overall attendance, earned credits)
  - Interactive today's timetable widget with ongoing, completed, and upcoming slot indicators
  - Attendance pulse tracking with automated safe-class calculation and debar warnings
  - Digital assignments queue with submission upload state and due-date countdowns
  - Hostel outing management (weekend & general leave requests, parent consent status, gate pass generator)
  - Continuous assessment marks (CAT-1, CAT-2, FAT) and semester grade history
  - Online tuition & hostel fee payment receipts and clearance slips

### 2. Faculty Academic Cockpit (`role === 'faculty'`)
*Task-oriented workspace centered on instruction, evaluation, and student mentorship.*
- **Design Configuration**: `DESIGN_VARIANCE: 4` | `MOTION_INTENSITY: 3` | `VISUAL_DENSITY: 7`
- **Active Mock Persona**: Dr. Hussain Syed (`EMP10245`, Professor & Head of UI/UX Research Lab)
- **Features**:
  - **Live Class Slot Banner**: Prominently highlights the active session (`CSE4012 - Human-Computer Interaction`, Slot `C1+TC1`, Room `CB-402`, 64 students) with a one-click attendance marking drawer
  - **Academic KPI Bar**: Real-time counters for assigned courses, total enrolled students, pending grading items, and advisees
  - **Quick Attendance Ledger**: Interactive slot roster with 1-click "Mark All Present", quick toggles (Present / Absent / On-Duty), and locked timestamp submit
  - **Pending Grading Queue**: Assignment evaluation queue with rubrics score entry dialog and feedback recording
  - **Proctor Advisee Roster**: Student advisee list with CGPA tracking, low-attendance alert flags, and single-click mentor outing pass sign-off
  - **Invigilation Duties & Leave Desk**: Mid-term examination invigilation orders and faculty on-duty (OD) leave applications

### 3. Administrator Operations Cockpit (`role === 'admin'`)
*Institutional governance console offering campus-wide telemetry, security integration, and approval queues.*
- **Design Configuration**: `DESIGN_VARIANCE: 3` | `MOTION_INTENSITY: 2` | `VISUAL_DENSITY: 8`
- **Active Mock Persona**: Dr. S. K. Narayanan (`ADM1001`, Chief Administrative Officer & Registrar)
- **Features**:
  - **Campus Real-Time Health Telemetry**: Live headcount metrics (9,420 students on campus, 842 out on pass), faculty attendance rate (95%), pending fee clearances, and active biometric turnstiles
  - **Hostel Outing Approval Desk**: Interactive queue of pending student leave requests with single-click "Approve" / "Reject" and **"Batch Approve All Verified"**
  - **Emergency Broadcast Publisher**: Instant composer to dispatch urgent notices and weather advisories to the Campus Spotlight and student portals
  - **Biometric Gate Turnstile Stream**: Real-time telemetry feed from Main Gate and Hostel checkpoints with pass verification status
  - **Space & Scheduling Audit**: Classroom occupancy matrix across Central Block (CB), Academic Block 1 (AB-1), and Academic Block 2 (AB-2)
  - **Finance Audit**: Student fee reconciliation, defaulter flags, and automated hall-ticket clearance slips

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | React 19, TypeScript 5.8 |
| **Build & Tooling** | Vite 8, Rollup |
| **Styling** | Tailwind CSS v4, CSS Grid, Modern Color Tokens |
| **Iconography** | Lucide React (standardized stroke width, explicit ARIA labels) |
| **State & Auth** | Context API (`AuthContext`), Session Storage, Mock Auth & Service Stores |
| **Accessibility** | WCAG 2.2 Level AA Standard |

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Codymwon/VTOP2.0.git
   cd VTOP2.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## Test & Demo Accounts

Use the role switcher on the login screen to authenticate into any of the three roles:

| Role | Username / ID | Password | Simulated 2FA OTP | Target Persona |
|---|---|---|---|---|
| **Student** | `23BCE1088` | `password123` | `123456` | Arjun K Sharma |
| **Faculty** | `EMP10245` | `password123` | `123456` | Dr. Hussain Syed |
| **Admin** | `ADM1001` | `password123` | `123456` | Dr. S. K. Narayanan |

*(Note: Any password with length $\ge 4$ characters is accepted in development mode. The mock 2FA verification OTP is always `123456`.)*

---

## Codebase Structure

```
src/
├── components/
│   ├── auth/                    # RoleSwitcher, AuthForm, OtpModal
│   ├── common/                  # BrandLogo, MockBanner
│   ├── dashboard/
│   │   ├── AttendancePulseWidget.tsx
│   │   ├── QuickActionsBar.tsx
│   │   ├── SidebarNav.tsx       # Dynamic role-aware navigation rail
│   │   ├── TodayScheduleWidget.tsx
│   │   ├── TopNavbar.tsx        # Role-tailored search, notifications & profile
│   │   ├── UpcomingTasksWidget.tsx
│   │   ├── VitalsSummaryCards.tsx
│   │   ├── views/               # Core Cockpit Views
│   │   │   ├── StudentDashboardView.tsx
│   │   │   ├── FacultyDashboardView.tsx
│   │   │   └── AdminDashboardView.tsx
│   │   └── pages/               # Dedicated Subpages
│   │       ├── faculty/         # Courses, Attendance, Grading, Proctor, Duties
│   │       ├── admin/           # OutingDesk, Academics, FinanceAudit, Circulars, Directory
│   │       └── ...              # Student pages (Timetable, Marks, Payments, Profile)
│   └── spotlight/               # CampusSpotlight, MobileAppBadges
├── context/
│   └── AuthContext.tsx          # Multi-role authentication & session manager
├── services/
│   ├── mockAuthService.ts       # 2FA simulation & credential validation
│   ├── mockDashboardService.ts  # Student datasets
│   ├── mockFacultyService.ts    # Faculty courses, grading queue, advisees
│   └── mockAdminService.ts      # Campus metrics, outing approvals, gate logs
├── types/
│   ├── auth.ts
│   ├── dashboard.ts
│   ├── faculty.ts
│   └── admin.ts
└── screens/
    ├── PreLoginScreen.tsx       # Login & security portal
    └── DashboardScreen.tsx      # Main application workspace coordinator
```

---

## Compliance & Standards

- **WCAG 2.2 AA**: All text-to-background contrast ratios $\ge 4.5:1$ (normal text) and $\ge 3:1$ (large headers).
- **Touch Target Size**: Minimum $44 \times 44\text{px}$ interactive area on all interactive targets.
- **Data Anonymization**: All student and personnel data is 100% anonymized with synthetic names and identifiers.

---

## License

Institutional internal system developed for academic and operational workflows. All rights reserved.
