import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // 로그인 후 원래 페이지로 돌아가기 위해 현재 위치 저장
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려 할 때 프로필로 이동
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
