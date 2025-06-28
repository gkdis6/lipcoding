import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout, isAuthenticated, isMentor, isMentee } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            멘토-멘티 매칭
          </Link>
          <div className="nav-menu">
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              로그인
            </Link>
            <Link 
              to="/signup" 
              className={`nav-link ${isActive('/signup') ? 'active' : ''}`}
            >
              회원가입
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          멘토-멘티 매칭
        </Link>
        <div className="nav-menu">
          {isMentee && (
            <Link 
              to="/mentors" 
              className={`nav-link ${isActive('/mentors') ? 'active' : ''}`}
            >
              멘토 찾기
            </Link>
          )}
          <Link 
            to="/requests" 
            className={`nav-link ${isActive('/requests') ? 'active' : ''}`}
          >
            {isMentor ? '받은 요청' : '보낸 요청'}
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            프로필
          </Link>
          <div className="nav-user">
            <span className="user-greeting">
              {user?.name}님 ({user?.role === 'mentor' ? '멘토' : '멘티'})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
