import { render, screen } from '@testing-library/react';
import Login from './Login';

// Mock all dependencies
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    loading: false
  })
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/login' })
}));

test('renders login form elements', () => {
  render(<Login />);
  
  expect(screen.getByRole('heading', { name: '로그인' })).toBeInTheDocument();
  expect(screen.getByLabelText('이메일')).toBeInTheDocument();
  expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
});
