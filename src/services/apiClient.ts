const resolveApiBase = (): string => {
  if (typeof import.meta.env.VITE_API_BASE_URL === 'string') {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000') {
    return 'http://localhost:8080';
  }
  return '';
};

const BASE_URL = resolveApiBase();

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('vtop_live_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.token || null;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP ${response.status} from ${path}`);
  }

  return response.json();
}

// Student APIs
export const studentApi = {
  getProfile: () => apiRequest('/api/vtop/student/profile'),
  getKPIs: () => apiRequest('/api/vtop/student/kpis'),
  getSchedule: () => apiRequest('/api/vtop/student/schedule'),
  getAttendance: () => apiRequest('/api/vtop/student/attendance'),
  getAssignments: () => apiRequest('/api/vtop/student/assignments'),
  submitAssignment: (assignmentId: string, fileName: string) =>
    apiRequest(`/api/vtop/student/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ fileName }),
    }),
  getGrades: () => apiRequest('/api/vtop/student/grades'),
  getExams: () => apiRequest('/api/vtop/student/exams'),
  getPayments: () => apiRequest('/api/vtop/student/payments'),
};

// Faculty APIs
export const facultyApi = {
  getClasses: () => apiRequest('/api/vtop/faculty/classes'),
  getClassRoster: (classId: string) => apiRequest(`/api/vtop/faculty/classes/${classId}/roster`),
  postAttendance: (classId: string, payload: { studentId: string; status: 'present' | 'absent' | 'on_duty' }[]) =>
    apiRequest(`/api/vtop/faculty/classes/${classId}/attendance`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitGrade: (classId: string, payload: { studentId: string; assessmentType: string; score: number }) =>
    apiRequest(`/api/vtop/faculty/classes/${classId}/grades`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// Admin APIs
export const adminApi = {
  getKPIs: () => apiRequest('/api/vtop/admin/kpis'),
  getOutingRequests: (status?: string) =>
    apiRequest(`/api/vtop/admin/outings${status ? `?status=${status}` : ''}`),
  updateOutingStatus: (outingId: string, status: 'APPROVED' | 'REJECTED', comments?: string) =>
    apiRequest(`/api/vtop/admin/outings/${outingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comments }),
    }),
  getGatePasses: () => apiRequest('/api/vtop/admin/gatepasses'),
  verifyGatePass: (code: string) =>
    apiRequest('/api/vtop/admin/gatepass/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
  getSystemAuditLogs: () => apiRequest('/api/vtop/admin/logs'),
};

// Feedback APIs
export const feedbackApi = {
  getActiveForms: () => apiRequest('/api/vtop/feedback/forms'),
  submitFeedback: (payload: { formId: string; facultyId: string; ratings: Record<string, number>; comments?: string }) =>
    apiRequest('/api/vtop/feedback/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
