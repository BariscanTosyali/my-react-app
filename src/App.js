import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskCategory, setTaskCategory] = useState('Work');
  const [taskReminder, setTaskReminder] = useState('');
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('light-theme');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light-theme';
    setTheme(storedTheme);
    document.body.className = storedTheme;

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      setIsAuthenticated(true);
      const fetchTasks = async () => {
        try {
          const response = await fetch(`http://localhost:5000/tasks?username=${user.username}`);
          const savedTasks = await response.json();
          setTasks(savedTasks);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchTasks();
    }

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          alert('You need to allow notifications for reminders to work.');
        }
      });
    }
  }, []);

  const handleThemeChange = () => {
    const newTheme = theme === 'light-theme' ? 'dark-theme' : 'light-theme';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        const response = await fetch(`http://localhost:5000/tasks?username=${user.username}`);
        const savedTasks = await response.json();
        setTasks(savedTasks);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSignup = async (username, password) => {
    if (!username || !password) {
      alert('Username and password fields cannot be empty.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        handleLogin(username, password);
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const addTask = async () => {
    const newTask = { text: taskText, category: taskCategory, completed: false, username: user.username, reminder: taskReminder };
    const response = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    if (response.ok) {
      const savedTask = await response.json();
      setTasks([...tasks, savedTask]);
      setTaskText('');
      setTaskCategory('Work');
      setTaskReminder('');
      scheduleNotification(savedTask);
    }
  };

  const scheduleNotification = (task) => {
    if (!task.reminder) return;

    const reminderTime = new Date(task.reminder).getTime();
    const currentTime = new Date().getTime();
    const timeToReminder = reminderTime - currentTime;

    if (timeToReminder > 0) {
      setTimeout(() => {
        sendNotification('Task Reminder', {
          body: `Reminder for task: ${task.text}`,
          icon: '/path/to/icon.png',
        });
      }, timeToReminder);
    }
  };

  const sendNotification = (title, options) => {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  };

  const deleteTask = async (id) => {
    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const editTask = async (id, newText) => {
    const updatedTask = { ...tasks.find(task => task.id === id), text: newText };
    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });
    if (response.ok) {
      setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
    }
  };

  const completeTask = async (id) => {
    const updatedTask = { ...tasks.find(task => task.id === id), completed: !tasks.find(task => task.id === id).completed };
    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });
    if (response.ok) {
      setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = filter ? task.category === filter : true;
    const matchesSearch = searchQuery ? task.text.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="App">
      <Header />
      <main className="main">
        <button onClick={handleThemeChange} className="theme-toggle-button">
          Switch to {theme === 'light-theme' ? 'Dark' : 'Light'} Mode
        </button>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <div className="task-controls">
              <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="New task"
              />
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
              <input
                type="datetime-local"
                value={taskReminder}
                onChange={(e) => setTaskReminder(e.target.value)}
              />
              <button onClick={addTask}>Add Task</button>
            </div>
            <div className="filter-controls">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <TaskList
              tasks={filteredTasks}
              deleteTask={deleteTask}
              editTask={editTask}
              completeTask={completeTask}
            />
          </>
        ) : (
          <LoginForm onLogin={handleLogin} onSignup={handleSignup} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;

