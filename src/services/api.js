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

  // Auth: Forgot Password (request email reset link)
  async forgotPassword(email) {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to request password reset');
    return data;
  },

  // Auth: Reset Password (using token from email link)
  async resetPassword(token, password) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password/${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reset password');
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
  getGoogleAuthUrl(clientOrigin = window.location.origin, options = {}) {
    const params = new URLSearchParams({ client_url: clientOrigin });
    if (options.prompt) params.append('prompt', options.prompt);
    return `${API_BASE_URL}/auth/google?${params.toString()}`;
  },

  getLinkedInAuthUrl(clientOrigin = window.location.origin, options = {}) {
    const params = new URLSearchParams({ client_url: clientOrigin });
    if (options.prompt) params.append('prompt', options.prompt);
    return `${API_BASE_URL}/auth/linkedin?${params.toString()}`;
  },

  // OAuth: Exchange one-time authorization code for session
  async exchangeOAuthCode(code) {
    const res = await fetch(`${API_BASE_URL}/auth/oauth-exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'OAuth verification failed');
    if (data.token) {
      localStorage.setItem('elevora_auth_token', data.token);
    }
    return data;
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

  // OAuth: Direct OAuth payload handler (fallback if called programmatically)
  async googleAuth(payload) {
    if (payload?.token) {
      localStorage.setItem('elevora_auth_token', payload.token);
      return await this.getMe();
    }
    return payload;
  },

  async linkedinAuth(payload) {
    if (payload?.token) {
      localStorage.setItem('elevora_auth_token', payload.token);
      return await this.getMe();
    }
    return payload;
  },

  // Resumes: Get All
  async getResumes() {
    const res = await fetch(`${API_BASE_URL}/resumes`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch resumes');
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((r) => ({
        ...r,
        id: r.id || r._id,
        name: r.name || r.title || 'My Professional Resume',
      }));
    }
    return data;
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
    return {
      ...data,
      id: data.id || data._id,
      name: data.name || data.title,
    };
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
    return {
      ...data,
      id: data.id || data._id,
      name: data.name || data.title,
    };
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

  // Resumes: Batch Sync
  async syncResumes(resumes) {
    const res = await fetch(`${API_BASE_URL}/resumes/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ resumes }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to sync resumes');
    if (Array.isArray(data)) {
      return data.map((r) => ({
        ...r,
        id: r.id || r._id,
        name: r.name || r.title || 'My Professional Resume',
      }));
    }
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

  // ─── Razorpay Payment Integration ─────────────────────────────────────────

  // Get Razorpay configuration (Public Key & Server Plans)
  async getPaymentConfig() {
    const res = await fetch(`${API_BASE_URL}/payments/config`, {
      credentials: 'include',
    });
    return await res.json();
  },

  // Create Razorpay payment order for selected plan
  async createPaymentOrder(planId) {
    const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to initialize payment order');
    return data;
  },

  // Verify Razorpay payment signature on backend
  async verifyPayment(verificationData) {
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(verificationData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Payment signature verification failed');
    return data;
  },

  // Get current user plan and payment history
  async getMyPlanStatus() {
    const res = await fetch(`${API_BASE_URL}/payments/my-status`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch plan status');
    return data;
  },
};
