import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/profile';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // 입력 시 에러 메시지 제거
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success) {
        // 로그인 성공 후 프로필 페이지로 이동
        const redirectPath = location.state?.from?.pathname || '/profile';
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>로그인</h1>
        </div>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            data-testid="email-input"
            required
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            data-testid="password-input"
            required
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <button
          type="submit"
          id="login"
          className="btn btn-primary"
          data-testid="login-button"
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          계정이 없으신가요?{' '}
          <Link to="/signup" style={{ color: '#3498db' }}>
            회원가입
          </Link>
        </p>
      </div>

      {/* 테스트 계정 정보 */}
      <div className="test-accounts">
        <h3>테스트 계정</h3>
        <div>
          <p>
            <strong>멘토:</strong> mentor1@example.com / password123
          </p>
          <p>
            <strong>멘티:</strong> mentee1@example.com / password123
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
