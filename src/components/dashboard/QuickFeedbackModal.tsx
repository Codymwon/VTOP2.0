import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Bug,
  Sparkles,
  Zap,
  Layout,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FeedbackCategory } from '../../types/feedback';
import { addPortalFeedback } from '../../services/mockFeedbackService';

interface QuickFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmitted?: () => void;
  initialModule?: string;
}

const CATEGORIES: { id: FeedbackCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'ui_bug', label: 'UI Bug', icon: Bug },
  { id: 'visual_glitch', label: 'Visual Glitch', icon: AlertCircle },
  { id: 'feature_request', label: 'Feature Request', icon: Sparkles },
  { id: 'performance', label: 'Speed & Lag', icon: Zap },
  { id: 'usability', label: 'Usability / UX', icon: Layout },
  { id: 'general', label: 'General', icon: MessageSquare },
];

const MODULE_OPTIONS = [
  'General Portal UI',
  'Academics / Courses',
  'Digital Assignments',
  'Class Attendance',
  'Time Table',
  'Examinations (Marks & Grades)',
  'Hostel & Gate Pass',
  'Finance & Receipts',
  'Student Profile',
];

export const QuickFeedbackModal: React.FC<QuickFeedbackModalProps> = ({
  isOpen,
  onClose,
  onFeedbackSubmitted,
  initialModule = 'General Portal UI',
}) => {
  const { user } = useAuth();
  const [category, setCategory] = useState<FeedbackCategory>('ui_bug');
  const [targetModule, setTargetModule] = useState(initialModule);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please provide both a summary title and detailed feedback.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      addPortalFeedback({
        userRegNo: user?.id || '23BCE1088',
        userName: user?.name || 'Student User',
        role: user?.role || 'student',
        category,
        targetModule,
        rating,
        title: title.trim(),
        description: description.trim(),
        deviceInfo: typeof navigator !== 'undefined' ? `${navigator.userAgent.slice(0, 50)}...` : 'Web Browser',
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      onFeedbackSubmitted?.();

      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setDescription('');
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#176CB8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                VTOP 2.0 Telemetry
              </span>
              <span className="text-xs text-slate-500 font-semibold">User Experience Feedback</span>
            </div>
            <h2 id="feedback-dialog-title" className="text-base font-bold text-slate-900 mt-1">
              Share Your Portal UI Feedback
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback dialog"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#176CB8] cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Thank You for Your Feedback!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your report has been received and routed to the VTOP Engineering & UX administration desk.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Feedback Category Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[#183668] text-white border-[#183668] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-200' : 'text-slate-500'}`} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Module & Satisfaction Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="feedback-target-module" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Affected Screen / Module
                  </label>
                  <select
                    id="feedback-target-module"
                    value={targetModule}
                    onChange={(e) => setTargetModule(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] text-slate-800"
                  >
                    {MODULE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Experience Rating
                  </label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} star out of 5`}
                        className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            (hoverRating || rating) >= star
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 font-mono ml-2">
                      {rating} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="feedback-title" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Summary / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="feedback-title"
                  type="text"
                  placeholder="e.g. Button cut off on tablet view, or suggestion for timetable export..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="feedback-description" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Feedback / Bug Steps <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="feedback-description"
                  rows={3}
                  placeholder="Describe what happened, what you expected, or how this design could be improved..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176CB8] focus:bg-white text-slate-900"
                  required
                />
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#176CB8] hover:bg-[#135796] rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Feedback</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
