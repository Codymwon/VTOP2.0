import React from 'react';
import { PageBreadcrumbHeader } from './PageBreadcrumbHeader';
import { StudentProfile } from '../../../types/dashboard';
import {
  User,
  GraduationCap,
  Building2,
  MapPin,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface ProfilePageViewProps {
  student: StudentProfile;
  onBackToDashboard: () => void;
}

export const ProfilePageView: React.FC<ProfilePageViewProps> = ({
  student,
  onBackToDashboard,
}) => {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <PageBreadcrumbHeader
        category="Account & Profile"
        title="Student Profile & Biodata Record"
        subtitle="Official institutional enrollment records, residential data, educational history, and mentor allocation."
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            Verified University Profile
          </span>
        }
      />

      {/* Student Identity Hero Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-[#2455A3] to-[#176CB8] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            {student.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#176CB8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {student.regNo}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                App No: {student.applicationNo}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {student.name}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {student.program} · <strong className="text-slate-900">{student.school}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-5">
          <div className="space-y-1 text-xs">
            <div className="text-slate-500 font-medium">Current Academic Standing:</div>
            <div className="font-bold text-slate-900 font-mono">{student.semester}</div>
            <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded inline-block">
              Hostel: {student.hostelBlock} - {student.roomNo}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Personal & Demographic Records */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Personal & Demographic Details
            </h3>
          </div>

          <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <dt className="text-slate-500 font-medium">Full Name</dt>
              <dd className="font-semibold text-slate-900 mt-0.5">{student.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Register Number</dt>
              <dd className="font-mono font-bold text-slate-900 mt-0.5">{student.regNo}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Date of Birth</dt>
              <dd className="font-mono text-slate-800 mt-0.5">{student.dob}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Gender</dt>
              <dd className="text-slate-800 mt-0.5">{student.gender}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Blood Group</dt>
              <dd className="font-mono font-bold text-rose-700 mt-0.5">{student.bloodGroup}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Native State / Language</dt>
              <dd className="text-slate-800 mt-0.5">{student.nativeState} ({student.nativeLanguage})</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Admission Batch</dt>
              <dd className="font-mono text-slate-800 mt-0.5">{student.admissionYear}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Nationality</dt>
              <dd className="text-slate-800 mt-0.5">Indian</dd>
            </div>
          </dl>
        </div>

        {/* 2. Academic Program Details */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <GraduationCap className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Academic Program & Faculty Advisor
            </h3>
          </div>

          <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div className="col-span-2">
              <dt className="text-slate-500 font-medium">Enrolled Degree & Major</dt>
              <dd className="font-bold text-slate-900 mt-0.5">{student.program}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-slate-500 font-medium">School / Faculty</dt>
              <dd className="font-semibold text-slate-800 mt-0.5">{student.school}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Faculty Mentor / Proctor</dt>
              <dd className="font-bold text-slate-900 mt-0.5">Dr. Hussain Syed</dd>
              <dd className="text-[11px] text-slate-500">SCOPE · AB1-513</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Advisor Email</dt>
              <dd className="text-slate-800 font-mono mt-0.5">hussain.syed@vitap.ac.in</dd>
            </div>
          </dl>
        </div>

        {/* 3. Residential & Hostel Records */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Hostel Accommodation Record
            </h3>
          </div>

          <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <dt className="text-slate-500 font-medium">Hosteller Status</dt>
              <dd className="font-bold text-emerald-700 mt-0.5">Yes (Active Resident)</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Block & Room Number</dt>
              <dd className="font-mono font-bold text-slate-900 mt-0.5">{student.hostelBlock} - {student.roomNo}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Room Category</dt>
              <dd className="text-slate-800 mt-0.5">2-Bedded Air Conditioned</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Hostel Warden Desk</dt>
              <dd className="text-slate-800 mt-0.5">MH-1 Warden Office</dd>
            </div>
          </dl>
        </div>

        {/* 4. Permanent & Communication Address */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Permanent Communication Address
            </h3>
          </div>

          <div className="text-xs space-y-1.5 text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900">{student.name}</p>
            <p>{student.address.street}</p>
            <p>{student.address.area}</p>
            <p>{student.address.city}, {student.address.state} - <span className="font-mono font-bold text-slate-900">{student.address.pincode}</span></p>
            <p className="font-semibold text-slate-500">{student.address.country}</p>
          </div>
        </div>

        {/* 5. Qualifying School Examination (Class 12th) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-4 h-4 text-[#176CB8]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Prior Qualifying Educational Record (Higher Secondary)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <span className="text-slate-500 font-medium block">Institution / School</span>
              <strong className="font-bold text-slate-900 block mt-0.5">
                {student.education.schoolName}
              </strong>
              <span className="text-[11px] text-slate-500">{student.education.board}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Qualification</span>
              <strong className="text-slate-800 block mt-0.5">{student.education.qualification}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Aggregate Percentage</span>
              <strong className="text-base font-mono font-black text-emerald-700 block mt-0.5">
                {student.education.percentage} ({student.education.yearOfPassing})
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
