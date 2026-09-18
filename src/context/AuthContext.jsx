import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('poetica_token'));
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.getMe(token);
        setUser(res.user);
        setFavoriteIds(res.favoriteIds || []);
      } catch (err) {
        console.warn('Auto auth session expired');
        localStorage.removeItem('poetica_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await api.login({ identifier, password });
    localStorage.setItem('poetica_token', res.token);
    setToken(res.token);
    setUser(res.user);
    const me = await api.getMe(res.token);
    setFavoriteIds(me.favoriteIds || []);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('poetica_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setFavoriteIds([]);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('poetica_token');
    setToken(null);
    setUser(null);
    setFavoriteIds([]);
  };

  const updateProfile = async (updates) => {
    if (!token) return null;
    const res = await api.updateProfile(updates, token);
    setUser(res.user);
    return res.user;
  };

  const toggleFavoriteId = (poemId) => {
    setFavoriteIds(prev => 
      prev.includes(poemId) ? prev.filter(id => id !== poemId) : [...prev, poemId]
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      favoriteIds,
      login,
      register,
      logout,
      updateProfile,
      toggleFavoriteId
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
