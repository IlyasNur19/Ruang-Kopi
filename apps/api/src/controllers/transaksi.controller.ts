import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { transaksi, detailTransaksi, meja, reservations } from '../db/schema.js';
import { eq, desc, sql, and } from 'drizzle-orm';
import { emitNewTransaction, emitTableUpdate } from '../services/socket.service.js';

/**
 * Generate unique order ID
 */
function generateOrderId(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${dateStr}-${timeStr}${random}`;
}

export const transaksiController = {
    // POST /api/transaksi — Create new transaction (POS Checkout)
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                items,
                total,
                tableId,
                customerName,
                orderType,
                paymentMethod,
                amountPaid,
                change,
                reservationId,
            } = req.body;

            // Calculate subtotal and tax from items
            const subtotal = items.reduce(
                (sum: number, item: { subtotal: number }) => sum + item.subtotal,
                0
            );
            const tax = Math.round(subtotal * 0.11); // 11% PPN
            const orderId = generateOrderId();

            // Use a database transaction to ensure consistency
            const result = await db.transaction(async (tx) => {
                // 1. Insert transaction
                const [newTransaksi] = await tx
                    .insert(transaksi)
                    .values({
                        orderId,
                        reservasiId: reservationId || null,
                        mejaId: tableId || null,
                        userId: req.user?.userId || null,
                        customerName: customerName || null,
                        tipePesanan: orderType || 'dine_in',
                        paymentMethod: paymentMethod || 'cash',
                        subtotal,
                        tax,
                        total,
                        amountPaid: amountPaid || total,
                        change: change || 0,
                        status: 'completed',
                    })
                    .returning();

                // 2. Insert transaction items
                const detailItems = items.map(
                    (item: {
                        menuId: number;
                        name: string;
                        qty: number;
                        price: number;
                        subtotal: number;
                    }) => ({
                        transaksiId: newTransaksi.id,
                        menuId: item.menuId,
                        namaMenu: item.name,
                        qty: item.qty,
                        harga: item.price,
                        subtotal: item.subtotal,
                    })
                );

                await tx.insert(detailTransaksi).values(detailItems);

                // 3. Update table status to 'terisi' if tableId is provided (walk-in)
                if (tableId && !reservationId) {
                    await tx
                        .update(meja)
                        .set({ status: 'terisi' })
                        .where(eq(meja.id, tableId));
                }

                // 4. If this transaction is linked to a reservation, update reservation status
                if (reservationId) {
                    await tx
                        .update(reservations)
                        .set({ status: 'selesai' })
                        .where(eq(reservations.id, reservationId));
                }

                return newTransaksi;
            });

            // Fetch the complete transaction with items
            const items_result = await db
                .select()
                .from(detailTransaksi)
                .where(eq(detailTransaksi.transaksiId, result.id));

            const response = {
                ...result,
                items: items_result,
            };

            // Emit socket events for real-time updates
            emitNewTransaction(response);

            if (tableId) {
                const status = reservationId ? 'direservasi' : 'terisi';
                emitTableUpdate(tableId, status);
            }

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/transaksi — Get all transactions with optional date filters
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate, tipePesanan, page, limit } = req.query;

            let query = db.select().from(transaksi).orderBy(desc(transaksi.createdAt));

            if (startDate) {
                query = query.where(
                    sql`${transaksi.createdAt} >= ${startDate}::timestamp`
                ) as any;
            }
            if (endDate) {
                query = query.where(
                    sql`${transaksi.createdAt} <= ${endDate}::timestamp`
                ) as any;
            }
            if (tipePesanan && typeof tipePesanan === 'string' && ['online', 'dine_in', 'take_away'].includes(tipePesanan)) {
                query = query.where(eq(transaksi.tipePesanan, tipePesanan)) as any;
            }

            const allTransaksi = await query;

            // Enrich with table and reservation info
            const enriched = await Promise.all(
                allTransaksi.map(async (t) => {
                    let mejaInfo = null;
                    if (t.mejaId) {
                        const [m] = await db.select().from(meja).where(eq(meja.id, t.mejaId));
                        mejaInfo = m || null;
                    }
                    let reservasiInfo = null;
                    if (t.reservasiId) {
                        const [r] = await db
                            .select()
                            .from(reservations)
                            .where(eq(reservations.id, t.reservasiId));
                        reservasiInfo = r || null;
                    }
                    return { ...t, meja: mejaInfo, reservasi: reservasiInfo };
                })
            );

            res.json(enriched);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/transaksi/recent?limit=10 — Get recent transactions with items
    getRecent: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;

            const recentTransaksi = await db
                .select()
                .from(transaksi)
                .orderBy(desc(transaksi.createdAt))
                .limit(limit);

            // Enrich with items and table info
            const enriched = await Promise.all(
                recentTransaksi.map(async (t) => {
                    const items = await db
                        .select()
                        .from(detailTransaksi)
                        .where(eq(detailTransaksi.transaksiId, t.id));

                    let mejaInfo = null;
                    if (t.mejaId) {
                        const [m] = await db.select().from(meja).where(eq(meja.id, t.mejaId));
                        mejaInfo = m || null;
                    }

                    return { ...t, items, meja: mejaInfo };
                })
            );

            res.json(enriched);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/transaksi/summary — Get transaction summary for dashboard
    getSummary: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate } = req.query;

            let query = db.select().from(transaksi);

            if (startDate) {
                query = query.where(
                    sql`${transaksi.createdAt} >= ${startDate}::timestamp`
                ) as any;
            }
            if (endDate) {
                query = query.where(
                    sql`${transaksi.createdAt} <= ${endDate}::timestamp`
                ) as any;
            }

            const allTransaksi = await query;

            const summary = {
                totalTransaksi: allTransaksi.length,
                totalPendapatan: allTransaksi.reduce(
                    (sum, t) => sum + t.total,
                    0
                ),
                rataRata: allTransaksi.length
                    ? Math.round(
                          allTransaksi.reduce((sum, t) => sum + t.total, 0) /
                              allTransaksi.length
                      )
                    : 0,
                cash: allTransaksi
                    .filter((t) => t.paymentMethod === 'cash')
                    .reduce((sum, t) => sum + t.total, 0),
                qris: allTransaksi
                    .filter((t) => t.paymentMethod === 'qris')
                    .reduce((sum, t) => sum + t.total, 0),
                online: allTransaksi
                    .filter((t) => t.tipePesanan === 'online')
                    .reduce((sum, t) => sum + t.total, 0),
                dineIn: allTransaksi
                    .filter((t) => t.tipePesanan === 'dine_in')
                    .reduce((sum, t) => sum + t.total, 0),
                takeAway: allTransaksi
                    .filter((t) => t.tipePesanan === 'take_away')
                    .reduce((sum, t) => sum + t.total, 0),
            };

            res.json(summary);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/transaksi/:id — Get transaction by ID with items
    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);

            const [result] = await db
                .select()
                .from(transaksi)
                .where(eq(transaksi.id, id));

            if (!result) {
                res.status(404).json({ error: 'Transaksi tidak ditemukan' });
                return;
            }

            const items = await db
                .select()
                .from(detailTransaksi)
                .where(eq(detailTransaksi.transaksiId, id));

            // Enrich with related info
            let mejaInfo = null;
            if (result.mejaId) {
                const [m] = await db.select().from(meja).where(eq(meja.id, result.mejaId));
                mejaInfo = m || null;
            }

            let reservasiInfo = null;
            if (result.reservasiId) {
                const [r] = await db
                    .select()
                    .from(reservations)
                    .where(eq(reservations.id, result.reservasiId));
                reservasiInfo = r || null;
            }

            res.json({ ...result, items, meja: mejaInfo, reservasi: reservasiInfo });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/transaksi/:id/cancel — Cancel a transaction
    cancel: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);

            const [existingTransaksi] = await db
                .select()
                .from(transaksi)
                .where(eq(transaksi.id, id));

            if (!existingTransaksi) {
                res.status(404).json({ error: 'Transaksi tidak ditemukan' });
                return;
            }

            if (existingTransaksi.status === 'cancelled') {
                res.status(400).json({ error: 'Transaksi sudah dibatalkan' });
                return;
            }

            // Cancel the transaction
            const [updatedTransaksi] = await db
                .update(transaksi)
                .set({ status: 'cancelled' })
                .where(eq(transaksi.id, id))
                .returning();

            // Release the table if occupied
            if (existingTransaksi.mejaId && !existingTransaksi.reservasiId) {
                await db
                    .update(meja)
                    .set({ status: 'tersedia' })
                    .where(eq(meja.id, existingTransaksi.mejaId));

                emitTableUpdate(existingTransaksi.mejaId, 'tersedia');
            }

            res.json(updatedTransaksi);
        } catch (error) {
            next(error);
        }
    },
};
