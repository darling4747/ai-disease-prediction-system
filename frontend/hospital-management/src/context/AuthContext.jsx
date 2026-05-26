import React, { createContext, useContext, useState, useCallback } from 'react';
import authService, { normalizeRole } from '../services/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      const userData = {
        id: data.userId,
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: normalizeRole(data.role),
        token: data.token
      };
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    authService.logout();
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      const newUser = {
        id: data.userId,
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: normalizeRole(data.role),
        token: data.token
      };
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Role checking helpers
  const isAdmin = useCallback(() => user?.role === 'ADMIN', [user]);
  const isDoctor = useCallback(() => user?.role === 'DOCTOR', [user]);
  const isPatient = useCallback(() => user?.role === 'PATIENT', [user]);
  const hasRole = useCallback((role) => user?.role === normalizeRole(role), [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        isAdmin,
        isDoctor,
        isPatient,
        hasRole,
        role: user?.role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
