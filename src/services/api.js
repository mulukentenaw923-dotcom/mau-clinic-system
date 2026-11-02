const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function readApiResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    if (!response.ok) throw new Error(`API request failed with status ${response.status}.`);
    throw new Error('The server returned an invalid response.');
  }
}

export async function apiRequest(path, options = {}) {
  const baseUrl = API_BASE_URL || `${window.location.origin}/api/`;
  const token = window.localStorage.getItem('token');

  const response = await fetch(new URL(path, `${baseUrl.replace(/\/+$/, '')}/`), {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const result = await readApiResponse(response);
  if (!response.ok) throw new Error(result.error || result.message || `API request failed with status ${response.status}.`);
  return result;
}
