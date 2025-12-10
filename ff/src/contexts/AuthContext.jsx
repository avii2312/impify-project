import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Check authentication on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Activity tracking for auto-logout
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  // Auto-logout on inactivity (30 minutes)
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const inactivityLimit = 30 * 60 * 1000; // 30 minutes

      if (timeSinceActivity > inactivityLimit && isAuthenticated) {
        logout('Session expired due to inactivity');
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastActivity, isAuthenticated]);

  // Auto-refresh token before expiration (every 6 days for 7-day tokens)
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      try {
        const result = await refreshToken();
        if (result.success) {
          console.log('Token refreshed automatically');
        }
      } catch (error) {
        console.error('Auto token refresh failed:', error);
      }
    }, 6 * 24 * 60 * 60 * 1000); // Refresh every 6 days

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      // Check both localStorage and sessionStorage for token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const adminToken = localStorage.getItem('admin_token');
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

      if (!token && !adminToken) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const response = await axiosInstance.get('/auth/verify');
      const { valid, user: verifiedUser } = response.data;

      if (valid) {
        setUser(verifiedUser);
        setIsAuthenticated(true);
        // Update stored user data in the same storage as the token
        if (localStorage.getItem('token')) {
          localStorage.setItem('user', JSON.stringify(verifiedUser));
        } else if (sessionStorage.getItem('token')) {
          sessionStorage.setItem('user', JSON.stringify(verifiedUser));
        }

        // Check consent status
        await checkConsentStatus();
      } else {
        // Token invalid, clear storage
        logout('Session expired');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // If token verification fails, clear storage
      logout('Session expired');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      // Store based on remember me preference
      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      // Set authorization header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      setIsAuthenticated(true);
      setLastActivity(Date.now());

      // ✅ FIX: Call post-login initialization in background (don't await)
      // This handles streak/XP updates, user stats creation, etc.
      // Without blocking the login response
      axiosInstance.post('/auth/post-login-init').catch(err => {
        console.log('Post-login init (non-critical):', err.message);
      });

      // Check consent status after login
      await checkConsentStatus();

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, username) => {
    try {
      setIsLoading(true);
      await axiosInstance.post('/auth/register', {
        email,
        password,
        name: username,
      });

      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await axiosInstance.post('/auth/forgot-password', {
        email,
      });

      return { success: true };
    } catch (error) {
      console.error('Forgot password failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await axiosInstance.post('/auth/reset-password', {
        token,
        new_password: newPassword,
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password'
      };
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    // Update stored user data
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const mergedData = { ...userData, ...updatedUserData };
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(mergedData));
      } else if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(mergedData));
      }
    }
  };

  const logout = (message = 'Logged out successfully') => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    // Clear authorization header
    delete axiosInstance.defaults.headers.common['Authorization'];

    setUser(null);
    setIsAuthenticated(false);
    setHasConsented(false);
    setIsLoading(false);

    if (message !== 'Session expired') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  // Refresh token if needed
  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh');
      const { token, user: userData } = response.data;

      // Update stored token and user data
      const currentToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (localStorage.getItem('token')) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      } else if (sessionStorage.getItem('token')) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      // Update axios default header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update context state
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout('Session expired');
      return { success: false };
    }
  };

  // Check consent status
  const checkConsentStatus = async () => {
    try {
      const response = await axiosInstance.get('/consent/status');
      const { consented } = response.data;
      setHasConsented(consented);
      return consented;
    } catch (error) {
      console.error('Consent status check failed:', error);
      // Default to false if check fails
      setHasConsented(false);
      return false;
    }
  };

  // Update consent
  const updateConsent = async (consented) => {
    try {
      await axiosInstance.post('/consent/update', {
        consented,
        consent_text: consented ? 'I consent to AI processing and anonymous data collection for service improvement' : 'Declined AI processing consent'
      });
      setHasConsented(consented);
      return { success: true };
    } catch (error) {
      console.error('Consent update failed:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to update consent' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    hasConsented,
    login,
    register,
    logout,
    refreshToken,
    checkAuthStatus,
    updateUser,
    forgotPassword,
    resetPassword,
    checkConsentStatus,
    updateConsent,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};