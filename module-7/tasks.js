// tasks.js
const express = require('express');
const morgan = require('morgan');
 
const app = express();

// Exercise 7.1: Request Timer Middleware
const requestTimer = (req, res, next) => {
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} took ${duration}ms`);
  });

  next();
};

// Exercise 7.2: Fake Auth Middleware
const fakeAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'secret123')                               
    return next(new HttpError(401, 'Unauthorized'));
  next();
};

app.use(express.json());
app.use(morgan('dev'));
app.use(requestTimer);
 
let tasks = [
  { id: 1, title: 'Learn middleware', done: false }
];
let nextId = 2;
 
// Custom error class for HTTP errors
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
 
// // Validation middleware for POST and PUT
// function validateTask(req, res, next) {
//   const { title } = req.body;
//   if (!title || typeof title !== 'string') {
//     return next(new HttpError(400, 'title is required and must be a string'));
//   }
//   if (title.length > 100) {
//     return next(new HttpError(400, 'title must be 100 characters or less'));
//   }
//   next();
// }

// Exercise 7.3: Better Validation
// Improve the validateTask middleware to return all validation errors at once, not just the first one.
  function validateTask(req, res, next) {                                   
    const errors = [];                                                    
    const { title } = req.body;
    if (!title) errors.push('title is required');                           
    if (typeof title !== 'string') errors.push('title must be a string');
    if (typeof title === 'string' && title.length > 100) errors.push('title must be 100 characters or less');                                         
  
    if (errors.length > 0) {                                                
      const err = new HttpError(400, 'Validation failed');                
      err.details = errors;                                                 
      return next(err);
    }                                                                       
    next();                                                               
  }
 
// Routes
app.get('/tasks', (req, res) => {
  res.json(tasks);
});
 
app.get('/tasks/:id', (req, res, next) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return next(new HttpError(404, 'Task not found'));
  res.json(task);
});
 
app.post('/tasks', validateTask, fakeAuth, (req, res) => {
  const task = { id: nextId++, title: req.body.title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});
 
app.put('/tasks/:id', validateTask, fakeAuth, (req, res, next) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return next(new HttpError(404, 'Task not found'));
  task.title = req.body.title;
  if (req.body.done !== undefined) task.done = req.body.done;
  res.json(task);
});
 
app.delete('/tasks/:id', fakeAuth, (req, res, next) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return next(new HttpError(404, 'Task not found'));
  tasks.splice(idx, 1);
  res.status(204).send();
});
 
// 404 handler for unknown routes
app.use((req, res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.path}`));
});
 
// Global error handler (4 arguments!) // Added the collection of errors from Exercise 7.3
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  console.error(`[ERROR] ${status} ${message}`);
  res.status(status).json({
    error: {
      status,
      message,
      ...(err.details && { details: err.details })
    }
  });
});
 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Tasks API running at http://localhost:${PORT}`);
});
