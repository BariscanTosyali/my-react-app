import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginForm from './LoginForm';

describe('LoginForm Component', () => {
  const mockOnLogin = jest.fn();
  const mockOnSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with username and password inputs and buttons', () => {
    render(<LoginForm onLogin={mockOnLogin} onSignup={mockOnSignup} />);

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('calls onLogin with correct username and password when login button is clicked', () => {
    render(<LoginForm onLogin={mockOnLogin} onSignup={mockOnSignup} />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    fireEvent.click(loginButton);

    expect(mockOnLogin).toHaveBeenCalledWith('testuser', 'testpass');
  });

  test('calls onSignup with correct username and password when sign up button is clicked', () => {
    render(<LoginForm onLogin={mockOnLogin} onSignup={mockOnSignup} />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signupButton = screen.getByText('Sign Up');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'newpass' } });

    fireEvent.click(signupButton);

    expect(mockOnSignup).toHaveBeenCalledWith('newuser', 'newpass');
  });
});
