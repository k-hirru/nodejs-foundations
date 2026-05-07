const express = require("express");
const prisma = require("../db");
const { validateGetNotes, validateCreateNote, validateUpdateNote } = require("../middleware/validate");

const router = express.Router();

// Get all notes, sorted by lastest, filtered by a tag, and can be paginated
router.get("/notes", validateGetNotes, async (req, res, next) => {
  try {
    const { page, limit, tag, q, sort } = res.locals.query;
    const where = {};

    if (tag) where.tag = tag;

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { content: { contains: q } },
      ];
    }

    let orderBy = { createdAt: "desc" };
    if (sort) {
      const [field, direction] = sort.split(":");
      orderBy = { [field]: direction };
    }

    const total = await prisma.note.count({ where });
    const notes = await prisma.note.findMany({
      where: where,
      orderBy: orderBy,
      skip: page ? (page - 1) * (limit || 10) : undefined,
      take: limit || undefined,
    });

    res.json({
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        data: notes
    });
  } catch (err) {
    next(err);
  }
});

// Get a specific note by id
router.get("/notes/:id", async (req, res, next) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// Create a new note
router.post("/notes", validateCreateNote, async (req, res, next) => {
  try {
    const { title, content, tag } = req.body;
    const note = await prisma.note.create({
      data: { title, content, tag: tag || null },
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// Update a specific note by id
router.put("/notes/:id", validateUpdateNote, async (req, res, next) => {
  try {
    const note = await prisma.note.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(note);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Note not found" });
    }
    next(err);
  }
});

// Delete a specific note by id
router.delete("/notes/:id", async (req, res, next) => {
  try {
    await prisma.note.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Note not found" });
    }
    next(err);
  }
});

module.exports = router;
