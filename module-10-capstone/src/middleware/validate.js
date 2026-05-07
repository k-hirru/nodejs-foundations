function validateCreateNote(req, res, next) {
  const { title, content } = req.body;

  if (!title) return res.status(400).json({ error: "title is required" });
  if (title.length > 100)
    return res.status(400).json({ error: "title must be 100 characters or fewer" });

  if (!content) return res.status(400).json({ error: "content is required" });
  if (content.length > 5000)
    return res.status(400).json({ error: "content must be 5000 characters or fewer" });

  next();
}

function validateUpdateNote(req, res, next) {
  const { title, content } = req.body;

  if (title !== undefined && title.length > 100)
    return res.status(400).json({ error: "title must be 100 characters or fewer" });

  if (content !== undefined && content.length > 5000)
    return res.status(400).json({ error: "content must be 5000 characters or fewer" });

  next();
}

module.exports = { validateCreateNote, validateUpdateNote };
