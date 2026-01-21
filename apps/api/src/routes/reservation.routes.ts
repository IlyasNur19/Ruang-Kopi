import { Router } from 'express';
import { db } from '../db/index.js';
import { reservations } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createReservationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    guests: z.number().min(1, 'At least 1 guest required'),
});

const updateReservationSchema = z.object({
    status: z.enum(['Pending', 'Confirmed', 'Completed', 'Cancelled']).optional(),
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    guests: z.number().min(1).optional(),
});

// GET /api/reservations - Get all reservations (protected)
router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const allReservations = await db
            .select()
            .from(reservations)
            .orderBy(desc(reservations.createdAt));

        res.json(allReservations);
    } catch (error) {
        next(error);
    }
});

// GET /api/reservations/:id - Get single reservation (protected)
router.get('/:id', authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const [reservation] = await db
            .select()
            .from(reservations)
            .where(eq(reservations.id, id));

        if (!reservation) {
            res.status(404).json({ error: 'Reservation not found' });
            return;
        }

        res.json(reservation);
    } catch (error) {
        next(error);
    }
});

// POST /api/reservations - Create reservation (public - customers can book)
router.post('/', validate(createReservationSchema), async (req, res, next) => {
    try {
        const { name, phone, date, time, guests } = req.body;

        const [newReservation] = await db
            .insert(reservations)
            .values({
                name,
                phone,
                date,
                time,
                guests,
                status: 'Pending',
            })
            .returning();

        res.status(201).json(newReservation);
    } catch (error) {
        next(error);
    }
});

// PUT /api/reservations/:id - Update reservation (protected)
router.put('/:id', authMiddleware, validate(updateReservationSchema), async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const updateData = req.body;

        const [updatedReservation] = await db
            .update(reservations)
            .set(updateData)
            .where(eq(reservations.id, id))
            .returning();

        if (!updatedReservation) {
            res.status(404).json({ error: 'Reservation not found' });
            return;
        }

        res.json(updatedReservation);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/reservations/:id - Delete reservation (protected)
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const [deletedReservation] = await db
            .delete(reservations)
            .where(eq(reservations.id, id))
            .returning();

        if (!deletedReservation) {
            res.status(404).json({ error: 'Reservation not found' });
            return;
        }

        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
