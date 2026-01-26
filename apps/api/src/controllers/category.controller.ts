import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { categories } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const categoryController = {
    // GET /api/categories
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allCategories = await db.select().from(categories);
            res.json(allCategories);
        } catch (error) {
            next(error);
        }
    },

    // POST /api/categories
    create: async (req: Request, res: Response, next: NextFunction) => {
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
    },

    // DELETE /api/categories/:id
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);

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
    },
};
