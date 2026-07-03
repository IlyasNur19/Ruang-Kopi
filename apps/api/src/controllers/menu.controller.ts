import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { menuItems, categories, detailTransaksi } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const menuController = {
    // GET /api/menu
    getAll: async (req: Request, res: Response, next: NextFunction) => {
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
    },

    // GET /api/menu/:id
    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
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
    },

    // POST /api/menu
    create: async (req: Request, res: Response, next: NextFunction) => {
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
    },

    // PUT /api/menu/:id
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
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
    },

    // DELETE /api/menu/:id
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);

            // Remove foreign key references in detail_transaksi before deleting the menu item
            // This prevents the "violates foreign key constraint" error
            await db
                .update(detailTransaksi)
                .set({ menuId: null })
                .where(eq(detailTransaksi.menuId, id));

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
    },
};
