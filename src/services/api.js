// ─────────────────────────────────────────────────────────────
//  ELEVORA – Frontend API Service
//  Connects to Node.js / Express backend with MongoDB Atlas
// ─────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('elevora_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Check Backend Health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        credentials: 'include',
      });
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Auth: Register (Local)
  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    if (data.token) {
      localStorage.setItem('elevora_auth_token', data.token);
    }
    return data;
  },

  // Auth: Login (Local)
  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (data.token) {
      localStorage.setItem('elevora_auth_token', data.token);
    }
    return data;
  },

  // Auth: Logout (Clears HttpOnly cookie & local token)
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout server notice:', err.message);
    } finally {
      localStorage.removeItem('elevora_auth_token');
    }
    return { success: true };
  },

  // OAuth: URL Generators for Authorization Code Flow
  getGoogleAuthUrl(clientOrigin = window.location.origin) {
    return `${API_BASE_URL}/auth/google?client_url=${encodeURIComponent(clientOrigin)}`;
  },

  getLinkedInAuthUrl(clientOrigin = window.location.origin) {
    return `${API_BASE_URL}/auth/linkedin?client_url=${encodeURIComponent(clientOrigin)}`;
  },

  // Auth: Get Current Profile
  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Not authenticated');
    }
    return await res.json();
  },

  // Auth: Update Profile
  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  // Resumes: Get All
  async getResumes() {
    const res = await fetch(`${API_BASE_URL}/resumes`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch resumes');
    return await res.json();
  },

  // Resumes: Create or Save
  async saveResume(resumeData) {
    const res = await fetch(`${API_BASE_URL}/resumes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(resumeData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save resume');
    return data;
  },

  // Resumes: Update
  async updateResume(id, resumeData) {
    const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(resumeData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update resume');
    return data;
  },

  // Resumes: Delete
  async deleteResume(id) {
    const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete resume');
    return data;
  },

  // Resume Upload & Extraction
  async uploadAndExtractResume(file) {
    const formData = new FormData();
    formData.append('resume', file);

    const token = localStorage.getItem('elevora_auth_token');
    const res = await fetch(`${API_BASE_URL}/upload/resume`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Resume upload failed');
    return data;
  },
};
