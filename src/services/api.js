const API_BASE = '/api';

export const api = {
  // Auth
  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch author profile');
    return data;
  },

  async updateProfile(updates, token) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  // Poems
  async generatePoem(params) {
    const res = await fetch(`${API_BASE}/poems/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate poem');
    return data;
  },

  async remixPoem(poem, remixType) {
    const res = await fetch(`${API_BASE}/poems/remix`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poem, remixType })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remix poem');
    return data;
  },

  async translatePoem(poem, targetLanguage) {
    const res = await fetch(`${API_BASE}/poems/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poem, targetLanguage })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to translate poem');
    return data;
  },

  async explainPoem(poem) {
    const res = await fetch(`${API_BASE}/poems/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poem })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to analyze poem');
    return data;
  },

  async assistPoem(action, text, context = '') {
    const res = await fetch(`${API_BASE}/poems/assist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, text, context })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to assist');
    return data;
  },

  async generateTitles(poem) {
    const res = await fetch(`${API_BASE}/poems/titles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poem })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate titles');
    return data;
  },

  async analyzeLine(line, mode = 'improve') {
    const res = await fetch(`${API_BASE}/poems/line-lab`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line, mode })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to analyze line');
    return data;
  },

  async completeThought(seed) {
    const res = await fetch(`${API_BASE}/poems/complete-thought`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to complete thought');
    return data;
  },

  async getLibraryPoems(params = {}, token) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/poems?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch library');
    return data;
  },

  async getPoem(id, token = null) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/poems/${id}`, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch poem');
    return data;
  },

  async savePoem(poemData, token) {
    const res = await fetch(`${API_BASE}/poems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(poemData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save poem');
    return data;
  },

  async updatePoem(id, updates, token) {
    const res = await fetch(`${API_BASE}/poems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update poem');
    return data;
  },

  async deletePoem(id, token) {
    const res = await fetch(`${API_BASE}/poems/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete poem');
    return data;
  },

  async toggleFavorite(id, token) {
    const res = await fetch(`${API_BASE}/poems/${id}/favorite`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async toggleLike(id, token) {
    const res = await fetch(`${API_BASE}/poems/${id}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Collections
  async getCollections(token) {
    const res = await fetch(`${API_BASE}/collections`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async createCollection(data, token) {
    const res = await fetch(`${API_BASE}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateCollection(id, data, token) {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteCollection(id, token) {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Explore & Community
  async getExplorePoems(params = {}, token = null) {
    const query = new URLSearchParams(params).toString();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/explore?${query}`, { headers });
    return res.json();
  },

  async reportPoem(id, reason, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/explore/${id}/report`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  // Prompts
  async getPrompts() {
    const res = await fetch(`${API_BASE}/prompts`);
    return res.json();
  },

  async generatePrompt(params) {
    const res = await fetch(`${API_BASE}/prompts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  }
};
