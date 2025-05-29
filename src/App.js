import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
  const [theme, setTheme] = useState('light-theme');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light-theme';
    setTheme(storedTheme);
    document.body.className = storedTheme;

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Fetch tasks for the user
        fetchTasks(user.uid);
      } else {
        setUser(null);
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTasks = async (userId) => {
    try {
      const response = await fetch(`https://your-backend-url.com/tasks?userId=${userId}`);
      const savedTasks = await response.json();
      setTasks(savedTasks);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light-theme' ? 'dark-theme' : 'light-theme';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setTasks([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        {user ? (
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
          <LoginForm onLogin={handleLogin} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;

