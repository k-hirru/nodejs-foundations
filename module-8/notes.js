const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });

const app = express();
const prisma = new PrismaClient({ adapter });

app.use(express.json());

// Show all notes
app.get("/notes", async (req, res, next) => {
  try {
    const note = await prisma.note.findMany();
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// Show specific note
app.get("/notes/:id", async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// Add a new note
app.post("/notes", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!content)
      return res.status(400).json({ error: "Description is required" });

    const note = await prisma.note.create({
      data: { title, content },
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// Update an existing note
app.put("/notes/:id", async (req, res, next) => {
  try {
    const note = await prisma.note.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(note);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    next(err);
  }
});

// Delete an existing note
app.delete("/notes/:id", async (req, res, next) => {
  try {
    const note = await prisma.note.delete({
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
  console.log(`Notes API running at http://localhost:${PORT}`);
});
