const { z } = require("zod");

const SORTABLE_FIELDS = ["title", "content", "tag", "createdAt", "updatedAt"];

const createNoteSchema = z.object({
  title: z.string().min(1, "title is required").max(100, "title must be 100 characters or fewer"),
  content: z.string().min(1, "content is required").max(5000, "content must be 5000 characters or fewer"),
  tag: z.string().optional(),
});

const updateNoteSchema = createNoteSchema.partial();

const getNotesSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  sort: z
    .string()
    .refine(
      (val) => {
        const [field, direction] = val.split(":");
        return SORTABLE_FIELDS.includes(field) && (direction === "asc" || direction === "desc");
      },
      { message: "invalid sort format" }
    )
    .optional(),
  tag: z.string().optional(),
  q: z.string().optional(),
});

function validateGetNotes(req, res, next) {
  const result = getNotesSchema.safeParse(req.query);
  if (!result.success) {
    // invalid params are silently dropped rather than rejecting the request
    const { page, limit, sort, tag, q } = req.query;
    const rawPage = parseInt(page);
    const rawLimit = parseInt(limit);

    let validSort = sort;
    if (sort) {
      const [field, direction] = sort.split(":");
      if (!SORTABLE_FIELDS.includes(field) || (direction !== "asc" && direction !== "desc")) {
        validSort = undefined;
      }
    }

    res.locals.query = {
      page: !isNaN(rawPage) && rawPage >= 1 ? rawPage : undefined,
      limit: !isNaN(rawLimit) && rawLimit > 0 ? rawLimit : undefined,
      sort: validSort,
      tag,
      q,
    };
  } else {
    res.locals.query = result.data;
  }

  next();
}

function validateCreateNote(req, res, next) {
  const result = createNoteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  next();
}

function validateUpdateNote(req, res, next) {
  const result = updateNoteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors[0].message });
  }
  next();
}

module.exports = { validateGetNotes, validateCreateNote, validateUpdateNote };
