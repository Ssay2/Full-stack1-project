const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  transactions: (token) => request('/transactions', { headers: { Authorization: `Bearer ${token}` } }),
  importCsv: (token, file) => {
    const form = new FormData(); form.append('file', file);
    return fetch(`${API_URL}/transactions/import`, { method: 'POST', body: form, headers: { Authorization: `Bearer ${token}` } }).then(async (response) => {
      const data = await response.json(); if (!response.ok) throw new Error(data.error); return data;
    });
  }
};