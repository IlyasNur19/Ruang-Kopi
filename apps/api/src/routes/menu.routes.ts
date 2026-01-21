import { Router } from 'express';
import { db } from '../db/index.js';
import { menuItems, categories } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const menuItemSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    image: z.string().url().optional().nullable(),
    categoryId: z.number().optional().nullable(),
    available: z.boolean().optional(),
});

const updateMenuItemSchema = menuItemSchema.partial();

// GET /api/menu - Get all menu items
router.get('/', async (req, res, next) => {
    try {
        const items = await db
            .select({
                id: menuItems.id,
                name: menuItems.name,
                description: menuItems.description,
                price: menuItems.price,
                image: menuItems.image,
                categoryId: menuItems.categoryId,
                category: categories.name,
                available: menuItems.available,
                createdAt: menuItems.createdAt,
            })
            .from(menuItems)
            .leftJoin(categories, eq(menuItems.categoryId, categories.id));

        res.json(items);
    } catch (error) {
        next(error);
    }
});

// GET /api/menu/:id - Get single menu item
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const [item] = await db
            .select({
                id: menuItems.id,
                name: menuItems.name,
                description: menuItems.description,
                price: menuItems.price,
                image: menuItems.image,
                categoryId: menuItems.categoryId,
                category: categories.name,
                available: menuItems.available,
                createdAt: menuItems.createdAt,
            })
            .from(menuItems)
            .leftJoin(categories, eq(menuItems.categoryId, categories.id))
            .where(eq(menuItems.id, id));

        if (!item) {
            res.status(404).json({ error: 'Menu item not found' });
            return;
        }

        res.json(item);
    } catch (error) {
        next(error);
    }
});

// POST /api/menu - Create menu item (protected)
router.post('/', authMiddleware, validate(menuItemSchema), async (req, res, next) => {
    try {
        const { name, description, price, image, categoryId, available } = req.body;

        const [newItem] = await db
            .insert(menuItems)
            .values({
                name,
                description,
                price,
                image,
                categoryId,
                available: available ?? true,
            })
            .returning();

        res.status(201).json(newItem);
    } catch (error) {
        next(error);
    }
});

// PUT /api/menu/:id - Update menu item (protected)
router.put('/:id', authMiddleware, validate(updateMenuItemSchema), async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const updateData = req.body;

        const [updatedItem] = await db
            .update(menuItems)
            .set(updateData)
            .where(eq(menuItems.id, id))
            .returning();

        if (!updatedItem) {
            res.status(404).json({ error: 'Menu item not found' });
            return;
        }

        res.json(updatedItem);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/menu/:id - Delete menu item (protected)
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const [deletedItem] = await db
            .delete(menuItems)
            .where(eq(menuItems.id, id))
            .returning();

        if (!deletedItem) {
            res.status(404).json({ error: 'Menu item not found' });
            return;
        }

        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
