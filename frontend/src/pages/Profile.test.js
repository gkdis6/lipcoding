import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';

// Mock all dependencies
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'mentor',
      bio: 'Test bio',
      skills: 'React, JavaScript',
      created_at: '2023-01-01T00:00:00Z'
    },
    updateUser: jest.fn(),
    loading: false
  })
}));

jest.mock('../services/api', () => ({
  put: jest.fn()
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Profile Component', () => {
  test('renders profile form elements', () => {
    renderWithRouter(<Profile />);
    
    expect(screen.getByRole('heading', { name: '프로필 관리' })).toBeInTheDocument();
    expect(screen.getByLabelText('이름 *')).toBeInTheDocument();
    expect(screen.getByLabelText('소개글')).toBeInTheDocument();
    expect(screen.getByLabelText('기술 스택')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '프로필 저장' })).toBeInTheDocument();
  });

  test('displays profile photo', () => {
    renderWithRouter(<Profile />);
    
    const profilePhoto = screen.getByAltText('프로필 사진');
    expect(profilePhoto).toBeInTheDocument();
    expect(profilePhoto).toHaveAttribute('id', 'profile-photo');
  });

  test('shows file upload input', () => {
    renderWithRouter(<Profile />);
    
    const fileInput = screen.getByLabelText('프로필 사진');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('id', 'profile');
    expect(fileInput).toHaveAttribute('type', 'file');
  });

  test('shows role information for mentor', () => {
    renderWithRouter(<Profile />);
    
    expect(screen.getByText('멘토 (가르치고 싶어요)')).toBeInTheDocument();
    expect(screen.getByLabelText('기술 스택')).toBeInTheDocument();
  });

  test('shows account information', () => {
    renderWithRouter(<Profile />);
    
    expect(screen.getByText('계정 정보')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});
