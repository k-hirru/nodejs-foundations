import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../db";
import { createTagSchema } from "../schemas";
import { validate } from "../validate";

const router = Router();

// Create a tag
router.post("/", validate(createTagSchema), async(req: Request, res: Response, next: NextFunction) => {
    try {
        const tag = await prisma.tag.create({data: req.body});
        res.status(201).json(tag);
    } catch (err) {
        next(err);
    }
});

// Get all tags
router.get("/", async(req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = await prisma.tag.findMany();
        res.json(tags);
    } catch (err) {
        next(err);
    }
})

export default router;