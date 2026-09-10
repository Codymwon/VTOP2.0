import React, { useState } from 'react';
import { Award, Bell, ExternalLink, ChevronRight, Building2, BookOpen } from 'lucide-react';
import { CampusNotice, UniversityAccreditation } from '../../types/auth';

const ACCREDITATIONS: UniversityAccreditation[] = [
  {
    title: 'Ranked #1 Emerging Private University in India',
    agency: 'Outlook University Rankings',
    year: '2022, 2023 & 2024',
    highlight: 'Consecutive #1 Rank',
  },
  {
    title: 'Outcome Based Education (OBE) Excellence',
    agency: 'R-World Institutional Ranking',
    year: 'OBE-2023',
    highlight: 'Diamond Band (A+ Category)',
  },
  {
    title: "Faculty in World's Top 2% Scientists",
    agency: 'Stanford University & Elsevier Survey',
    year: 'Global Recognition',
    highlight: 'Research Excellence',
  },
  {
    title: 'Recognized Host Institute (HI) for MSME Incubation',
    agency: 'Ministry of Micro, Small & Medium Enterprises',
    year: 'Govt. of India',
    highlight: 'Govt. of India Certified',
  },
];

const NOTICES: CampusNotice[] = [
  {
    id: 'n1',
    title: 'Transcripts for VIT-AP Alumni Students: Online Verification & Application System',
    tag: 'Alumni',
    date: 'Sep 2026',
    isNew: true,
  },
  {
    id: 'n2',
    title: 'Fall Semester 2026-27: Final Examination Schedule & Slot Allotment Published',
    tag: 'Academic',
    date: 'Sep 2026',
    isNew: true,
  },
  {
    id: 'n3',
    title: 'Advisory on Two-Factor Authentication (OTP) Security Guidelines for Portal Access',
    tag: 'Urgent',
    date: 'Aug 2026',
  },
  {
    id: 'n4',
    title: 'Annual Research Symposium & Innovation Expo: Submissions Open for Students & Faculty',
    tag: 'General',
    date: 'Aug 2026',
  },
];

export const CampusSpotlight: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'highlights' | 'notices'>('notices');

  return (
    <div className="flex flex-col h-full justify-between space-y-3.5 lg:space-y-4 text-white">
      {/* Top Section: VTOP Mission & Vision */}
      <div className="space-y-2.5 lg:space-y-3 shrink-0">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5DADE2] block">
          Unified Academic & Research Gateway
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
          VTOP translates to <span className="text-[#5DADE2]">&quot;VIT on TOP&quot;</span>
        </h1>

        <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl font-normal">
          Empowering Students, Faculty, and Staff with secure, <span className="whitespace-nowrap font-medium">role-governed</span> access to academic records, course registration, attendance, examinations, and university administration.
        </p>
      </div>

      {/* Center Interactive Tabbed Spotlight: Notices vs Accreditations */}
      <div className="space-y-2.5 flex-1 min-h-0 flex flex-col justify-center">
        <div className="flex items-center justify-between border-b border-white/20 pb-1.5 shrink-0">
          <div role="tablist" aria-label="Campus spotlight and notices" className="flex items-center gap-4">
            <button
              type="button"
              role="tab"
              id="spotlight-tab-notices"
              aria-selected={activeTab === 'notices'}
              aria-controls="spotlight-panel-notices"
              tabIndex={activeTab === 'notices' ? 0 : -1}
              onClick={() => setActiveTab('notices')}
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold pb-1 min-h-[40px] border-b-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] rounded-t ${
                activeTab === 'notices'
                  ? 'text-white border-[#3497DB]'
                  : 'text-blue-200/70 border-transparent hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Campus Spotlight & Notices</span>
              <span className="text-[10px] sm:text-[11px] px-1.5 py-0.2 bg-[#900C3F] text-white rounded-full font-bold shadow-xs">
                {NOTICES.filter((n) => n.isNew).length} New
              </span>
            </button>

            <button
              type="button"
              role="tab"
              id="spotlight-tab-highlights"
              aria-selected={activeTab === 'highlights'}
              aria-controls="spotlight-panel-highlights"
              tabIndex={activeTab === 'highlights' ? 0 : -1}
              onClick={() => setActiveTab('highlights')}
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold pb-1 min-h-[40px] border-b-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] rounded-t ${
                activeTab === 'highlights'
                  ? 'text-white border-[#3497DB]'
                  : 'text-blue-200/70 border-transparent hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Accreditations & Honors</span>
            </button>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-blue-200/80 hover:text-white cursor-pointer transition-colors font-medium">
            <span>Archive</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Tab Content */}
        {activeTab === 'notices' ? (
          <div
            id="spotlight-panel-notices"
            role="tabpanel"
            aria-labelledby="spotlight-tab-notices"
            className="space-y-2 animate-in fade-in duration-150"
          >
            {NOTICES.map((notice) => (
              <div
                key={notice.id}
                className="group p-2.5 sm:p-2.5 lg:p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] hover:border-white/30 transition-all flex items-start gap-2.5 cursor-pointer focus-within:ring-2 focus-within:ring-[#3497DB] shadow-xs"
              >
                <div
                  className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold shrink-0 mt-0.5 tracking-wide ${
                    notice.tag === 'Urgent'
                      ? 'bg-rose-500/30 text-rose-100 border border-rose-400/50'
                      : notice.tag === 'Alumni'
                      ? 'bg-[#5DADE2]/30 text-sky-100 border border-[#5DADE2]/60'
                      : 'bg-[#3497DB]/30 text-cyan-100 border border-[#3497DB]/60'
                  }`}
                >
                  {notice.tag}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-50 line-clamp-1 sm:line-clamp-2 leading-snug">
                    {notice.title}
                  </p>
                  <span className="text-[10px] sm:text-[11px] text-blue-200/80 mt-0.5 block font-mono font-medium">
                    Published: {notice.date}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-blue-200/70 group-hover:text-white shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            ))}
          </div>
        ) : (
          <div
            id="spotlight-panel-highlights"
            role="tabpanel"
            aria-labelledby="spotlight-tab-highlights"
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-150"
          >
            {ACCREDITATIONS.map((acc, i) => (
              <div
                key={i}
                className="p-2.5 sm:p-3 rounded-xl bg-white/[0.08] border border-white/[0.15] flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-[10px] sm:text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md mb-1.5 border border-amber-400/30">
                    {acc.highlight}
                  </span>
                  <h3 className="text-xs font-semibold text-white leading-snug">
                    {acc.title}
                  </h3>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-white/15 text-[10px] sm:text-[11px] text-blue-200/90 flex justify-between items-center">
                  <span>{acc.agency}</span>
                  <span className="font-mono font-semibold text-white">{acc.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Quick Links */}
      <div className="pt-2.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-2.5 text-xs text-blue-200/90 font-medium shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#academic-calendar"
            onClick={(e) => e.preventDefault()}
            className="hover:text-white transition-colors flex items-center gap-1.5 py-1 min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] rounded"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-300" />
            <span>Academic Calendar</span>
          </a>
          <a
            href="#parent-portal"
            onClick={(e) => e.preventDefault()}
            className="hover:text-white transition-colors flex items-center gap-1.5 py-1 min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] rounded"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            <span>Parent Desk</span>
          </a>
          <a
            href="#alumni"
            onClick={(e) => e.preventDefault()}
            className="hover:text-white transition-colors flex items-center gap-1.5 py-1 min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3497DB] rounded"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
            <span>Alumni Network</span>
          </a>
        </div>
        <span className="text-[10px] sm:text-[11px] text-blue-200/70 font-mono font-medium">
          VIT-AP Campus • Amaravati, AP
        </span>
      </div>
    </div>
  );
};
