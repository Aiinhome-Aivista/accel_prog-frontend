import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  id: number; // Add user ID
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user_data');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic check for token/user on mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user_data');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token?: string) => { // userData now includes id
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_name', userData.name); // Keep for compatibility if needed
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_name');
    localStorage.removeItem('token');
    localStorage.removeItem('app_view'); // Cleanup old routing state if any
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
