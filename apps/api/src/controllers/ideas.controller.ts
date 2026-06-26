import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { ideas } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { emitNewIdea } from '../services/socket.service.js';

export const ideasController = {
    // GET /api/ideas
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allIdeas = await db
                .select()
                .from(ideas)
                .orderBy(desc(ideas.createdAt));

            res.json(allIdeas);
        } catch (error) {
            next(error);
        }
    },

    // POST /api/ideas
    create: async (req: Request, res: Response, next: NextFunction) => {
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

            // Emit real-time notification to admin dashboard
            emitNewIdea(newIdea);

            res.status(201).json(newIdea);
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/ideas/:id
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
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
    },

    // DELETE /api/ideas/:id
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);

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
    },
};
