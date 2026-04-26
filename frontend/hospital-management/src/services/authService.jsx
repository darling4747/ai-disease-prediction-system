const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

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
    
    // Store user data
    localStorage.setItem('user', JSON.stringify({
      email: data.email,
      role: data.role,
      token: data.token,
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName
    }));
    
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
    
    // Auto-login after registration
    localStorage.setItem('user', JSON.stringify({
      email: userData.email,
      role: userData.role,
      token: data.token,
      userId: data.userId
    }));
    
    return data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
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
