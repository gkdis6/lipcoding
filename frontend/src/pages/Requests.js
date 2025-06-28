import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Requests = () => {
  const { user, isMentor, isMentee } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/match-requests');
      setRequests(response.data.requests || []);
      setError('');
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setError('요청 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      await api.put(`/match-requests/${requestId}`, { status: 'accepted' });
      setMessage('요청을 수락했습니다.');
      fetchRequests(); // 목록 새로고침
    } catch (error) {
      console.error('Failed to accept request:', error);
      setError(error.response?.data?.message || '요청 수락에 실패했습니다.');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      await api.put(`/match-requests/${requestId}`, { status: 'rejected' });
      setMessage('요청을 거절했습니다.');
      fetchRequests(); // 목록 새로고침
    } catch (error) {
      console.error('Failed to reject request:', error);
      setError(error.response?.data?.message || '요청 거절에 실패했습니다.');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleCancel = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      await api.delete(`/match-requests/${requestId}`);
      setMessage('요청을 취소했습니다.');
      fetchRequests(); // 목록 새로고침
    } catch (error) {
      console.error('Failed to cancel request:', error);
      setError(error.response?.data?.message || '요청 취소에 실패했습니다.');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '대기 중';
      case 'accepted': return '수락됨';
      case 'rejected': return '거절됨';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'accepted': return '#27ae60';
      case 'rejected': return '#e74c3c';
      case 'cancelled': return '#95a5a6';
      default: return '#333';
    }
  };

  const getMentorImageUrl = (mentor) => {
    if (mentor?.profile_image) {
      return `/api/images/mentor/${mentor.id}`;
    }
    return 'https://placehold.co/500x500.jpg?text=MENTOR';
  };

  const getMenteeImageUrl = (mentee) => {
    if (mentee?.profile_image) {
      return `/api/images/mentee/${mentee.id}`;
    }
    return 'https://placehold.co/500x500.jpg?text=MENTEE';
  };

  if (!user) {
    return (
      <div className="page-container">
        <h1>요청 관리</h1>
        <p>로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {isMentor ? '받은 매칭 요청' : '보낸 매칭 요청'}
      </h1>

      {/* 상태 메시지 */}
      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>
          {error}
        </div>
      )}
      {message && (
        <div style={{ color: 'green', textAlign: 'center', margin: '1rem 0' }}>
          {message}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>요청 목록을 불러오는 중...</p>
        </div>
      ) : (
        <>
          {/* 요청 목록 */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {requests.length > 0 ? (
              requests.map(request => (
                <div key={request.id} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                  {/* 요청자/멘토 정보 */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <img
                      src={isMentor ? getMenteeImageUrl(request.mentee) : getMentorImageUrl(request.mentor)}
                      alt={`${isMentor ? request.mentee?.name : request.mentor?.name} 프로필`}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '1rem',
                        border: '2px solid #ddd'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>
                        {isMentor ? request.mentee?.name : request.mentor?.name}
                      </h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                        {isMentor ? '멘티' : '멘토'} • 요청일: {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        color: getStatusColor(request.status),
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </div>

                  {/* 요청 메시지 */}
                  {request.message && (
                    <div className="request-message" mentee={request.mentee_id} style={{ 
                      marginBottom: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      borderLeft: '4px solid #007bff'
                    }}>
                      <strong>메시지:</strong>
                      <p style={{ margin: '0.5rem 0 0 0', lineHeight: '1.5' }}>{request.message}</p>
                    </div>
                  )}

                  {/* 멘토 기술 스택 (멘티가 볼 때) */}
                  {isMentee && request.mentor?.skills && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>기술 스택:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {request.mentor.skills.split(',').map((skill, index) => (
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

                  {/* 액션 버튼 */}
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {isMentor && request.status === 'pending' && (
                      <>
                        <button
                          id="accept"
                          onClick={() => handleAccept(request.id)}
                          disabled={actionLoading[request.id]}
                          className="btn btn-primary"
                          data-testid={`accept-button-${request.id}`}
                          style={{ backgroundColor: '#27ae60', borderColor: '#27ae60' }}
                        >
                          {actionLoading[request.id] ? '처리 중...' : '수락'}
                        </button>
                        <button
                          id="reject"
                          onClick={() => handleReject(request.id)}
                          disabled={actionLoading[request.id]}
                          className="btn btn-secondary"
                          data-testid={`reject-button-${request.id}`}
                          style={{ backgroundColor: '#e74c3c', borderColor: '#e74c3c', color: 'white' }}
                        >
                          {actionLoading[request.id] ? '처리 중...' : '거절'}
                        </button>
                      </>
                    )}
                    
                    {isMentee && request.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(request.id)}
                        disabled={actionLoading[request.id]}
                        className="btn btn-secondary"
                        data-testid={`cancel-button-${request.id}`}
                        style={{ backgroundColor: '#95a5a6', borderColor: '#95a5a6', color: 'white' }}
                      >
                        {actionLoading[request.id] ? '처리 중...' : '요청 취소'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>{isMentor ? '받은 매칭 요청이 없습니다.' : '보낸 매칭 요청이 없습니다.'}</p>
                {isMentee && (
                  <p style={{ color: '#666', marginTop: '1rem' }}>
                    <a href="/mentors" style={{ color: '#007bff', textDecoration: 'none' }}>
                      멘토 목록에서 매칭 요청을 보내보세요
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Requests;
