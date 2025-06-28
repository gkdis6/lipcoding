import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';
import { AuthProvider } from '../contexts/AuthContext';

// Mock useAuth hook
const mockLogout = jest.fn();
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    user: null,
    logout: mockLogout
  })
}));

const NavigationWithProviders = ({ user = null }) => {
  // Override the mock for specific tests
  const mockUseAuth = require('../contexts/AuthContext').useAuth;
  mockUseAuth.mockReturnValue({
    user,
    logout: mockLogout
  });

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navigation when user is not logged in', () => {
    render(<NavigationWithProviders />);
    
    expect(screen.getByText('멘토-멘티 매칭')).toBeInTheDocument();
    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('로그인')).toBeInTheDocument();
    expect(screen.getByText('회원가입')).toBeInTheDocument();
    
    // Should not show authenticated user menu
    expect(screen.queryByText('로그아웃')).not.toBeInTheDocument();
  });

  test('renders navigation when user is logged in as mentor', () => {
    const user = {
      id: 1,
      name: 'Test Mentor',
      email: 'mentor@test.com',
      role: 'mentor'
    };

    render(<NavigationWithProviders user={user} />);
    
    expect(screen.getByText('멘토-멘티 매칭')).toBeInTheDocument();
    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('프로필')).toBeInTheDocument();
    expect(screen.getByText('요청 관리')).toBeInTheDocument();
    expect(screen.getByText('Test Mentor님')).toBeInTheDocument();
    expect(screen.getByText('로그아웃')).toBeInTheDocument();
    
    // Should not show login/signup links
    expect(screen.queryByText('로그인')).not.toBeInTheDocument();
    expect(screen.queryByText('회원가입')).not.toBeInTheDocument();
  });

  test('renders navigation when user is logged in as mentee', () => {
    const user = {
      id: 2,
      name: 'Test Mentee',
      email: 'mentee@test.com',
      role: 'mentee'
    };

    render(<NavigationWithProviders user={user} />);
    
    expect(screen.getByText('멘토-멘티 매칭')).toBeInTheDocument();
    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('프로필')).toBeInTheDocument();
    expect(screen.getByText('멘토 찾기')).toBeInTheDocument();
    expect(screen.getByText('요청 관리')).toBeInTheDocument();
    expect(screen.getByText('Test Mentee님')).toBeInTheDocument();
    expect(screen.getByText('로그아웃')).toBeInTheDocument();
  });

  test('calls logout function when logout is clicked', () => {
    const user = {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      role: 'mentor'
    };

    render(<NavigationWithProviders user={user} />);
    
    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
