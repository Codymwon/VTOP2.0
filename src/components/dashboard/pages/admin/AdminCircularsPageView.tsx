import React, { useState } from 'react';
import { PageBreadcrumbHeader } from '../PageBreadcrumbHeader';
import { MOCK_ADMIN_CIRCULARS } from '../../../../services/mockAdminService';
import { EmergencyCircular } from '../../../../types/admin';
import {
  Radio,
  Plus,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface AdminCircularsPageViewProps {
  onBackToDashboard: () => void;
}

export const AdminCircularsPageView: React.FC<AdminCircularsPageViewProps> = ({
  onBackToDashboard,
}) => {
  const [circulars, setCirculars] = useState<EmergencyCircular[]>(MOCK_ADMIN_CIRCULARS);
  const [isDrafting, setIsDrafting] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<'All University' | 'All Students' | 'All Faculty' | 'Hostellers Only'>('All University');
  const [priority, setPriority] = useState<'Emergency' | 'Urgent' | 'Info'>('Urgent');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const newCirc: EmergencyCircular = {
      id: `circ-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim() || summary.trim(),
      targetAudience,
      priority,
      publishedAt: 'Today, Just Now',
      publishedBy: 'Dr. S. K. Narayanan (Registrar)',
      isActive: true,
      acknowledgedCount: 0,
    };

    setCirculars((prev) => [newCirc, ...prev]);
    setIsDrafting(false);
    setTitle('');
    setSummary('');
    setContent('');
    setToastMessage(`Broadcast circular "${newCirc.title}" successfully published.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRevoke = (id: string) => {
    setCirculars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: false } : c))
    );
    setToastMessage('Circular revoked and removed from live campus spotlight.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageBreadcrumbHeader
        category="Broadcast & Media"
        title="Campus Circulars & Emergency Broadcast Publisher"
        subtitle="Publish High-Priority Bulletins, Campus Spotlight Alerts, and Weather Advisories"
        onBackToDashboard={onBackToDashboard}
        onPrint={() => window.print()}
        extraActions={
          <button
            type="button"
            onClick={() => setIsDrafting(!isDrafting)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>{isDrafting ? 'Cancel Draft' : 'New Broadcast'}</span>
          </button>
        }
      />

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Composer Drawer */}
      {isDrafting && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl p-5 border border-purple-200 shadow-xs space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-600" aria-hidden="true" />
              <span>Compose Official University Broadcast</span>
            </h2>
            <span className="text-xs text-slate-500">
              Authority: Dr. S. K. Narayanan (Office of the Registrar)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="circ-headline"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Circular Title / Headline
              </label>
              <input
                id="circ-headline"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advisory on Weather Alert & Evening Movement Restrictions"
                className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-semibold"
              />
            </div>

            <div>
              <label
                htmlFor="circ-prio"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Alert Priority
              </label>
              <select
                id="circ-prio"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as 'Emergency' | 'Urgent' | 'Info')
                }
                className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-bold"
              >
                <option value="Urgent">Urgent Alert</option>
                <option value="Emergency">Emergency (High Impact)</option>
                <option value="Info">General Circular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="circ-target-aud"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Target Audience
              </label>
              <select
                id="circ-target-aud"
                value={targetAudience}
                onChange={(e) =>
                  setTargetAudience(
                    e.target.value as 'All University' | 'All Students' | 'All Faculty' | 'Hostellers Only'
                  )
                }
                className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="All University">All University (Campus Wide)</option>
                <option value="All Students">All Students</option>
                <option value="Hostellers Only">Hostel Residents Only</option>
                <option value="All Faculty">All Teaching Faculty</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="circ-summary-input"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Short Spotlight Summary
              </label>
              <input
                id="circ-summary-input"
                type="text"
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief 1-line ticker summary shown on banners..."
                className="w-full px-3 py-2 min-h-[44px] text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="circ-content-input"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Detailed Circular Directives
            </label>
            <textarea
              id="circ-content-input"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full directive details, reporting helpline numbers, and operational changes..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDrafting(false)}
              className="px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 min-h-[44px] rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-[0.98] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Broadcast Immediately</span>
            </button>
          </div>
        </form>
      )}

      {/* Circulars Archive */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Active Campus Bulletins ({circulars.length})
        </h2>

        <div className="space-y-3">
          {circulars.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-xl border transition-all ${
                c.isActive
                  ? 'bg-slate-50 border-slate-200/90'
                  : 'bg-slate-100/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        c.priority === 'Emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : c.priority === 'Urgent'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.priority}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Target: {c.targetAudience}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">{c.summary}</p>
                  <p className="text-xs text-slate-500">{c.content}</p>

                  <div className="text-[10px] text-slate-500 pt-1 tabular-nums">
                    Published {c.publishedAt} by {c.publishedBy} • {c.acknowledgedCount?.toLocaleString()} reads
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {c.isActive ? (
                    <button
                      type="button"
                      onClick={() => handleRevoke(c.id)}
                      className="px-3.5 py-2 min-h-[44px] rounded-xl bg-white border border-rose-200 text-rose-800 hover:bg-rose-50 active:scale-[0.98] text-xs font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                    >
                      Revoke Notice
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Revoked</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
