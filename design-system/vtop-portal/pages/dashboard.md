# Page Design System: Student Dashboard (Academic Command Center)

## 1. Page Purpose & Brief
The Student Dashboard replaces the legacy VTOP portal's empty grey canvas with an active, high-utility academic cockpit. It aggregates daily student requirements:
- Next lecture & classroom venue
- Real-time attendance health and debarment safety margin
- Urgent COE quiz & examination announcements
- Pending digital assignments
- Streamlined role-governed navigation

---

## 2. Design Dials & Aesthetic Family
- **Style Model**: `data-dense-dashboard` + `bento-box-grid`
- **DESIGN_VARIANCE**: `4` (Structured, high-balance modular grid)
- **MOTION_INTENSITY**: `3` (Subtle state transitions, zero layout-shifting transforms)
- **VISUAL_DENSITY**: `6` (Cockpit density with maximum data utility and zero wasted space)

---

## 3. Brand Color Tokens
- **Header Base**: `#2455A3`
- **Primary Interactive Blue**: `#176CB8`
- **Sky Accent**: `#3497DB`
- **Cyan Highlight**: `#5DADE2`
- **Canvas Neutral**: `#F4F6F9`
- **Card Surface**: `#FFFFFF` (with `border-slate-200/80` and `rounded-2xl`)
- **Status Tones**:
  - Safe / Full Attendance: Emerald (`#059669` / `bg-emerald-50 text-emerald-800`)
  - Warning / Tight Margin: Amber (`#D97706` / `bg-amber-50 text-amber-800`)
  - Critical / Debarred: Rose (`#DC2626` / `bg-rose-50 text-rose-800`)

---

## 4. Typography & Numerals
- **Headings & Body**: `Plus Jakarta Sans` / Geometric System Sans
- **Numerals & Codes**: `JetBrains Mono` / `font-mono tabular-nums` for percentages, CGPA, room numbers (`513`), and slot IDs (`C2+TC2`)

---

## 5. Navigation & Accessibility
- **Dual-State Navigation Rail**:
  - Collapsed: 64px width with vector SVG icons and tooltips.
  - Expanded: 288px drawer organizing 5 student modules (Academics, Examinations, Campus & Hostel, Finance, Support).
- **Destructive Action Isolation**: Logout is isolated in the profile menu and never mixed with academic tools.
- **Touch Standard**: All controls maintain $\ge 44\text{px} \times 44\text{px}$ hit areas.
