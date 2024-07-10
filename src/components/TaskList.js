import React from 'react';
import './TaskList.css';

function TaskList({ tasks, onDelete, onEdit, onComplete }) {
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <span onClick={() => onComplete(task.id)} className="task-text">
            {task.text}
          </span>
          <span className="task-category">
            [{task.category}]
          </span>
          <button onClick={() => onEdit(task.id)} className="edit-button">Edit</button>
          <button onClick={() => onDelete(task.id)} className="delete-button">Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
