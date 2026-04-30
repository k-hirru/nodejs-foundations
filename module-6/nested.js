 // nested.js

const express = require("express");
const app = express();

app.use(express.json());

let projects = [
    { id: 1, name: 'Website Redesign', tasks: [
      { id: 1, title: 'Mockups', done: true },
      { id: 2, title: 'Build homepage', done: false }
    ]},
    { id: 2, name: 'API Migration', tasks: [] }
];

// List all projects
app.get('projects', (req, res) => {
  res.json(projects);
});

// Get specific task of a project
app.get('/projects/:id/tasks', (req, res) => {
    const id = parseInt(req.params.id);
    const project = projects.find((p) => p.id === id);

    if(!project) {
        return res.status(404).json({ error: "Project not found"})
    }

    res.json(project.tasks);
});

// Add a new task to a project
app.post('/projects/:id/tasks', (req, res) => {
    const id = parseInt(req.params.id);
    const project = projects.find((p) => p.id === id);

    if (!project) return res.status(404).json({ error: "Project not found" });

    const newTask = {
        id: project.tasks.length + 1,
        title: req.body.title,
        done: false
    };

    project.tasks.push(newTask);
    res.status(201).json(newTask);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Users API running at http://localhost:${PORT}`);
});

