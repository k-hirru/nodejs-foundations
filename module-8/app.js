const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });

const app = express();
const prisma = new PrismaClient({ adapter });

app.use(express.json());

app.get("/tasks", async (req, res, next) => {
  try {
    const where = {}; // Exercise 8.3 Filtering

    if (req.query.done !== undefined) { // Exercise 8.3 Filtering
      where.done = req.query.done === "true";
    }

    if (req.query.tag) { // Exercise 8.3 Filtering
      where.tag = req.query.tag;
    }

    const tasks = await prisma.task.findMany({
      where, // Exercise 8.3 Filtering
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// Get one task
app.get("/tasks/:id", async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// Create a task
app.post("/tasks", async (req, res, next) => {
  try {
    const { title, tag } = req.body; // Exercise 8.2 Added optional tag
    if (!title) return res.status(400).json({ error: "title is required" });
    const task = await prisma.task.create({
      data: { title, tag: tag || null }, // Exercise 8.2 Added optional tag
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// Update a task
app.put("/tasks/:id", async (req, res, next) => {
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(task);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    next(err);
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res, next) => {
  try {
    await prisma.task.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    next(err);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Tasks API running at http://localhost:${PORT}`);
});
