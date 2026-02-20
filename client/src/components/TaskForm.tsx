// src/components/TaskForm.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import './TaskForm.css';

interface TaskFormProps {
  onAddTask: (title: string) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    
    if (trimmedTitle && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onAddTask(trimmedTitle);
        setTitle('');
      } catch (error) {
        console.error('Error al añadir tarea:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="Nueva tarea..."
        className="task-input"
        disabled={isSubmitting}
        aria-label="Título de la nueva tarea"
      />
      <button 
        type="submit" 
        className="add-btn"
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? 'Añadiendo...' : 'Añadir'}
      </button>
    </form>
  );
};

export default TaskForm;