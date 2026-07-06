import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { meja } from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const mejaController = {

    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allMeja = await db
                .select()
                .from(meja)
                .orderBy(asc(meja.nomor_meja));

            res.json(allMeja);
        } catch (error) {
            next(error);
        }
    },

    getStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allMeja = await db.select().from(meja);

            const counts = {
                tersedia: allMeja.filter((m) => m.status === 'tersedia').length,
                direservasi: allMeja.filter((m) => m.status === 'direservasi').length,
                terisi: allMeja.filter((m) => m.status === 'terisi').length,
                total: allMeja.length,
                tables: allMeja,
            };

            res.json(counts);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            const [table] = await db
                .select()
                .from(meja)
                .where(eq(meja.id, id));

            if (!table) {
                res.status(404).json({ error: 'Meja tidak ditemukan' });
                return;
            }

            res.json(table);
        } catch (error) {
            next(error);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { nomor_meja, kapasitas, status } = req.body;

            const [newMeja] = await db
                .insert(meja)
                .values({
                    nomor_meja,
                    kapasitas: kapasitas ?? 4,
                    status: status ?? 'tersedia',
                })
                .returning();

            res.status(201).json(newMeja);
        } catch (error) {
            next(error);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            const updateData = req.body;

            const [updatedMeja] = await db
                .update(meja)
                .set(updateData)
                .where(eq(meja.id, id))
                .returning();

            if (!updatedMeja) {
                res.status(404).json({ error: 'Meja tidak ditemukan' });
                return;
            }

            res.json(updatedMeja);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);

            const [deletedMeja] = await db
                .delete(meja)
                .where(eq(meja.id, id))
                .returning();

            if (!deletedMeja) {
                res.status(404).json({ error: 'Meja tidak ditemukan' });
                return;
            }

            res.json({ message: 'Meja berhasil dihapus' });
        } catch (error) {
            next(error);
        }
    },
};
