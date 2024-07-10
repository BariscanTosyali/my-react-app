import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Work', 'Personal'];

  const addTask = () => {
    if (taskText.trim() !== '' && taskCategory) {
      setTasks([...tasks, { id: uuidv4(), text: taskText, category: taskCategory, completed: false }]);
      setTaskText('');
      setTaskCategory('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id) => {
    const newText = prompt('New task text:');
    if (newText) {
      setTasks(tasks.map(task => task.id === id ? { ...task, text: newText } : task));
    }
  };

  const completeTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const filteredTasks = tasks.filter(task => {
    return (filter === 'All' || task.category === filter) &&
           (task.text.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="App">
      <Header />
      <main className="main">
        <div className="task-controls">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Add a new task"
            className="task-input"
          />
          <select
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
            className="category-select"
          >
            <option value="" disabled>Select category</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button onClick={addTask} className="add-task-button">Add Task</button>
        </div>
        <div className="filter-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks"
            className="search-input"
          />
        </div>
        <TaskList tasks={filteredTasks} onDelete={deleteTask} onEdit={editTask} onComplete={completeTask} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
