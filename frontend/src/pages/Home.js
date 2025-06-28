import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // 인증된 사용자는 프로필 페이지로 리디렉션
      navigate('/profile');
    } else {
      // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 로딩 중 표시할 내용 (리디렉션 전까지)
  return (
    <div className="page-container">
      <div style={{ textAlign: 'center' }}>
        <p>로딩 중...</p>
      </div>
    </div>
  );
};

export default Home;
