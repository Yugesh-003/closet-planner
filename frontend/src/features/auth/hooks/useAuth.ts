import { useState, useEffect } from 'react';
import apiClient from '../../../lib/api';

interface User {
  userId: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('idToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    // Dev mode: bypass for test account
    if (email === 'test@test.com' && password === 'Test1234') {
      const userData = { userId: 'test-user-123', email, name };
      localStorage.setItem('idToken', 'dev-token');
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { message: 'Test account logged in' };
    }

    const response = await apiClient.post('/auth/signup', { email, password, name });
    return response.data;
  };

  const login = async (email: string, password: string) => {
    // Dev mode: bypass for test account
    if (email === 'test@test.com' && password === 'Test1234') {
      const userData = { userId: 'test-user-123', email, name: 'Test User' };
      localStorage.setItem('idToken', 'dev-token');
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { message: 'Test account logged in' };
    }

    const response = await apiClient.post('/auth/login', { email, password });
    const { idToken, accessToken } = response.data;
    
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('accessToken', accessToken);
    
    // Decode token to get user info (simplified)
    const userData = { userId: 'user-id', email, name: email.split('@')[0] };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    signup,
    login,
    logout,
  };
}
