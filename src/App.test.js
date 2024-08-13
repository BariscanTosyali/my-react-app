import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// Jest ile global Notification API sahtelemesi
global.Notification = {
  permission: 'granted',
  requestPermission: jest.fn(),
  mockNotification: jest.fn(),
};

// Notification constructor sahteleme
const mockNotification = jest.fn();
global.Notification = function(title, options) {
  mockNotification(title, options);
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('adds a task with a reminder and schedules a notification', async () => {
    render(<App />);
    
    // Giriş yapıldığını varsayalım
    act(() => {
      fireEvent.click(screen.getByText('Add Task'));
    });

    // Yeni görev ekle
    fireEvent.change(screen.getByPlaceholderText('New task'), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText('Task Reminder'), { target: { value: '2024-08-10T10:00' } });
    fireEvent.click(screen.getByText('Add Task'));

    // Görevin listeye eklendiğini doğrula
    expect(screen.getByText('Test Task')).toBeInTheDocument();

    // Notification fonksiyonunun doğru şekilde çağrıldığını kontrol et
    expect(mockNotification).toHaveBeenCalledWith('Task Reminder', {
      body: 'Reminder for task: Test Task',
      icon: '/path/to/icon.png',
    });
  });

  test('switches themes when the theme toggle button is clicked', () => {
    render(<App />);

    // Tema değiştir düğmesini bul ve tıkla
    const toggleButton = screen.getByText(/Switch to Dark Mode/i);
    fireEvent.click(toggleButton);

    // Yeni temanın doğru şekilde uygulandığını kontrol et
    expect(document.body.className).toBe('dark-theme');
    expect(toggleButton.textContent).toBe('Switch to Light Mode');
  });

  
});
