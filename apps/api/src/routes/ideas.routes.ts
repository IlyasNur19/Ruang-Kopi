import { Router } from 'express';
import { db } from '../db/index.js';
import { ideas } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createIdeaSchema = z.object({
    name: z.string().min(1, 'Nama harus diisi'),
    contact: z.string().optional(),
    topic: z.enum(['Soal Rasa', 'Suasana Ruang', 'Pelayanan', 'Ide Baru']),
    message: z.string().min(1, 'Pesan harus diisi'),
});

const updateIdeaSchema = z.object({
    status: z.enum(['Baru', 'Dibaca', 'Diproses', 'Selesai']).optional(),
});

// GET /api/ideas - Get all ideas (protected - admin only)
router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const allIdeas = await db
            .select()
            .from(ideas)
            .orderBy(desc(ideas.createdAt));

        res.json(allIdeas);
    } catch (error) {
        next(error);
    }
});

// POST /api/ideas - Create new idea (public - anyone can submit)
router.post('/', validate(createIdeaSchema), async (req, res, next) => {
    try {
        const { name, contact, topic, message } = req.body;

        const [newIdea] = await db
            .insert(ideas)
            .values({
                name,
                contact: contact || null,
                topic,
                message,
                status: 'Baru',
            })
            .returning();

        res.status(201).json(newIdea);
    } catch (error) {
        next(error);
    }
});

// PUT /api/ideas/:id - Update idea status (protected)
router.put('/:id', authMiddleware, validate(updateIdeaSchema), async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        const [updatedIdea] = await db
            .update(ideas)
            .set({ status })
            .where(eq(ideas.id, id))
            .returning();

        if (!updatedIdea) {
            res.status(404).json({ error: 'Idea not found' });
            return;
        }

        res.json(updatedIdea);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/ideas/:id - Delete idea (protected)
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const [deletedIdea] = await db
            .delete(ideas)
            .where(eq(ideas.id, id))
            .returning();

        if (!deletedIdea) {
            res.status(404).json({ error: 'Idea not found' });
            return;
        }

        res.json({ message: 'Idea deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
