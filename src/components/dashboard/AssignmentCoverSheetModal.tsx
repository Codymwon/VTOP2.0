import React, { useState } from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { MOCK_STUDENT_PROFILE } from '../../services/mockDashboardService';

interface AssignmentCoverSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseCode?: string;
}

const COURSES = [
  {
    code: 'CSE4012',
    title: 'UI UX User Experience Design',
    slot: 'C2+TC2',
    faculty: 'Dr. Hussain Syed',
    school: 'School of Computer Science & Engineering (SCOPE)',
  },
  {
    code: 'LIB2016',
    title: 'Human Factors Psychology',
    slot: 'A2+TA2',
    faculty: 'Krishna Priya B',
    school: 'School of Social Sciences & Humanities (VISH)',
  },
  {
    code: 'PHY2005',
    title: 'Introduction to Nanotechnology',
    slot: 'B2+TB2',
    faculty: 'K Uma Mahendra Kumar',
    school: 'School of Advanced Sciences (SAS)',
  },
  {
    code: 'STS3007',
    title: 'Advanced Competitive Coding - 1',
    slot: 'E2+TE2',
    faculty: 'Ishu Kumar',
    school: 'School of Social Sciences & Humanities (VISH)',
  },
  {
    code: 'SWE4007',
    title: 'Software Application Architecture',
    slot: 'D2+TD2',
    faculty: 'Dr. Meenakshi S',
    school: 'School of Computer Science & Engineering (SCOPE)',
  },
];

const COMPONENTS = [
  'Digital Assignment 1 (DA-1)',
  'Digital Assignment 2 (DA-2)',
  'Digital Assignment 3 (DA-3)',
  'Case Study Review Report',
  'Paper Prototype Submission',
];

export const AssignmentCoverSheetModal: React.FC<AssignmentCoverSheetModalProps> = ({
  isOpen,
  onClose,
  defaultCourseCode = 'CSE4012',
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState(defaultCourseCode);
  const [selectedComponent, setSelectedComponent] = useState(COMPONENTS[0]);
  const [submissionDate, setSubmissionDate] = useState(() => new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const currentCourse = COURSES.find((c) => c.code === selectedCourseCode) || COURSES[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-sheet-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#176CB8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Official Document Generator
              </span>
              <span className="text-xs text-slate-500 font-semibold">Standard Cover Sheet</span>
            </div>
            <h2 id="cover-sheet-modal-title" className="text-base font-bold text-slate-900 mt-1">
              Assignment Front Page / Cover Template
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-3 bg-slate-100/70 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Course</label>
            <select
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#176CB8]"
            >
              {COURSES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Assessment</label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#176CB8]"
            >
              {COMPONENTS.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Date</label>
            <input
              type="date"
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#176CB8]"
            />
          </div>
        </div>

        {/* Cover Sheet Document Canvas (Standard Printable Sheet) */}
        <div className="p-6 overflow-y-auto bg-slate-200/50 flex justify-center">
          <div className="bg-white w-full max-w-xl p-8 border border-slate-300 shadow-md text-slate-900 font-serif space-y-6">
            {/* Institution Brand Seal Header */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="flex justify-center mb-2">
                <BrandLogo variant="light" size="md" />
              </div>
              <h1 className="text-lg font-bold tracking-wider font-sans uppercase">
                VIT-AP UNIVERSITY
              </h1>
              <p className="text-xs font-semibold text-slate-600 font-sans tracking-wide uppercase">
                {currentCourse.school}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Fall Semester 2026-27 • Continuous Assessment Deliverable
              </p>
            </div>

            {/* Document Title */}
            <div className="text-center py-2 bg-slate-50 border border-slate-200">
              <h2 className="text-base font-bold font-sans tracking-wide uppercase text-slate-900">
                {selectedComponent}
              </h2>
            </div>

            {/* Academic Information Table */}
            <div className="border border-slate-300 divide-y divide-slate-200 text-xs font-sans">
              <div className="grid grid-cols-3 p-2.5">
                <span className="font-bold text-slate-600">Course Code & Title:</span>
                <span className="col-span-2 font-bold text-slate-900 font-mono">
                  {currentCourse.code} — {currentCourse.title}
                </span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="font-bold text-slate-600">Class Slot:</span>
                <span className="col-span-2 font-bold text-slate-900 font-mono">
                  {currentCourse.slot}
                </span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="font-bold text-slate-600">Course Instructor:</span>
                <span className="col-span-2 font-semibold text-slate-900">
                  {currentCourse.faculty}
                </span>
              </div>
              <div className="grid grid-cols-3 p-2.5 bg-slate-50/50">
                <span className="font-bold text-slate-600">Student Register No:</span>
                <span className="col-span-2 font-black text-slate-900 font-mono text-sm tracking-wider">
                  {MOCK_STUDENT_PROFILE.regNo}
                </span>
              </div>
              <div className="grid grid-cols-3 p-2.5 bg-slate-50/50">
                <span className="font-bold text-slate-600">Student Full Name:</span>
                <span className="col-span-2 font-bold text-slate-900 uppercase">
                  {MOCK_STUDENT_PROFILE.name}
                </span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="font-bold text-slate-600">Academic Program:</span>
                <span className="col-span-2 text-slate-800">{MOCK_STUDENT_PROFILE.program}</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="font-bold text-slate-600">Submission Date:</span>
                <span className="col-span-2 font-mono text-slate-800">{submissionDate}</span>
              </div>
            </div>

            {/* Academic Integrity Honor Declaration */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 text-[11px] font-sans leading-relaxed text-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Student Honor Code & Plagiarism Declaration</span>
              </div>
              <p>
                I hereby declare that this assignment submission is solely my own authentic work. I
                have not engaged in plagiarism, unauthorized collaboration, or uncredited usage of
                external or AI generation tools, in strict adherence to VIT Academic Integrity
                regulations.
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-6 grid grid-cols-2 gap-8 text-xs font-sans text-center">
              <div className="border-t border-slate-400 pt-2">
                <span className="font-bold text-slate-800">Student Signature</span>
                <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                  Digitally Authenticated ({MOCK_STUDENT_PROFILE.regNo})
                </div>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <span className="font-bold text-slate-800">Evaluator / Faculty Marks</span>
                <div className="font-mono text-[10px] text-slate-500 mt-0.5">Max Score: [ / 10 ]</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
