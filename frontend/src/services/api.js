const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Register a new patient ───────────────────────────────────────
export const registerPatient = async (formData) => {
  const res = await fetch(`${BASE_URL}/patients/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return res.json();
};

// ─── Lookup returning patient by UHID ────────────────────────────
export const getPatientByUHID = async (uhid) => {
  const res = await fetch(`${BASE_URL}/patients/${uhid}`);
  return res.json();
};

// ─── Submit symptoms → get token + department ─────────────────────
export const createVisit = async (visitData) => {
  const res = await fetch(`${BASE_URL}/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitData),
  });
  return res.json();
};

// ─── Staff dashboard — today's queue ─────────────────────────────
export const getStaffQueue = async () => {
  const res = await fetch(`${BASE_URL}/staff/queue`);
  return res.json();
};

// ─── Admin dashboard — aggregated stats ──────────────────────────
export const getAdminStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/stats`);
  return res.json();
};
