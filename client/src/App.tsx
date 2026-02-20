// src/App.tsx (renombrado de App.js)
import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task, ApiError } from './types';
import './styles/App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Task[] = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las tareas');
      setLoading(false);
    }
  };

  const addTask = async (title: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error);
      }
      
      const newTask: Task = await response.json();
      setTasks([...tasks, newTask]);
      setError(null);
    } catch (err) {
      setError('Error al añadir tarea');
    }
  };

  const toggleTask = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar');
      }
      
      const updatedTask: Task = await response.json();
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));
    } catch (err) {
      setError('Error al actualizar tarea');
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar');
      }
      
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Error al eliminar tarea');
    }
  };

  if (loading) return <div className="container">Cargando...</div>;

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Gestor de Tareas</h1>
        <p>Demo técnica - React + TypeScript</p>
      </header>

      <main className="container">
        {error && <div className="error">{error}</div>}
        
        <TaskForm onAddTask={addTask} />
        
        <TaskList 
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
        
        <div className="stats">
          <span>Total: {tasks.length}</span>
          <span>Completadas: {tasks.filter(t => t.completed).length}</span>
          <span>Pendientes: {tasks.filter(t => !t.completed).length}</span>
        </div>
      </main>
    </div>
  );
}

export default App;