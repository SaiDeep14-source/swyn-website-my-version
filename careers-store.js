export const CAREERS_STORAGE_KEY = 'swyn-careers-roles-v1';
export const CAREERS_ADMIN_PASSCODE_KEY = 'swyn-careers-admin-passcode-v1';
export const CAREERS_ADMIN_SESSION_KEY = 'swyn-careers-admin-session-v1';

export const defaultJobs = [
  {
    id: 'fractional-cfo',
    title: 'Fractional CFO',
    team: 'Finance',
    summary: 'Support founder-led companies through fundraising, cash planning, board reporting, and sharper financial decision-making.',
    location: 'India / Remote',
    workMode: 'Remote',
    employmentType: 'Fractional',
    applyUrl: '',
    status: 'open',
    createdAt: '2026-03-20T09:00:00.000Z',
  },
  {
    id: 'client-success-lead',
    title: 'Client Success Lead',
    team: 'Operations',
    summary: 'Own client communication, expert coordination, and mandate delivery to make every SWYN engagement feel precise and high-touch.',
    location: 'Mumbai / Hybrid',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    applyUrl: '',
    status: 'open',
    createdAt: '2026-03-18T09:00:00.000Z',
  },
  {
    id: 'growth-partnerships-manager',
    title: 'Growth Partnerships Manager',
    team: 'Marketing',
    summary: 'Build strategic channels, founder relationships, and partnerships that consistently open high-quality demand for SWYN.',
    location: 'India / Remote',
    workMode: 'Remote',
    employmentType: 'Full-time',
    applyUrl: '',
    status: 'open',
    createdAt: '2026-03-16T09:00:00.000Z',
  },
];

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function sortJobs(jobs) {
  return [...jobs].sort((a, b) => {
    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

export function sanitizeJob(job) {
  const now = new Date().toISOString();
  return {
    id: job.id || createJobId(job.title),
    title: (job.title || '').trim(),
    team: (job.team || '').trim() || 'General',
    summary: (job.summary || '').trim(),
    location: (job.location || '').trim() || 'Remote',
    workMode: (job.workMode || '').trim() || 'Remote',
    employmentType: (job.employmentType || '').trim() || 'Full-time',
    applyUrl: (job.applyUrl || '').trim(),
    status: job.status === 'draft' ? 'draft' : 'open',
    createdAt: job.createdAt || now,
  };
}

export function readJobs() {
  if (!canUseStorage()) {
    return sortJobs(defaultJobs);
  }

  const raw = window.localStorage.getItem(CAREERS_STORAGE_KEY);
  if (!raw) {
    return sortJobs(defaultJobs);
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return sortJobs(defaultJobs);
    }
    return sortJobs(parsed.map(sanitizeJob));
  } catch (error) {
    console.warn('Failed to parse careers data, falling back to defaults.', error);
    return sortJobs(defaultJobs);
  }
}

export function writeJobs(jobs) {
  if (!canUseStorage()) {
    return;
  }
  const cleaned = sortJobs(jobs.map(sanitizeJob));
  window.localStorage.setItem(CAREERS_STORAGE_KEY, JSON.stringify(cleaned));
}

export function getPublishedJobs() {
  return readJobs().filter((job) => job.status === 'open');
}

export function createJobId(title = 'role') {
  return `${title}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `role-${Date.now()}`;
}

export function getTeams(jobs = readJobs()) {
  const teams = new Set(jobs.map((job) => job.team).filter(Boolean));
  return ['View all', ...Array.from(teams)];
}
