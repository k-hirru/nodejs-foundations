//tasks.js

const express = require("express");
const app = express();

app.use(express.json());

// In-memory data store
let tasks = [
  { id: 1, title: "Learn Express", done: false },
  { id: 2, title: "Build an API", done: false },
];
let nextId = 3;

// List all tasks
app.get("/tasks", (req, res) => {
  const doneParam = req.query.done;

  // If no query parameter, return all tasks
  if (doneParam === undefined) {
    return res.json(tasks);
  }

  // Filter based on done parameter
  const isDone = doneParam === "true";
  const filteredTasks = tasks.filter((task) => task.done === isDone);

  res.json(filteredTasks);
});

// List all incomplete tasks

// Get one task by id
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
});

// Create a new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  const { title, done } = req.body;
  if (title !== undefined) task.title = title;
  if (done !== undefined) task.done = done;
  res.json(task);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Tasks API running at http://localhost:${PORT}`);
});
