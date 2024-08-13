import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TaskList from './TaskList';

describe('TaskList Component', () => {
  const mockTasks = [
    { id: 1, text: 'Task 1', completed: false, category: 'Work' },
    { id: 2, text: 'Task 2', completed: true, category: 'Personal' },
  ];

  const mockDeleteTask = jest.fn();
  const mockEditTask = jest.fn();
  const mockCompleteTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task list with correct items', () => {
    render(
      <TaskList
        tasks={mockTasks}
        deleteTask={mockDeleteTask}
        editTask={mockEditTask}
        completeTask={mockCompleteTask}
      />
    );

    mockTasks.forEach((task) => {
      const taskElement = screen.getByText(task.text);
      expect(taskElement).toBeInTheDocument();
      expect(screen.getByText(` - ${task.category}`)).toBeInTheDocument();
      if (task.completed) {
        expect(taskElement).toHaveStyle('text-decoration: line-through');
      } else {
        expect(taskElement).not.toHaveStyle('text-decoration: line-through');
      }
    });
  });

  test('calls deleteTask when delete button is clicked', () => {
    render(
      <TaskList
        tasks={mockTasks}
        deleteTask={mockDeleteTask}
        editTask={mockEditTask}
        completeTask={mockCompleteTask}
      />
    );

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    expect(mockDeleteTask).toHaveBeenCalledWith(mockTasks[0].id);
  });

  test('calls editTask when edit button is clicked', () => {
    render(
      <TaskList
        tasks={mockTasks}
        deleteTask={mockDeleteTask}
        editTask={mockEditTask}
        completeTask={mockCompleteTask}
      />
    );

    const editButton = screen.getAllByText('Edit')[0];
    const newText = 'New Task Text';

    // Prompt'u sahteleyerek düzenleme simülasyonu
    window.prompt = jest.fn().mockReturnValue(newText);

    fireEvent.click(editButton);

    expect(mockEditTask).toHaveBeenCalledWith(mockTasks[0].id, newText);
  });

  test('calls completeTask when checkbox is clicked', () => {
    render(
      <TaskList
        tasks={mockTasks}
        deleteTask={mockDeleteTask}
        editTask={mockEditTask}
        completeTask={mockCompleteTask}
      />
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    expect(mockCompleteTask).toHaveBeenCalledWith(mockTasks[0].id);
  });
});
