import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Requests from './Requests';

// Mock all dependencies
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'mentor'
    },
    isMentor: true,
    isMentee: false,
    loading: false
  })
}));

jest.mock('../services/api', () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

const mockRequests = [
  {
    id: 1,
    mentee_id: 3,
    mentor_id: 1,
    message: 'React 멘토링을 받고 싶습니다.',
    status: 'pending',
    created_at: '2025-06-28T06:00:00Z',
    mentee: {
      id: 3,
      name: '정멘티',
      email: 'mentee@example.com',
      role: 'mentee',
      profile_image: false
    }
  },
  {
    id: 2,
    mentee_id: 4,
    mentor_id: 1,
    message: 'JavaScript를 배우고 싶어요.',
    status: 'accepted',
    created_at: '2025-06-27T06:00:00Z',
    mentee: {
      id: 4,
      name: '김멘티',
      email: 'mentee2@example.com',
      role: 'mentee',
      profile_image: false
    }
  }
];

describe('Requests Component', () => {
  const mockApi = require('../services/api');

  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.get.mockResolvedValue({ data: { requests: mockRequests } });
    mockApi.put.mockResolvedValue({ data: { success: true } });
    mockApi.delete.mockResolvedValue({ data: { success: true } });
  });

  test('renders requests page elements', async () => {
    render(<Requests />);
    
    expect(screen.getByRole('heading', { name: '받은 매칭 요청' })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('정멘티')).toBeInTheDocument();
      expect(screen.getByText('김멘티')).toBeInTheDocument();
    });
  });

  test('displays request messages with correct class and attributes', async () => {
    render(<Requests />);
    
    await waitFor(() => {
      const requestMessages = document.querySelectorAll('.request-message');
      expect(requestMessages).toHaveLength(2);
      
      const firstMessage = document.querySelector('.request-message[mentee="3"]');
      expect(firstMessage).toBeInTheDocument();
      expect(firstMessage).toHaveClass('request-message');
      expect(firstMessage).toHaveAttribute('mentee', '3');
    });
  });

  test('shows accept and reject buttons with correct IDs for pending requests', async () => {
    render(<Requests />);
    
    await waitFor(() => {
      const acceptButton = document.getElementById('accept');
      const rejectButton = document.getElementById('reject');
      
      expect(acceptButton).toBeInTheDocument();
      expect(rejectButton).toBeInTheDocument();
      expect(acceptButton).toHaveTextContent('수락');
      expect(rejectButton).toHaveTextContent('거절');
    });
  });

  test('handles accept request action', async () => {
    render(<Requests />);
    
    await waitFor(() => {
      const acceptButton = document.getElementById('accept');
      expect(acceptButton).toBeInTheDocument();
    });
    
    const acceptButton = document.getElementById('accept');
    fireEvent.click(acceptButton);
    
    await waitFor(() => {
      expect(mockApi.put).toHaveBeenCalledWith('/api/match-requests/1', { status: 'accepted' });
    });
  });

  test('handles reject request action', async () => {
    render(<Requests />);
    
    await waitFor(() => {
      const rejectButton = document.getElementById('reject');
      expect(rejectButton).toBeInTheDocument();
    });
    
    const rejectButton = document.getElementById('reject');
    fireEvent.click(rejectButton);
    
    await waitFor(() => {
      expect(mockApi.put).toHaveBeenCalledWith('/api/match-requests/1', { status: 'rejected' });
    });
  });

  test('displays request status correctly', async () => {
    render(<Requests />);
    
    await waitFor(() => {
      expect(screen.getByText('대기 중')).toBeInTheDocument();
      expect(screen.getByText('수락됨')).toBeInTheDocument();
    });
  });

  test('shows request messages', async () => {
    render(<Requests />);
    
    await waitFor(() => {
      expect(screen.getByText('React 멘토링을 받고 싶습니다.')).toBeInTheDocument();
      expect(screen.getByText('JavaScript를 배우고 싶어요.')).toBeInTheDocument();
    });
  });

  test('handles empty requests list', async () => {
    mockApi.get.mockResolvedValue({ data: { requests: [] } });
    
    render(<Requests />);
    
    await waitFor(() => {
      expect(screen.getByText('받은 매칭 요청이 없습니다.')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    mockApi.get.mockRejectedValue(new Error('Network error'));
    
    render(<Requests />);
    
    await waitFor(() => {
      expect(screen.getByText('요청 목록을 불러오는데 실패했습니다.')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    render(<Requests />);
    
    expect(screen.getByText('요청 목록을 불러오는 중...')).toBeInTheDocument();
  });
});
