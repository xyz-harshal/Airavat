/**
 * API Client for making requests to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Base fetch function with common options
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth token to headers if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    // Parse the JSON response
    const data = await response.json();
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Auth API functions
 */
export const auth = {
  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      const data = await fetchAPI('/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          username: "",
        }),
      });
      
      return { 
        success: true, 
        token: data.token, 
        username: data.username 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || "Invalid email or password" 
      };
    }
  },
  
  /**
   * Register user
   */
  register: async (username, email, password) => {
    try {
      const data = await fetchAPI('/user/register', {
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      
      return { 
        success: true, 
        token: data.token, 
        username: data.username 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || "Email already exists or invalid data" 
      };
    }
  },
  
  /**
   * Logout user
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const token = localStorage.getItem('token');
    return !!token;
  },
  
  /**
   * Get current user
   */
  getCurrentUser: () => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    return {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token'),
    };
  }
};

/**
 * Additional API endpoints can be organized by feature
 */
export const api = {
  auth,
  // Add other API endpoints here
};

export default api;
