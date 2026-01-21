import { Router } from 'express';
import { db } from '../db/index.js';
import { categories } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
});

// GET /api/categories - Get all categories
router.get('/', async (req, res, next) => {
    try {
        const allCategories = await db.select().from(categories);
        res.json(allCategories);
    } catch (error) {
        next(error);
    }
});

// POST /api/categories - Create category (protected)
router.post('/', authMiddleware, validate(categorySchema), async (req, res, next) => {
    try {
        const { name, slug } = req.body;

        const [newCategory] = await db
            .insert(categories)
            .values({ name, slug })
            .returning();

        res.status(201).json(newCategory);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/categories/:id - Delete category (protected)
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const [deletedCategory] = await db
            .delete(categories)
            .where(eq(categories.id, id))
            .returning();

        if (!deletedCategory) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
