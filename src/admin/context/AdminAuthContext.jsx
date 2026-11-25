import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../../api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('ber_admin_token') : null;
  });

  const [admin, setAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('ber_admin_user');
      try {
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = sessionStorage.getItem('ber_admin_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data?.admin) {
            setAdmin(res.data.admin);
            sessionStorage.setItem('ber_admin_user', JSON.stringify(res.data.admin));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data?.token) {
      const { token: jwtToken, admin: adminData } = res.data;
      
      // Store in Session Storage (as required)
      sessionStorage.setItem('ber_admin_token', jwtToken);
      sessionStorage.setItem('ber_admin_user', JSON.stringify(adminData));

      setToken(jwtToken);
      setAdmin(adminData);
      return res;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const logout = () => {
    sessionStorage.removeItem('ber_admin_token');
    sessionStorage.removeItem('ber_admin_user');
    setToken(null);
    setAdmin(null);
  };

  const value = {
    token,
    admin,
    isAuthenticated: Boolean(token && admin),
    loading,
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
