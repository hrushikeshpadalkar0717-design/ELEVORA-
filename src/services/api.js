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
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Auth: Register
  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    if (data.token) {
      localStorage.setItem('elevora_auth_token', data.token);
    }
    return data;
  },

  // Auth: Login
  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (data.token) {
      localStorage.setItem('elevora_auth_token', data.token);
    }
    return data;
  },

  // Auth: Google Login
  async googleAuth(payload) {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Google authentication failed');
    if (data.token) {
      localStorage.setItem('elevora_auth_token', data.token);
    }
    return data;
  },

  // Auth: LinkedIn Login
  async linkedinAuth(payload) {
    const res = await fetch(`${API_BASE_URL}/auth/linkedin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'LinkedIn authentication failed');
    if (data.token) {
      localStorage.setItem('elevora_auth_token', data.token);
    }
    return data;
  },

  // Auth: Get Current Profile
  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    return await res.json();
  },

  // Auth: Update Profile
  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
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
    });
    if (!res.ok) throw new Error('Failed to fetch resumes');
    return await res.json();
  },

  // Resumes: Create or Save
  async saveResume(resumeData) {
    const res = await fetch(`${API_BASE_URL}/resumes`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Resume upload failed');
    return data;
  },
};
