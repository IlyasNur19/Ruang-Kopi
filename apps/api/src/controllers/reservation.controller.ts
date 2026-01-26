import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { reservations } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const reservationController = {
    // GET /api/reservations
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allReservations = await db
                .select()
                .from(reservations)
                .orderBy(desc(reservations.createdAt));

            res.json(allReservations);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/reservations/:id
    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
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
    },

    // POST /api/reservations
    create: async (req: Request, res: Response, next: NextFunction) => {
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
    },

    // PUT /api/reservations/:id
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
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
    },

    // DELETE /api/reservations/:id
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);

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
    },
};
