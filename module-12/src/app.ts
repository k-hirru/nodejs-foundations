// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import { validateCreateTask } from './validate';
import { asyncHandler } from './async-handler';
 
const app = express();
app.use(express.json());
 
// --- Define your types ---
interface Task {
  id: number;
  title: string;
  done: boolean;
}
 
// Type for the POST/PUT request body
interface CreateTaskBody {
  title: string;
}
 
interface UpdateTaskBody {
  title?: string;
  done?: boolean;
}
 
// In-memory store (typed!)
let tasks: Task[] = [];
let nextId = 1;
 
// --- Typed route handlers ---
app.get('/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});
 
app.get('/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params['id'] as string);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});
 
// POST route uses validateCreateTask from EXERCISE: 12.2
// POST route refactored in EXERCISE: 12.3 to use asyncHandler
app.post('/tasks', validateCreateTask, asyncHandler(async (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
  const { title } = req.body;
  const task: Task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
}));
 
app.put('/tasks/:id', (req: Request<{ id: string }, {}, UpdateTaskBody>, res: Response) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.done !== undefined) task.done = req.body.done;
  res.json(task);
});
 
app.delete('/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params['id'] as string);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  tasks.splice(idx, 1);
  res.status(204).send();
});
 
export default app;
