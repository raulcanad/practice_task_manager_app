const express = require('express');
const fs = require('fs').promises; // To work with files
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5001; // o 5000 but I hav mac using 5000 to other dev program

// set up CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// File JSON's path
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Function to read files
async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If it is the first time we create new one. 
    const defaultTasks = [
      { id: 1, title: 'Review React Doc', completed: false },
      { id: 2, title: 'Prepare demo components', completed: true },
      { id: 3, title: 'Practice Hooks', completed: false }
    ];
    await writeTasks(defaultTasks);
    return defaultTasks;
  }
}

// Function to write tasks
async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Middleware for  logging
app.use(async (req, res, next) => {
  console.log(` ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

// Test path
app.get('/', (req, res) => {
  res.json({ 
    message: ' Server with JSON persistence',
    storage: 'tasks.json',
    endpoints: {
      tasks: '/api/tasks'
    }
  });
});

// GET /api/tasks - Read all tasks 
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await readTasks();
    console.log(` Enviando ${tasks.length} tareas`);
    res.json(tasks);
  } catch (error) {
    console.error('Error leyendo tareas:', error);
    res.status(500).json({ error: 'Error al leer las tareas' });
  }
});

// POST /api/tasks - Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const tasks = await readTasks();
    
    // Calc new ID (max ID + 1)
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    
    const newTask = {
      id: newId,
      title: title.trim(),
      completed: false
    };
    
    tasks.push(newTask);
    await writeTasks(tasks);
    
    console.log(' Tarea guardada en JSON:', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creando tarea:', error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// PUT /api/tasks/:id - Update task  (complete/uncomplete)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tasks = await readTasks();
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      completed: !tasks[taskIndex].completed
    };
    
    await writeTasks(tasks);
    
    console.log(' Tarea actualizada en JSON:', tasks[taskIndex]);
    res.json(tasks[taskIndex]);
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tasks = await readTasks();
    
    const newTasks = tasks.filter(task => task.id !== id);
    
    if (newTasks.length === tasks.length) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    await writeTasks(newTasks);
    
    console.log(` Tarea ${id} eliminada del JSON`);
    res.status(204).send();
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(' SERVER WITH JSON PERSISTENCE');
  console.log('='.repeat(60));
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` API: http://localhost:${PORT}/api/tasks`);
  console.log(` Files: ${TASKS_FILE}`);
  console.log(` The data is now persistance!`);
  console.log('='.repeat(60) + '\n');
});