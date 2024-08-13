
import React from 'react';

const TaskList = ({ tasks, deleteTask, editTask, completeTask }) => {
  const handleCompleteChange = (task) => {
    completeTask(task.id);
  };

  const handleEditChange = (task, newText) => {
    editTask(task.id, newText);
  };

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleCompleteChange(task)}
          />
          <span>{task.text}</span>
          <span> - {task.category}</span> {/* Görev kategorisini gösterir */}
          <button onClick={() => deleteTask(task.id)}>Delete</button>
          <button onClick={() => {
            const newText = prompt('Edit task:', task.text);
            if (newText) {
              handleEditChange(task, newText);
            }
          }}>Edit</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
