import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskList from './components/TaskList';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  const addTask = () => {
    if (taskText.trim() !== '') {
      setTasks([...tasks, { id: uuidv4(), text: taskText }]);
      setTaskText('');
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

  return (
    <div className="App">
      <Header />
      <main>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
        <TaskList tasks={tasks} onDelete={deleteTask} onEdit={editTask} />
      </main>
      <Footer />
    </div>
  );
}

export default App;


