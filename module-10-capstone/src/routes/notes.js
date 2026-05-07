const express = require("express");
const prisma = require("../db");

const router = express.Router();

// Get all notes, sorted by lastest, filtered by a tag, and can be paginated
router.get("/notes", async (req, res, next) => {
  try {
    const where = {};
    let page;
    let limit;

    // Filter by tag
    if (req.query.tag) {
      where.tag = req.query.tag;
    }

    // Case-insensitive search in title and content
    if (req.query.q) {
      where.OR = [
        { title: { contains: req.query.q } },
        { content: { contains: req.query.q } },
      ];
    }

    // Pagination
    if (req.query.page) {
      page = parseInt(req.query.page);
    }

    if (req.query.limit) {
      limit = parseInt(req.query.limit) || 10;
    }

    // Sorting
    let orderBy = { createdAt: "desc" };

    if (req.query.sort) {
      const [field, direction] = req.query.sort.split(":");
      if (field && (direction === "asc" || direction === "desc")) {
        orderBy = { [field]: direction };
      }
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
router.post("/notes", async (req, res, next) => {
  try {
    const { title, content, tag } = req.body;
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    } else if (title.length > 100) {
      return res
        .status(400)
        .json({ error: "title must have less than 100 characters" });
    }

    if (!content) {
      return res.status(400).json({ error: "content is required" });
    } else if (content.length > 5000) {
      return res
        .status(400)
        .json({ error: "content must have less than 5000 characters" });
    }

    const note = await prisma.note.create({
      data: { title, content, tag: tag || null },
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// Update a specific note by id
router.put("/notes/:id", async (req, res, next) => {
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
