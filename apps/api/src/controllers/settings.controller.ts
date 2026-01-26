import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { shopSettings } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export const settingsController = {
    // GET /api/settings/status
    getStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [setting] = await db
                .select()
                .from(shopSettings)
                .where(eq(shopSettings.key, 'status'));

            if (!setting) {
                res.json({ status: 'available' });
                return;
            }

            res.json({ status: setting.value });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/settings/status
    updateStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { status } = req.body;

            const [existing] = await db
                .select()
                .from(shopSettings)
                .where(eq(shopSettings.key, 'status'));

            if (existing) {
                await db
                    .update(shopSettings)
                    .set({
                        value: status,
                        updatedAt: sql`CURRENT_TIMESTAMP`
                    })
                    .where(eq(shopSettings.key, 'status'));
            } else {
                await db
                    .insert(shopSettings)
                    .values({ key: 'status', value: status });
            }

            res.json({ status, message: 'Shop status updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/settings/space-images
    getSpaceImages: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [setting] = await db
                .select()
                .from(shopSettings)
                .where(eq(shopSettings.key, 'space_images'));

            if (!setting) {
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
    },

    // PUT /api/settings/space-images
    updateSpaceImages: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { images } = req.body;
            const jsonValue = JSON.stringify(images);

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
    },

    // GET /api/settings/hero-image
    getHeroImage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [setting] = await db
                .select()
                .from(shopSettings)
                .where(eq(shopSettings.key, 'hero_image'));

            if (!setting) {
                // Default hero image
                res.json({
                    heroImage: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80'
                });
                return;
            }

            res.json({ heroImage: setting.value });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/settings/hero-image
    updateHeroImage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { heroImage } = req.body;

            const [existing] = await db
                .select()
                .from(shopSettings)
                .where(eq(shopSettings.key, 'hero_image'));

            if (existing) {
                await db
                    .update(shopSettings)
                    .set({
                        value: heroImage,
                        updatedAt: sql`CURRENT_TIMESTAMP`
                    })
                    .where(eq(shopSettings.key, 'hero_image'));
            } else {
                await db
                    .insert(shopSettings)
                    .values({ key: 'hero_image', value: heroImage });
            }

            res.json({ heroImage, message: 'Hero image updated successfully' });
        } catch (error) {
            next(error);
        }
    },
};
