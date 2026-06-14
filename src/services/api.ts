// ============================================
// DermaScan — Central API Client
// ============================================

// Use environment variable for API URL in production, fallback to localhost for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`;

function getHeaders(isMultipart = false): HeadersInit {
  const headers: Record<string, string> = {};
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = localStorage.getItem('dermascan_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Prevent browser caching of API responses (crucial for clean state between user logins)
  headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  headers['Pragma'] = 'no-cache';
  
  return headers;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = 'An error occurred. Please try again.';
    try {
      const errorData = await response.json();
      if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((e: any) => e.msg || e.message || JSON.stringify(e)).join('. ');
      } else if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Ignore JSON parse errors for non-JSON error pages
    }
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) return null;
  return response.json();
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds (handles Render cold start)
const UPLOAD_TIMEOUT = 60000;  // 60 seconds for image uploads

async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number }): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. Please check if the backend server is running.');
    }
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error('Unable to connect to server. Please ensure the backend is running on port 8000.');
    }
    throw err;
  }
}

export const api = {
  async get<T>(endpoint: string, timeout = DEFAULT_TIMEOUT): Promise<T> {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
      timeout,
    });
    return handleResponse(response);
  },

  async post<T>(endpoint: string, body: any, timeout = DEFAULT_TIMEOUT): Promise<T> {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
      timeout,
    });
    return handleResponse(response);
  },

  async put<T>(endpoint: string, body: any, timeout = DEFAULT_TIMEOUT): Promise<T> {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
      timeout,
    });
    return handleResponse(response);
  },

  async postMultipart<T>(endpoint: string, formData: FormData, timeout = UPLOAD_TIMEOUT): Promise<T> {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
      timeout,
    });
    return handleResponse(response);
  },
};
