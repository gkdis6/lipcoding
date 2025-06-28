import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { AuthProvider } from '../contexts/AuthContext';

const HomeWithProviders = ({ user = null }) => {
  // Mock useAuth hook for this component
  const mockUseAuth = jest.fn().mockReturnValue({
    user,
    logout: jest.fn()
  });
  
  // Override the mock
  jest.doMock('../contexts/AuthContext', () => ({
    ...jest.requireActual('../contexts/AuthContext'),
    useAuth: mockUseAuth
  }));

  return (
    <BrowserRouter>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  test('renders welcome message for guest users', () => {
    render(<HomeWithProviders />);
    
    expect(screen.getByText('멘토-멘티 매칭 플랫폼에 오신 것을 환영합니다!')).toBeInTheDocument();
    expect(screen.getByText(/전문가와 학습자를 연결하는 플랫폼입니다/)).toBeInTheDocument();
  });

  test('renders main features', () => {
    render(<HomeWithProviders />);
    
    expect(screen.getByText('주요 기능')).toBeInTheDocument();
    expect(screen.getByText('멘토 찾기')).toBeInTheDocument();
    expect(screen.getByText('프로필 관리')).toBeInTheDocument();
    expect(screen.getByText('매칭 요청')).toBeInTheDocument();
  });

  test('renders getting started section', () => {
    render(<HomeWithProviders />);
    
    expect(screen.getByText('시작하기')).toBeInTheDocument();
    expect(screen.getByText(/회원가입을 통해 멘토 또는 멘티로 등록하세요/)).toBeInTheDocument();
  });
});
