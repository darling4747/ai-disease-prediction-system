import { getApiBaseUrl } from './apiConfig';

const API_URL = getApiBaseUrl();

export const normalizeRole = (role) => {
  if (!role) return 'PATIENT';
  return role.toString().replace('ROLE_', '').trim().toUpperCase();
};

const persistUser = (data) => {
  const user = {
    id: data.userId || data.id,
    userId: data.userId || data.id,
    email: data.email,
    role: normalizeRole(data.role),
    token: data.token,
    firstName: data.firstName,
    lastName: data.lastName
  };
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

const authService = {
  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    persistUser(data);
    
    return data;
  },

  // Register user
  register: async (userData) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    
    persistUser(data);
    
    return data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    const user = JSON.parse(userStr);
    return {
      ...user,
      id: user.id || user.userId,
      userId: user.userId || user.id,
      role: normalizeRole(user.role)
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user && !!user.token;
  },

  // Get auth token
  getToken: () => {
    const user = authService.getCurrentUser();
    return user ? user.token : null;
  }
};

export default authService;
