import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Test component to use the auth context
const TestComponent = () => {
  const { user, login, logout, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{user ? user.name : 'No User'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedAxios.create.mockReturnValue({
      get: mockedAxios.get,
      post: mockedAxios.post,
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    });
  });

  test('provides initial auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  test('login function works correctly', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    const mockToken = 'fake-jwt-token';
    
    mockedAxios.post.mockResolvedValue({
      data: {
        success: true,
        token: mockToken,
        user: mockUser
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });
    
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/login', {
      email: 'test@example.com',
      password: 'password'
    });
  });

  test('logout function works correctly', async () => {
    // Set initial user state
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const logoutButton = screen.getByText('Logout');
    
    await act(async () => {
      logoutButton.click();
    });
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('loads user from localStorage on initialization', () => {
    const mockUser = { id: 1, name: 'Stored User', email: 'stored@example.com' };
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user')).toHaveTextContent('Stored User');
  });
});
