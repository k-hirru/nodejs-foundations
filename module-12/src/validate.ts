import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { HttpError } from "./middleware";

function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new HttpError(400, result.error.issues[0]?.message ?? "Validation failed"));
    }
    next();
  };
}

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "title is required")
    .max(100, "title must be 100 characters or fewer"),
});

export const validateCreateTask = validateBody(createTaskSchema);
