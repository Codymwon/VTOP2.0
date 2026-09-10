# Pre-Login Gateway Design Overrides

> **Page**: Phase 1 Pre-Login & Authentication Gateway
> **Parent**: `design-system/vtop-portal/MASTER.md`

---

## 1. Page-Specific Layout & Dials
- **Layout Model**: Split-screen 54% branding & campus spotlight (left) / 46% unified auth card (right). Mobile collapses gracefully to a single vertical column.
- **Dials**:
  - `DESIGN_VARIANCE: 5` (Structured academic split, high trust)
  - `MOTION_INTENSITY: 4` (Spring-damped tactile feedback, reduced-motion fallback)
  - `VISUAL_DENSITY: 5` (Standard academic density, balanced spacing)

---

## 2. Typography Adjustments
- While `MASTER.md` defaults to classic editorial fonts (`EB Garamond`), the active web application UI for student/faculty portal operations uses **`Plus Jakarta Sans`** for maximum legibility on digital screens, along with **`JetBrains Mono`** for tabular PIN/OTP digits.

---

## 3. Interaction & Accessibility Directives
- **Touch Target**: Strict `min-h-[48px]` for all interactive controls (buttons, segmented tabs, text inputs).
- **Two-Factor Authentication**:
  - 6-box individual inputs with auto-advance, backspace retreat, and full clipboard paste support.
  - 180s live cooldown timer for resend.
  - Max 4 verification attempts before session lockout.
- **Contrast Ratios**:
  - High-contrast body text (`#0F172A` on `#FFFFFF`): 14:1.
  - Interactive CTAs (`#176CB8` / `#2455A3` with `#FFFFFF`): > 5.5:1 (passes WCAG AA 4.5:1).
  - Inverted text on Navy pane (`#FFFFFF` on `#183668`): > 10:1.
