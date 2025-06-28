import { render, screen } from '@testing-library/react';
import Signup from './Signup';

// Mock all dependencies
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    loading: false
  })
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn()
}));

jest.mock('../services/api', () => ({
  post: jest.fn()
}));

test('renders signup form elements', () => {
  render(<Signup />);
  
  expect(screen.getByRole('heading', { name: '회원가입' })).toBeInTheDocument();
  expect(screen.getByLabelText('이름 *')).toBeInTheDocument();
  expect(screen.getByLabelText('이메일 *')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument();
});
