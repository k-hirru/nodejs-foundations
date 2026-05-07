const SORTABLE_FIELDS = new Set(["title", "content", "tag", "createdAt", "updatedAt"]);

function validateGetNotes(req, res, next) {
  const rawPage = parseInt(req.query.page);
  const rawLimit = parseInt(req.query.limit);

  let sort = req.query.sort;
  if (sort) {
    const [field, direction] = sort.split(":");
    if (!SORTABLE_FIELDS.has(field) || (direction !== "asc" && direction !== "desc")) {
      sort = undefined;
    }
  }

  res.locals.query = {
    page: !isNaN(rawPage) && rawPage >= 1 ? rawPage : undefined,
    limit: !isNaN(rawLimit) && rawLimit > 0 ? rawLimit : undefined,
    sort,
    tag: req.query.tag,
    q: req.query.q,
  };

  next();
}

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

module.exports = { validateGetNotes, validateCreateNote, validateUpdateNote };
