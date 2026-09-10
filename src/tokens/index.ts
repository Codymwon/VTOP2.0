/**
 * VTOP 2.0 Design Tokens - Academic Modernism
 * Adheres to WCAG 2.2 AA accessibility standards.
 */

export const tokens = {
  colors: {
    // Official VTOP Live Brand Palette (from https://vtop.vitap.ac.in/vtop/open/page)
    brand: {
      vtopHeaderBlue: '#2455A3',       // rgb(36, 85, 163) - Primary header / footer base
      vtopPrimaryBlue: '#176CB8',      // rgb(23, 108, 184) - .primaryTextColor1
      vtopSkyBlue: '#3497DB',          // rgb(52, 151, 219) - Header gradient mid
      vtopAccentBlue: '#2874A6',       // rgb(40, 116, 166) - Header gradient deep
      vtopTaglineBlue: '#3D66A7',      // rgb(61, 102, 167) - .taglineBox
      vtopTaglineLight: '#4884E5',     // rgb(72, 132, 229) - .taglineBox gradient end
      vtopStudentBorder: '#3C8DBC',    // rgb(60, 141, 188) - .cardStudent / .navyBorder
      vtopEmployeeGold: '#D4AC0D',     // rgb(212, 172, 13) - .employeeTextColor / .employeeBtnColor
      vtopParentGreen: '#18AD4C',      // #18ad4c - .greenText / .cardParent
      vtopAlumniCyan: '#5DADE2',       // rgb(93, 173, 226) - .cardAlumni
      vtopSpotlightMaroon: '#900C3F',  // rgb(144, 12, 63) - .hightlight1
      vitapMaroon: '#7D0E14',          // Official crest maroon on white
    },
    surface: {
      canvas: '#F8FAFC',     // Light mode background
      card: '#FFFFFF',       // Card background
      subtle: '#F1F5F9',     // Inset input / control fill
      border: '#CBD5E1',     // Standard border
      borderFocus: '#176CB8',// Interactive focus ring
    },
    text: {
      primary: '#0F172A',    // High contrast on white
      secondary: '#475569',  // Secondary description
      muted: '#64748B',      // Captions / helper text
      inverted: '#FFFFFF',   // On dark / brand blue
      invertedMuted: '#E2E8F0', // On dark / brand blue
    },
    status: {
      success: '#18AD4C',    // Matches VTOP parent/success green
      warning: '#D4AC0D',    // Matches VTOP employee gold
      error: '#DC2626',      // Validation error
      info: '#3497DB',       // Announcement tag
    }
  },
  typography: {
    fontFamily: {
      sans: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  },
  layout: {
    minTouchTarget: '48px', // Mobile thumb-friendly WCAG 2.5.5
  },
} as const;

export type DesignTokens = typeof tokens;
