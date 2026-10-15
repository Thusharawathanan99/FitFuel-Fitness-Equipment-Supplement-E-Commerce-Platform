/**
 * Transport layer connecting to the Node.js / Express Backend REST API.
 * Handles JWT Authorization Bearer headers, automatic JSON serialization,
 * and fallback utilities.
 */
export const API_BASE = 'http://localhost:5000/api';
const LATENCY = 150;

export const ok = (data, ms = LATENCY) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const fail = (message, ms = LATENCY) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('fitfuel:token');
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'API request failed');
    }
    return json;
  } catch (err) {
    console.warn(`[API Network Note] ${endpoint}:`, err.message);
    throw err;
  }
};
