import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Mentors from './Mentors';

// Mock all dependencies
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 2,
      name: 'Test Mentee',
      email: 'mentee@test.com',
      role: 'mentee'
    },
    isMentee: true,
    loading: false
  })
}));

jest.mock('../services/api', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

const mockMentors = [
  {
    id: 1,
    name: '김멘토',
    email: 'mentor1@test.com',
    role: 'mentor',
    bio: 'React 전문 개발자입니다.',
    skills: 'React, JavaScript, TypeScript',
    experience_years: 3,
    hourly_rate: 50000,
    profile_image: null
  },
  {
    id: 2,
    name: '이지은',
    email: 'mentor2@test.com',
    role: 'mentor',
    bio: 'Vue.js와 Python을 다루는 풀스택 개발자입니다.',
    skills: 'Vue.js, Python, Django',
    experience_years: 4,
    hourly_rate: 60000,
    profile_image: null
  }
];

describe('Mentors Component', () => {
  const mockApi = require('../services/api');

  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.get.mockResolvedValue({ data: mockMentors });
    mockApi.post.mockResolvedValue({ data: { success: true } });
  });

  test('renders mentors page elements', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    expect(screen.getByRole('heading', { name: '멘토 목록' })).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('sort-select')).toBeInTheDocument();
  });

  test('displays search and sort controls with correct test IDs', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toHaveAttribute('id', 'search');
    expect(searchInput).toHaveAttribute('placeholder', '멘토 이름, 기술 스택, 소개글로 검색...');
    
    const sortSelect = screen.getByTestId('sort-select');
    expect(sortSelect).toHaveAttribute('id', 'sort');
    expect(sortSelect.value).toBe('name');
  });

  test('displays mentor cards with test IDs', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('김멘토')).toBeInTheDocument();
      expect(screen.getByText('이지은')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('mentor-1')).toBeInTheDocument();
    expect(screen.getByTestId('mentor-2')).toBeInTheDocument();
  });

  test('shows matching request form with test IDs for mentees', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    await waitFor(() => {
      // 메시지 입력 필드 테스트 ID
      expect(screen.getByTestId('message-1')).toBeInTheDocument();
      expect(screen.getByTestId('message-2')).toBeInTheDocument();
      
      // 요청 버튼 테스트 ID
      expect(screen.getByTestId('request-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('request-button-2')).toBeInTheDocument();
    });
  });

  test('allows searching mentors by name', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('김멘토')).toBeInTheDocument();
      expect(screen.getByText('이지은')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '김멘토' } });
    });
    
    // 김멘토만 표시되어야 함
    await waitFor(() => {
      expect(screen.getByText('김멘토')).toBeInTheDocument();
      expect(screen.queryByText('이지은')).not.toBeInTheDocument();
    });
  });

  test('allows searching mentors by skills', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('김멘토')).toBeInTheDocument();
      expect(screen.getByText('이지은')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'React' } });
    });
    
    // React 관련 멘토만 표시되어야 함
    await waitFor(() => {
      expect(screen.getByText('김멘토')).toBeInTheDocument();
      expect(screen.queryByText('이지은')).not.toBeInTheDocument();
    });
  });

  test('allows sorting mentors', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('김멘토')).toBeInTheDocument();
    });
    
    const sortSelect = screen.getByTestId('sort-select');
    
    await act(async () => {
      fireEvent.change(sortSelect, { target: { value: 'skill' } });
    });
    
    expect(sortSelect.value).toBe('skill');
  });

  test('sends matching request successfully', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('message-1')).toBeInTheDocument();
    });
    
    const messageInput = screen.getByTestId('message-1');
    const requestButton = screen.getByTestId('request-button-1');
    
    await act(async () => {
      fireEvent.change(messageInput, { target: { value: '멘토링을 받고 싶습니다.' } });
      fireEvent.click(requestButton);
    });
    
    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/api/match-requests', {
        mentor_id: 1,
        message: '멘토링을 받고 싶습니다.'
      });
    });
  });

  test('shows mentor information correctly', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('김멘토')).toBeInTheDocument();
      expect(screen.getByText('React 전문 개발자입니다.')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', async () => {
    // API 호출이 지연되도록 설정
    mockApi.get.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: mockMentors }), 100)));
    
    await act(async () => {
      render(<Mentors />);
    });
    
    expect(screen.getByText('멘토 목록을 불러오는 중...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('김멘토')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    mockApi.get.mockRejectedValue(new Error('Network error'));
    
    await act(async () => {
      render(<Mentors />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('멘토 목록을 불러오는데 실패했습니다.')).toBeInTheDocument();
    });
  });

  test('shows success message after sending request', async () => {
    await act(async () => {
      render(<Mentors />);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('request-button-1')).toBeInTheDocument();
    });
    
    const requestButton = screen.getByTestId('request-button-1');
    
    await act(async () => {
      fireEvent.click(requestButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('매칭 요청이 성공적으로 전송되었습니다.')).toBeInTheDocument();
    });
  });
});
