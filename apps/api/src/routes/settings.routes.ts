import { Router } from 'express';
import { db } from '../db/index.js';
import { shopSettings } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

const router = Router();

// Validation schema
const statusSchema = z.object({
    status: z.enum(['available', 'busy', 'full']),
});

// GET /api/settings/status - Get shop status (public)
router.get('/status', async (req, res, next) => {
    try {
        const [setting] = await db
            .select()
            .from(shopSettings)
            .where(eq(shopSettings.key, 'status'));

        if (!setting) {
            // Return default if not found
            res.json({ status: 'available' });
            return;
        }

        res.json({ status: setting.value });
    } catch (error) {
        next(error);
    }
});

// PUT /api/settings/status - Update shop status (protected)
router.put('/status', authMiddleware, validate(statusSchema), async (req, res, next) => {
    try {
        const { status } = req.body;

        // Check if setting exists
        const [existing] = await db
            .select()
            .from(shopSettings)
            .where(eq(shopSettings.key, 'status'));

        if (existing) {
            // Update existing
            await db
                .update(shopSettings)
                .set({
                    value: status,
                    updatedAt: sql`CURRENT_TIMESTAMP`
                })
                .where(eq(shopSettings.key, 'status'));
        } else {
            // Create new
            await db
                .insert(shopSettings)
                .values({ key: 'status', value: status });
        }

        res.json({ status, message: 'Shop status updated successfully' });
    } catch (error) {
        next(error);
    }
});

// Space Images validation schema
const spaceImagesSchema = z.object({
    images: z.array(z.object({
        src: z.string().url(),
        title: z.string().min(1),
        caption: z.string().optional(),
    })),
});

// GET /api/settings/space-images - Get space images (public)
router.get('/space-images', async (req, res, next) => {
    try {
        const [setting] = await db
            .select()
            .from(shopSettings)
            .where(eq(shopSettings.key, 'space_images'));

        if (!setting) {
            // Return default images if not found
            res.json({
                images: [
                    { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80', title: 'Artisan Coffee', caption: 'Crafted to perfection' },
                    { src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80', title: 'Cozy Space', caption: 'Your daily sanctuary' },
                    { src: 'https://images.unsplash.com/photo-1442512595367-4273250913a9?auto=format&fit=crop&q=80', title: 'Cozy Interior', caption: 'Warmth in every corner' },
                ]
            });
            return;
        }

        res.json({ images: JSON.parse(setting.value) });
    } catch (error) {
        next(error);
    }
});

// PUT /api/settings/space-images - Update space images (protected)
router.put('/space-images', authMiddleware, validate(spaceImagesSchema), async (req, res, next) => {
    try {
        const { images } = req.body;
        const jsonValue = JSON.stringify(images);

        // Check if setting exists
        const [existing] = await db
            .select()
            .from(shopSettings)
            .where(eq(shopSettings.key, 'space_images'));

        if (existing) {
            await db
                .update(shopSettings)
                .set({
                    value: jsonValue,
                    updatedAt: sql`CURRENT_TIMESTAMP`
                })
                .where(eq(shopSettings.key, 'space_images'));
        } else {
            await db
                .insert(shopSettings)
                .values({ key: 'space_images', value: jsonValue });
        }

        res.json({ images, message: 'Space images updated successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
