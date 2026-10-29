# VTOP 2.0 Backend & Database Service

High-performance, secure backend API server for **VTOP 2.0** built with **Express**, **TypeScript**, **SQLite**, and **Prisma ORM**.

---

## 🚀 Features

- **Full Authentication System**:
  - Encrypted passwords with `bcryptjs`.
  - **Two-Factor Authentication (2FA)** with 6-digit OTP dispatch, attempt limits (max 4), and cooldown timers.
  - Institutional domain verification:
    - **Students**: Email must end with `@vitapstudent.ac.in` (e.g. `akarsh.23mic7209@vitapstudent.ac.in`).
    - **Faculty**: Email must end with `@vitap.ac.in` (e.g. `hussain.syed@vitap.ac.in`).
  - **Mobile SMS Verification**: Enforces that OTPs can only be dispatched to the verified registered mobile number on institutional record.
  - **Nodemailer SMTP Integration**: Dispatches formatted HTML emails to real inboxes when SMTP credentials are provided.
  - Development bypass OTP (`123456`) and dynamic OTP generated per session.
  - **JWT Session Tokens** with role-based claims and 12-hour expiration.
- **Embedded Database**:
  - SQLite (`server/dev.db`) managed via **Prisma ORM** — zero external installation needed.
  - Visual Web GUI editor (**Prisma Studio**) and dedicated CLI user addition tools.

---

## 🔑 Pre-Seeded Demo Credentials

All test accounts use the password: `password123`

| Role | User ID / Username | Name | Email | Registered Mobile |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `23MIC7209` | AKARSH | `akarsh.23mic7209@vitapstudent.ac.in` | `+91 98401 23456` |
| **Faculty** | `EMP10245` | Dr. Hussain Syed | `hussain.syed@vitap.ac.in` | `+91 94432 10987` |
| **Admin** | `ADM1001` | Dr. S. K. Narayanan | `sk.narayanan@vitap.ac.in` | `+91 98765 43210` |

---

## 📧 How to Receive Real Emails in Your Inbox

To have Nodemailer send real emails over the internet to your inbox, provide your email provider's credentials in `server/.env`.

### Fast Setup with Gmail (takes 1 minute):
1. Go to your [Google Account Security Settings](https://myaccount.google.com/security) (make sure 2-Step Verification is ON).
2. Search for or click **App passwords** (at the bottom of 2-Step Verification).
3. Generate a password with name `VTOP`. Google will give you a 16-letter code (e.g. `abcd efgh ijkl mnop`).
4. In `server/.env`, enter:
   ```env
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="abcdefghijklmnop"
   SMTP_FROM="\"VTOP 2.0 Security\" <your-email@gmail.com>"
   ```
5. Restart the server (`npm start`). Real emails with the 6-digit OTP will land in the inbox!

*(Without SMTP credentials, the server runs in local dev simulation mode: it prints the OTP in your terminal console and provides a 1-click **Auto-fill** button in the popup modal so you can test instantly without leaving your browser).*

---

## 🗄️ How to Modify the Database & Add New Users

You have **3 simple ways** to manage users and database records:

### Method 1: Prisma Studio (Visual Web GUI — Recommended)
Run from root:
```powershell
npm run server:studio
```
This opens a spreadsheet-like GUI at `http://localhost:5555` in your browser:
- Click **User** to view, add, or edit any student or faculty.
- Click **StudentProfile** or **AcademicKPI** to edit their CGPA, attendance, or hostel room.
- Changes save directly to the SQLite database.

### Method 2: CLI Command (Quick Single User Addition)
Run from root:
```powershell
# Add a new Student:
npm run server:add-user -- --role student --id 24BCE1001 --name "Rahul Sharma" --email rahul.24bce1001@vitapstudent.ac.in --phone "+91 98765 01234"

# Add a new Faculty:
npm run server:add-user -- --role faculty --id EMP20400 --name "Dr. Ananya Roy" --email ananya.roy@vitap.ac.in --phone "+91 94444 55555"
```
*(The script automatically hashes the password, creates their student profile, and initializes their academic KPIs)*.

### Method 3: Seed Script (For Batch/Bulk Initialization)
Edit `server/prisma/seed.ts` to add any desired students or faculty records, then run:
```powershell
npm run server:seed
```

---

## 🛠️ General Commands

```powershell
npm start               # Run frontend and backend concurrently
npm run dev             # Run frontend only (http://localhost:3000)
npm run server          # Run backend only (http://localhost:8080)
npm run server:studio   # Open visual database editor (http://localhost:5555)
npm run server:seed     # Reset database to default clean records
```
