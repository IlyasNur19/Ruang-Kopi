import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { reservations, meja, users } from '../db/schema.js';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { emitNewReservation, emitTableUpdate } from '../services/socket.service.js';

export const reservationController = {
    // GET /api/reservations — Admin: get all reservations (optimized: batch enrichment)
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allReservations = await db
                .select()
                .from(reservations)
                .orderBy(desc(reservations.createdAt));

            if (allReservations.length === 0) {
                res.json([]);
                return;
            }

            // Collect unique IDs for batch lookup
            const mejaIds: number[] = [...new Set(
                allReservations
                    .filter((r) => r.mejaId !== null)
                    .map((r) => r.mejaId as number)
            )];
            const userIds: number[] = [...new Set(
                allReservations
                    .filter((r) => r.userId !== null)
                    .map((r) => r.userId as number)
            )];

            // Batch fetch all tables and users in 2 queries (instead of N×2)
            const [allMeja, allUsers] = await Promise.all([
                mejaIds.length > 0
                    ? db.select().from(meja).where(inArray(meja.id, mejaIds))
                    : Promise.resolve([]),
                userIds.length > 0
                    ? db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(inArray(users.id, userIds))
                    : Promise.resolve([]),
            ]);

            // Build lookup maps
            const mejaMap = new Map(allMeja.map((m) => [m.id, m]));
            const userMap = new Map(allUsers.map((u) => [u.id, u]));

            // Merge in memory (fast, single pass)
            const enriched = allReservations.map((r) => ({
                ...r,
                meja: r.mejaId ? mejaMap.get(r.mejaId) || null : null,
                user: r.userId ? userMap.get(r.userId) || null : null,
            }));

            res.json(enriched);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/reservations/:id — Get a single reservation
    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            const [reservation] = await db
                .select()
                .from(reservations)
                .where(eq(reservations.id, id));

            if (!reservation) {
                res.status(404).json({ error: 'Reservasi tidak ditemukan' });
                return;
            }

            // Enrich with table and user info
            let mejaInfo = null;
            if (reservation.mejaId) {
                const [m] = await db.select().from(meja).where(eq(meja.id, reservation.mejaId));
                mejaInfo = m || null;
            }
            let userInfo = null;
            if (reservation.userId) {
                const [u] = await db.select().from(users).where(eq(users.id, reservation.userId));
                userInfo = u ? { id: u.id, name: u.name, email: u.email } : null;
            }

            res.json({ ...reservation, meja: mejaInfo, user: userInfo });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/reservations — Customer creates a reservation (public)
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, phone, date, time, guests, mejaId } = req.body;

            // If mejaId is provided, check table availability
            if (mejaId) {
                const [table] = await db.select().from(meja).where(eq(meja.id, mejaId));

                if (!table) {
                    res.status(404).json({ error: 'Meja tidak ditemukan' });
                    return;
                }

                if (table.status !== 'tersedia') {
                    res.status(409).json({ error: 'Meja sudah tidak tersedia. Silakan pilih meja lain.' });
                    return;
                }

                // Check for existing reservations on same date/time/table
                const [existingReservation] = await db
                    .select()
                    .from(reservations)
                    .where(
                        and(
                            eq(reservations.mejaId, mejaId),
                            eq(reservations.date, date),
                            eq(reservations.time, time),
                        )
                    );

                if (
                    existingReservation &&
                    !['batal', 'selesai'].includes(existingReservation.status)
                ) {
                    res.status(409).json({
                        error: 'Meja sudah direservasi untuk tanggal dan waktu tersebut. Silakan pilih jadwal lain.',
                    });
                    return;
                }
            }

            // Create the reservation
            const [newReservation] = await db
                .insert(reservations)
                .values({
                    name,
                    phone,
                    date,
                    time,
                    guests,
                    mejaId: mejaId || null,
                    userId: req.user?.userId || null,
                    status: 'pending',
                })
                .returning();

            // If meja is selected, lock it temporarily
            if (mejaId) {
                await db
                    .update(meja)
                    .set({ status: 'direservasi' })
                    .where(eq(meja.id, mejaId));

                // Emit real-time notification
                emitTableUpdate(mejaId, 'direservasi');
            }

            // Emit new reservation notification to POS clients
            emitNewReservation(newReservation);

            res.status(201).json(newReservation);
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/reservations/:id — Admin: update reservation status
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            const updateData = req.body;

            const [existingReservation] = await db
                .select()
                .from(reservations)
                .where(eq(reservations.id, id));

            if (!existingReservation) {
                res.status(404).json({ error: 'Reservasi tidak ditemukan' });
                return;
            }

            const [updatedReservation] = await db
                .update(reservations)
                .set(updateData)
                .where(eq(reservations.id, id))
                .returning();

            // Handle table status changes based on reservation status
            if (updateData.status && existingReservation.mejaId) {
                const tableId = existingReservation.mejaId;

                if (updateData.status === 'batal' || updateData.status === 'selesai') {
                    // Release the table
                    await db
                        .update(meja)
                        .set({ status: 'tersedia' })
                        .where(eq(meja.id, tableId));

                    emitTableUpdate(tableId, 'tersedia');
                } else if (updateData.status === 'dibayar') {
                    // Confirm table lock
                    await db
                        .update(meja)
                        .set({ status: 'direservasi' })
                        .where(eq(meja.id, tableId));

                    emitTableUpdate(tableId, 'direservasi');
                }
            }

            // If a new mejaId is assigned
            if (updateData.mejaId && updateData.mejaId !== existingReservation.mejaId) {
                // Release old table if exists
                if (existingReservation.mejaId) {
                    await db
                        .update(meja)
                        .set({ status: 'tersedia' })
                        .where(eq(meja.id, existingReservation.mejaId));

                    emitTableUpdate(existingReservation.mejaId, 'tersedia');
                }

                // Lock new table
                await db
                    .update(meja)
                    .set({ status: 'direservasi' })
                    .where(eq(meja.id, updateData.mejaId));

                emitTableUpdate(updateData.mejaId, 'direservasi');
            }

            res.json(updatedReservation);
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/reservations/:id — Admin: delete a reservation
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);

            const [existingReservation] = await db
                .select()
                .from(reservations)
                .where(eq(reservations.id, id));

            if (!existingReservation) {
                res.status(404).json({ error: 'Reservasi tidak ditemukan' });
                return;
            }

            // Release the table if reserved
            if (existingReservation.mejaId) {
                await db
                    .update(meja)
                    .set({ status: 'tersedia' })
                    .where(eq(meja.id, existingReservation.mejaId));

                emitTableUpdate(existingReservation.mejaId, 'tersedia');
            }

            await db.delete(reservations).where(eq(reservations.id, id));

            res.json({ message: 'Reservasi berhasil dihapus' });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/reservations/available-tables — Public: get available tables for a date/time
    getAvailableTables: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { date, time } = req.query;

            if (!date || !time) {
                res.status(400).json({ error: 'Parameter date dan time diperlukan' });
                return;
            }

            // Get all tables
            const allTables = await db.select().from(meja);

            // Get reservations for given date/time that are not cancelled/completed
            const activeReservations = await db
                .select()
                .from(reservations)
                .where(
                    and(
                        eq(reservations.date, date as string),
                        eq(reservations.time, time as string),
                    )
                );

            // Filter out tables that are reserved or occupied
            const reservedMejaIds = new Set(
                activeReservations
                    .filter((r) => !['batal', 'selesai'].includes(r.status))
                    .map((r) => r.mejaId)
                    .filter(Boolean)
            );

            const availableTables = allTables.filter(
                (t) =>
                    t.status === 'tersedia' && !reservedMejaIds.has(t.id)
            );

            res.json({
                date,
                time,
                available: availableTables,
                total: allTables.length,
                availableCount: availableTables.length,
            });
        } catch (error) {
            next(error);
        }
    },
};
