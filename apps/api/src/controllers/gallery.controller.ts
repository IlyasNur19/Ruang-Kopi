import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { galleryImages } from '../db/schema.js';
import { eq, asc, sql } from 'drizzle-orm';

export const galleryController = {
    // GET /api/gallery
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const images = await db
                .select()
                .from(galleryImages)
                .orderBy(asc(galleryImages.order));

            res.json(images);
        } catch (error) {
            next(error);
        }
    },

    // POST /api/gallery
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { src, category, span, order } = req.body;

            const [newImage] = await db
                .insert(galleryImages)
                .values({
                    src,
                    category,
                    span,
                    order: order ?? 0,
                })
                .returning();

            res.status(201).json(newImage);
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/gallery/reorder
    reorder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { images } = req.body;

            for (const img of images) {
                await db.execute(
                    sql`UPDATE gallery_images SET "order" = ${img.order} WHERE id = ${img.id}`
                );
            }

            res.json({ message: 'Gallery order updated successfully' });
        } catch (error) {
            console.error('Reorder error:', error);
            next(error);
        }
    },

    // PUT /api/gallery/:id
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            const updateData = req.body;

            const [updatedImage] = await db
                .update(galleryImages)
                .set(updateData)
                .where(eq(galleryImages.id, id))
                .returning();

            if (!updatedImage) {
                res.status(404).json({ error: 'Gallery image not found' });
                return;
            }

            res.json(updatedImage);
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/gallery/:id
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);

            const [deletedImage] = await db
                .delete(galleryImages)
                .where(eq(galleryImages.id, id))
                .returning();

            if (!deletedImage) {
                res.status(404).json({ error: 'Gallery image not found' });
                return;
            }

            res.json({ message: 'Gallery image deleted successfully' });
        } catch (error) {
            next(error);
        }
    },
};
