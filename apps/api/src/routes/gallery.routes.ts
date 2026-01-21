import { Router } from 'express';
import { db } from '../db/index.js';
import { galleryImages } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

// Validation schema
const galleryImageSchema = z.object({
    src: z.string().url('Valid URL is required'),
    category: z.string().min(1, 'Category is required'),
    span: z.string().optional().nullable(),
    order: z.number().optional(),
});

const updateGalleryImageSchema = galleryImageSchema.partial();

// GET /api/gallery - Get all gallery images
router.get('/', async (req, res, next) => {
    try {
        const images = await db
            .select()
            .from(galleryImages)
            .orderBy(asc(galleryImages.order));

        res.json(images);
    } catch (error) {
        next(error);
    }
});

// POST /api/gallery - Create gallery image (protected)
router.post('/', authMiddleware, validate(galleryImageSchema), async (req, res, next) => {
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
});

// PUT /api/gallery/:id - Update gallery image (protected)
router.put('/:id', authMiddleware, validate(updateGalleryImageSchema), async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
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
});

// DELETE /api/gallery/:id - Delete gallery image (protected)
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

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
});

export default router;
