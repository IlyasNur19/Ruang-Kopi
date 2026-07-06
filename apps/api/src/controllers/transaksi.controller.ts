import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { transaksi, detailTransaksi, meja, reservations } from '../db/schema.js';
import { eq, desc, sql, and, inArray, gte, lte } from 'drizzle-orm';
import { emitNewTransaction, emitTableUpdate } from '../services/socket.service.js';

function generateOrderId(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${dateStr}-${timeStr}${random}`;
}

export const transaksiController = {

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

            const subtotal = items.reduce(
                (sum: number, item: { subtotal: number }) => sum + item.subtotal,
                0
            );
            const tax = Math.round(subtotal * 0.11);
            const orderId = generateOrderId();

            const result = await db.transaction(async (tx) => {

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
                        status: paymentMethod === 'cash' ? 'completed' : 'pending',
                    })
                    .returning();

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

                if (tableId && !reservationId) {
                    await tx
                        .update(meja)
                        .set({ status: 'terisi' })
                        .where(eq(meja.id, tableId));
                }

                if (reservationId) {
                    await tx
                        .update(reservations)
                        .set({ status: 'selesai' })
                        .where(eq(reservations.id, reservationId));
                }

                return newTransaksi;
            });

            const items_result = await db
                .select()
                .from(detailTransaksi)
                .where(eq(detailTransaksi.transaksiId, result.id));

            const response = {
                ...result,
                items: items_result,
            };

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

            if (allTransaksi.length === 0) {
                res.json([]);
                return;
            }

            const mejaIds: number[] = [...new Set(
                allTransaksi
                    .filter((t) => t.mejaId !== null)
                    .map((t) => t.mejaId as number)
            )];
            const reservasiIds: number[] = [...new Set(
                allTransaksi
                    .filter((t) => t.reservasiId !== null)
                    .map((t) => t.reservasiId as number)
            )];

            const [allMeja, allReservasi] = await Promise.all([
                mejaIds.length > 0
                    ? db.select().from(meja).where(inArray(meja.id, mejaIds))
                    : Promise.resolve([]),
                reservasiIds.length > 0
                    ? db.select().from(reservations).where(inArray(reservations.id, reservasiIds))
                    : Promise.resolve([]),
            ]);

            const mejaMap = new Map(allMeja.map((m) => [m.id, m]));
            const reservasiMap = new Map(allReservasi.map((r) => [r.id, r]));

            const enriched = allTransaksi.map((t) => ({
                ...t,
                meja: t.mejaId ? mejaMap.get(t.mejaId) || null : null,
                reservasi: t.reservasiId ? reservasiMap.get(t.reservasiId) || null : null,
            }));

            res.json(enriched);
        } catch (error) {
            next(error);
        }
    },

    getRecent: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;

            const recentTransaksi = await db
                .select()
                .from(transaksi)
                .orderBy(desc(transaksi.createdAt))
                .limit(limit);

            if (recentTransaksi.length === 0) {
                res.json([]);
                return;
            }

            const transaksiIds: number[] = recentTransaksi
                .map((t) => t.id)
                .filter((id): id is number => id !== null);
            const mejaIds: number[] = [...new Set(
                recentTransaksi
                    .filter((t) => t.mejaId !== null)
                    .map((t) => t.mejaId as number)
            )];

            const allItems = await db
                .select()
                .from(detailTransaksi)
                .where(inArray(detailTransaksi.transaksiId, transaksiIds));

            const allMeja = mejaIds.length > 0
                ? await db.select().from(meja).where(inArray(meja.id, mejaIds))
                : [];

            const itemsByTransaksiId = new Map<number, typeof allItems>();
            allItems.forEach((item) => {
                const tid = item.transaksiId;
                if (tid === null) return;
                const existing = itemsByTransaksiId.get(tid);
                if (existing) {
                    existing.push(item);
                } else {
                    itemsByTransaksiId.set(tid, [item]);
                }
            });

            const mejaMap = new Map(allMeja.map((m) => [m.id, m]));

            const enriched = recentTransaksi.map((t) => ({
                ...t,
                items: itemsByTransaksiId.get(t.id) || [],
                meja: t.mejaId ? mejaMap.get(t.mejaId) || null : null,
            }));

            res.json(enriched);
        } catch (error) {
            next(error);
        }
    },

    getSummary: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate } = req.query;

            const conditions = [];
            if (startDate) {
                conditions.push(gte(transaksi.createdAt, new Date(startDate as string)));
            }
            if (endDate) {
                conditions.push(lte(transaksi.createdAt, new Date(endDate as string)));
            }

            const [result] = await db
                .select({
                    totalTransaksi: sql<number>`CAST(COUNT(*) AS INTEGER)`,
                    totalPendapatan: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                    cashRevenue: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${transaksi.paymentMethod} = 'cash' THEN ${transaksi.total} ELSE 0 END), 0) AS INTEGER)`,
                    qrisRevenue: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${transaksi.paymentMethod} = 'qris' THEN ${transaksi.total} ELSE 0 END), 0) AS INTEGER)`,
                    onlineRevenue: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${transaksi.tipePesanan} = 'online' THEN ${transaksi.total} ELSE 0 END), 0) AS INTEGER)`,
                    dineInRevenue: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${transaksi.tipePesanan} = 'dine_in' THEN ${transaksi.total} ELSE 0 END), 0) AS INTEGER)`,
                    takeAwayRevenue: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${transaksi.tipePesanan} = 'take_away' THEN ${transaksi.total} ELSE 0 END), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .where(conditions.length > 0 ? and(...conditions) : undefined);

            const summary = {
                totalTransaksi: result?.totalTransaksi || 0,
                totalPendapatan: result?.totalPendapatan || 0,
                rataRata: result?.totalTransaksi
                    ? Math.round((result.totalPendapatan || 0) / result.totalTransaksi)
                    : 0,
                cash: result?.cashRevenue || 0,
                qris: result?.qrisRevenue || 0,
                online: result?.onlineRevenue || 0,
                dineIn: result?.dineInRevenue || 0,
                takeAway: result?.takeAwayRevenue || 0,
            };

            res.json(summary);
        } catch (error) {
            next(error);
        }
    },

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

            const [updatedTransaksi] = await db
                .update(transaksi)
                .set({ status: 'cancelled' })
                .where(eq(transaksi.id, id))
                .returning();

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
