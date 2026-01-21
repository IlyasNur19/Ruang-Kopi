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

export default router;
