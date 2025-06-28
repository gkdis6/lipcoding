import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '../services/api';

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
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 사용자 정보 로드
  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    // 먼저 localStorage에서 사용자 정보 확인
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setLoading(false);
        return;
      } catch (error) {
        console.warn('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }

    // localStorage에 사용자 정보가 없거나 파싱에 실패한 경우에만 API 호출
    try {
      const response = await userAPI.getMe();
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 로그인
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // 회원가입
  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Signup failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // 프로필 업데이트
  const updateUserProfile = async (profileData) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  // 사용자 정보 업데이트 (프로필 페이지용)
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    updateUserProfile,
    updateUser,
    isAuthenticated: !!token && !!user,
    isMentor: user?.role === 'mentor',
    isMentee: user?.role === 'mentee',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
