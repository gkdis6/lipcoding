import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('https://placehold.co/500x500.jpg?text=USER');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        skills: user.skills || ''
      });
      
      // 프로필 이미지 URL 설정
      if (user.image_data) {
        setImagePreview(`/api/images/${user.role}/${user.id}`);
      } else {
        // 기본 이미지
        const defaultImage = user.role === 'mentor' 
          ? 'https://placehold.co/500x500.jpg?text=MENTOR'
          : 'https://placehold.co/500x500.jpg?text=MENTEE';
        setImagePreview(defaultImage);
      }
    }
  }, [user?.id, user?.name, user?.bio, user?.skills, user?.role, user?.image_data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 형식 검증
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('JPG, PNG 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 검증 (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        setError('이미지 크기는 1MB 이하여야 합니다.');
        return;
      }

      setImageFile(file);
      
      // 이미지 미리보기
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('skills', formData.skills);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await api.put('/api/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage('프로필이 성공적으로 업데이트되었습니다.');
        // 사용자 정보 업데이트
        if (updateUser) {
          updateUser(response.data.user);
        }
        setImageFile(null);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      setError(error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1>프로필</h1>
          </div>
          <p style={{ textAlign: 'center', color: '#64748b' }}>로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>프로필 관리</h1>
        </div>
        
        {/* 대시보드 섹션 */}
        <div className="dashboard-grid">
          {user.role === 'mentee' && (
            <div className="dashboard-card">
              <h3>멘토 찾기</h3>
              <p>
                원하는 기술 분야의 멘토를 찾아보세요.
              </p>
              <Link to="/mentors" className="btn btn-primary">
                멘토 목록 보기
              </Link>
            </div>
          )}
          
          <div className="dashboard-card">
            <h3>
              {user.role === 'mentor' ? '받은 요청' : '보낸 요청'}
            </h3>
            <p>
              {user.role === 'mentor' 
                ? '멘티들로부터 받은 매칭 요청을 확인하세요.'
                : '보낸 매칭 요청의 상태를 확인하세요.'
              }
            </p>
            <Link to="/requests" className="btn btn-primary">
              요청 목록 보기
            </Link>
          </div>
        </div>
        
        {/* 프로필 폼 */}
        <div className="profile-form-container">
          <form onSubmit={handleSubmit} className="form">
            {/* 프로필 이미지 */}
            <div className="form-group">
              <label htmlFor="profile" className="form-label">프로필 사진</label>
              <div className="profile-image-section">
                <img 
                  id="profile-photo"
                  src={imagePreview} 
                  alt="프로필 사진" 
                  className="profile-image-preview"
                />
                <input
                  id="profile"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  className="form-input"
                />
                <small className="profile-image-info">
                  JPG, PNG 형식, 최대 1MB, 500x500~1000x1000px 권장
                </small>
              </div>
            </div>

            {/* 이름 */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">이름 *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
                data-testid="name-input"
                placeholder="이름을 입력하세요"
              />
            </div>

            {/* 소개글 */}
            <div className="form-group">
              <label htmlFor="bio" className="form-label">소개글</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="form-textarea"
                data-testid="bio-input"
                rows="4"
                placeholder="자신에 대해 간단히 소개해주세요"
              />
            </div>

            {/* 기술 스택 (멘토만) */}
            {user.role === 'mentor' && (
              <div className="form-group">
                <label htmlFor="skillsets" className="form-label">기술 스택</label>
                <input
                  id="skillsets"
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="form-input"
                  data-testid="skills-input"
                  placeholder="예: React, JavaScript, Python (쉼표로 구분)"
                />
              </div>
            )}

            {/* 역할 정보 표시 */}
            <div className="form-group">
              <label className="form-label">역할</label>
              <p className="role-info">
                {user.role === 'mentor' ? '멘토 (가르치고 싶어요)' : '멘티 (배우고 싶어요)'}
              </p>
            </div>

            {/* 에러/성공 메시지 */}
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            {message && (
              <div className="alert alert-success">
                {message}
              </div>
            )}

            {/* 저장 버튼 */}
            <button 
              id="save"
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              data-testid="save-button"
            >
              {loading ? '저장 중...' : '프로필 저장'}
            </button>
          </form>
        </div>

        {/* 계정 정보 */}
        <div className="account-info">
          <h3>계정 정보</h3>
          <p><strong>이메일:</strong> {user.email}</p>
          <p><strong>가입일:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
