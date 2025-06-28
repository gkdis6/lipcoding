import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Profile.css';

const getProfileImageUrl = (mentor) => {
    if (mentor.profile_image) {
      return `/images/mentor/${mentor.id}`;
    }
    return 'https://placehold.co/500x500.jpg?text=MENTOR';
  };

const Mentors = () => {
  const { user, isMentee } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [requestLoading, setRequestLoading] = useState({});
  const [requestMessage, setRequestMessage] = useState({});
  const [requestStatus, setRequestStatus] = useState('');

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    filterAndSortMentors();
  }, [mentors, searchTerm, sortBy]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mentors');
      setMentors(response.data || []);
      setError('');
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
      setError('멘토 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMentors = () => {
    let filtered = [...mentors];

    // 검색 필터링
    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mentor.skills && mentor.skills.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (mentor.bio && mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'skill') {
        return (a.skills || '').localeCompare(b.skills || '');
      }
      return 0;
    });

    setFilteredMentors(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleMessageChange = (mentorId, value) => {
    setRequestMessage(prev => ({
      ...prev,
      [mentorId]: value
    }));
  };

  const sendMatchingRequest = async (mentorId) => {
    if (!isMentee) {
      setError('멘티만 매칭 요청을 보낼 수 있습니다.');
      return;
    }

    setRequestLoading(prev => ({ ...prev, [mentorId]: true }));
    
    try {
      const message = requestMessage[mentorId] || '';
      const response = await api.post('/match-requests', {
        mentor_id: mentorId,
        message: message
      });

      if (response.data.success) {
        setRequestStatus('매칭 요청이 성공적으로 전송되었습니다.');
        setRequestMessage(prev => ({ ...prev, [mentorId]: '' }));
        // 요청 후 멘토 목록 새로고침하여 상태 업데이트
        fetchMentors();
      }
    } catch (error) {
      console.error('Failed to send matching request:', error);
      setError(error.response?.data?.message || '매칭 요청 전송에 실패했습니다.');
    } finally {
      setRequestLoading(prev => ({ ...prev, [mentorId]: false }));
    }
  };

  const getMentorImageUrl = (mentor) => {
    if (mentor.profile_image) {
      return `/images/mentor/${mentor.id}`;
    }
    return 'https://placehold.co/500x500.jpg?text=MENTOR';
  };

  if (!user) {
    return (
      <div className="page-container">
        <h1>멘토 목록</h1>
        <p>로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>멘토 목록</h1>
      
      {/* 검색 및 정렬 */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label htmlFor="search" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            멘토 검색
          </label>
          <input
            id="search"
            data-testid="search-input"
            type="text"
            placeholder="멘토 이름, 기술 스택, 소개글로 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-input"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label htmlFor="sort" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            정렬
          </label>
          <select
            id="sort"
            data-testid="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="form-select"
            style={{ minWidth: '120px' }}
          >
            <option id="name" value="name">이름순</option>
            <option id="skill" value="skill">기술 스택순</option>
          </select>
        </div>
      </div>

      {/* 상태 메시지 */}
      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>
          {error}
        </div>
      )}
      {requestStatus && (
        <div id="request-status" style={{ color: 'green', textAlign: 'center', margin: '1rem 0' }}>
          {requestStatus}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>멘토 목록을 불러오는 중...</p>
        </div>
      ) : (
        <>
          {/* 멘토 목록 */}
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {filteredMentors.length > 0 ? (
              filteredMentors.map(mentor => (
                <div key={mentor.id} className="mentor card" data-testid={`mentor-${mentor.id}`} style={{ padding: '1.5rem' }}>
                  {/* 멘토 기본 정보 */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <img
                      src={getMentorImageUrl(mentor)}
                      alt={`${mentor.name} 프로필`}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '1rem',
                        border: '2px solid #ddd'
                      }}
                    />
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{mentor.name}</h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                        {mentor.experience_years}년 경력
                        {mentor.hourly_rate && ` • ${mentor.hourly_rate.toLocaleString()}원/시간`}
                      </p>
                    </div>
                  </div>

                  {/* 기술 스택 */}
                  {mentor.skills && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>기술 스택:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {mentor.skills.split(',').map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              display: 'inline-block',
                              background: '#e9ecef',
                              padding: '0.25rem 0.5rem',
                              margin: '0.25rem 0.25rem 0.25rem 0',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 소개글 */}
                  {mentor.bio && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ margin: 0, lineHeight: '1.5' }}>{mentor.bio}</p>
                    </div>
                  )}

                  {/* 매칭 요청 (멘티만) */}
                  {isMentee && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                      <textarea
                        id="message"
                        data-mentor-id={mentor.id}
                        data-testid={`message-${mentor.id}`}
                        placeholder="매칭 요청 메시지를 입력하세요..."
                        value={requestMessage[mentor.id] || ''}
                        onChange={(e) => handleMessageChange(mentor.id, e.target.value)}
                        className="form-textarea"
                        rows="3"
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                      />
                      <button
                        id="request"
                        data-testid={`request-button-${mentor.id}`}
                        onClick={() => sendMatchingRequest(mentor.id)}
                        disabled={requestLoading[mentor.id]}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        {requestLoading[mentor.id] ? '요청 중...' : '매칭 요청'}
                      </button>
                    </div>
                  )}

                  {/* 멘토인 경우 안내 메시지 */}
                  {!isMentee && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                      <p style={{ margin: 0, color: '#666', textAlign: 'center' }}>
                        멘티로 로그인하시면 매칭 요청을 보낼 수 있습니다.
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <p>검색 조건에 맞는 멘토가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 검색 결과 정보 */}
          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
            <p>총 {filteredMentors.length}명의 멘토가 있습니다.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Mentors;
