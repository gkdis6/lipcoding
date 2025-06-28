import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: '',
    bio: '',
    skills: '',
    experience_years: 0,
    hourly_rate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'experience_years' ? parseInt(value) || 0 : value
    });
    setError(''); // 입력 시 에러 메시지 제거
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 멘토인 경우 hourly_rate를 숫자로 변환
    const submitData = {
      ...formData,
      hourly_rate: formData.role === 'mentor' && formData.hourly_rate 
        ? parseFloat(formData.hourly_rate) 
        : null
    };

    try {
      const result = await signup(submitData);
      if (result.success) {
        navigate('/login', { 
          state: { 
            message: '회원가입이 완료되었습니다. 로그인해주세요.' 
          }
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>회원가입</h1>
        </div>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">이메일 *</label>
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
          <label htmlFor="password" className="form-label">비밀번호 *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            data-testid="password-input"
            required
            minLength="8"
            placeholder="8자 이상의 비밀번호를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">이름 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            data-testid="name-input"
            required
            placeholder="이름을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">역할 *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select"
            data-testid="role-select"
            required
          >
            <option value="">역할을 선택하세요</option>
            <option value="mentor">멘토 (가르치고 싶어요)</option>
            <option value="mentee">멘티 (배우고 싶어요)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="bio" className="form-label">소개</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="form-textarea"
            placeholder="자신에 대해 간단히 소개해주세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="skills" className="form-label">기술/관심분야</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="form-input"
            placeholder="예: React, JavaScript, Python (쉼표로 구분)"
          />
        </div>

        {formData.role === 'mentor' && (
          <>
            <div className="form-group">
              <label htmlFor="experience_years" className="form-label">경험 연수</label>
              <input
                type="number"
                id="experience_years"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                className="form-input"
                min="0"
                max="50"
                placeholder="경험 연수를 입력하세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hourly_rate" className="form-label">시간당 요금 (원)</label>
              <input
                type="number"
                id="hourly_rate"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                className="form-input"
                min="0"
                placeholder="시간당 요금을 입력하세요 (선택사항)"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          id="signup"
          className="btn btn-primary"
          data-testid="signup-button"
          disabled={loading}
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: '#3498db' }}>
            로그인
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Signup;
