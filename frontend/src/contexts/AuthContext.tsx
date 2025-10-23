import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 페이지 로드 시 로컬 스토리지에서 토큰 복구
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      // 토큰으로 사용자 정보 가져오기 (향후 구현)
      fetchUserProfile(token);
    } else {
      setIsLoading(false)
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('accessToken');
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { accessToken: newAccessToken, refreshToken, user: userData } = response.data;

      setAccessToken(newAccessToken);
      setUser(userData);
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      await api.post('/auth/register', {
        email,
        username,
        password,
      });

      // 회원가입 후 자동 로그인
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await api.post(
          '/auth/logout',
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const value = {
    user,
    accessToken,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
