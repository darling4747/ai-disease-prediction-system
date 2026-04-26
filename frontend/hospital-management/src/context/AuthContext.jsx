import React, { createContext, useContext, useState, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      const userData = {
        id: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        token: data.token
      };
      setUser(userData);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(userData);
      const newUser = {
        id: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        token: data.token
      };
      setUser(newUser);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
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
