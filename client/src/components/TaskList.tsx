// src/components/TaskList.tsx
import React from 'react';
import { Task } from '../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return <p className="empty-message">¡Añade tu primera tarea!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li 
          key={task.id} 
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
            className="task-checkbox"
            aria-label={`Marcar tarea ${task.title} como completada`}
          />
          <span className="task-title">{task.title}</span>
          <button 
            onClick={() => onDeleteTask(task.id)}
            className="delete-btn"
            aria-label={`Eliminar tarea ${task.title}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;