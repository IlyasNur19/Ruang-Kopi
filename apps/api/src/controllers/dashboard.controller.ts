import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { transaksi, detailTransaksi } from '../db/schema.js';
import { desc, sql, eq } from 'drizzle-orm';

export const dashboardController = {
    // GET /api/dashboard/stats — Overall statistics
    getStats: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allTransaksiDb = await db
                .select()
                .from(transaksi)
                .orderBy(desc(transaksi.createdAt));

            // Today's transactions
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTransaksi = allTransaksiDb.filter(
                (t) => new Date(t.createdAt) >= today
            );

            // This month
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const monthTransaksi = allTransaksiDb.filter(
                (t) => new Date(t.createdAt) >= startOfMonth
            );

            const stats = {
                today: {
                    count: todayTransaksi.length,
                    revenue: todayTransaksi.reduce((sum, t) => sum + t.total, 0),
                },
                thisMonth: {
                    count: monthTransaksi.length,
                    revenue: monthTransaksi.reduce((sum, t) => sum + t.total, 0),
                },
                total: {
                    count: allTransaksiDb.length,
                    revenue: allTransaksiDb.reduce((sum, t) => sum + t.total, 0),
                },
                averagePerTransaction: allTransaksiDb.length
                    ? Math.round(
                          allTransaksiDb.reduce((sum, t) => sum + t.total, 0) /
                              allTransaksiDb.length
                      )
                    : 0,
            };

            res.json(stats);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/dashboard/revenue-daily — Daily revenue for chart
    getRevenueDaily: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate } = req.query;

            // Default to last 7 days
            const end = endDate
                ? new Date(endDate as string)
                : new Date();
            const start = startDate
                ? new Date(startDate as string)
                : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

            const allTransaksiDb = await db
                .select()
                .from(transaksi);

            // Group by date
            const revenueMap = new Map<string, number>();

            // Initialize all dates in range
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateKey = d.toISOString().slice(0, 10);
                revenueMap.set(dateKey, 0);
            }

            // Sum revenue by date
            allTransaksiDb.forEach((t) => {
                const dateKey = new Date(t.createdAt).toISOString().slice(0, 10);
                if (revenueMap.has(dateKey)) {
                    revenueMap.set(
                        dateKey,
                        (revenueMap.get(dateKey) || 0) + t.total
                    );
                }
            });

            const dailyRevenue = Array.from(revenueMap.entries()).map(
                ([date, revenue]) => ({ date, revenue })
            );

            res.json(dailyRevenue);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/dashboard/revenue-by-type — Revenue by order type
    getRevenueByType: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allTransaksiDb = await db
                .select()
                .from(transaksi);

            const byType = {
                dine_in: allTransaksiDb
                    .filter((t) => t.tipePesanan === 'dine_in')
                    .reduce((sum, t) => sum + t.total, 0),
                take_away: allTransaksiDb
                    .filter((t) => t.tipePesanan === 'take_away')
                    .reduce((sum, t) => sum + t.total, 0),
                online: allTransaksiDb
                    .filter((t) => t.tipePesanan === 'online')
                    .reduce((sum, t) => sum + t.total, 0),
            };

            // Also group by payment method
            const byPayment = {
                cash: allTransaksiDb
                    .filter((t) => t.paymentMethod === 'cash')
                    .reduce((sum, t) => sum + t.total, 0),
                qris: allTransaksiDb
                    .filter((t) => t.paymentMethod === 'qris')
                    .reduce((sum, t) => sum + t.total, 0),
            };

            res.json({
                byOrderType: [
                    { name: 'Online', value: byType.online },
                    { name: 'Dine In', value: byType.dine_in },
                    { name: 'Take Away', value: byType.take_away },
                ],
                byPaymentMethod: [
                    { name: 'Tunai', value: byPayment.cash },
                    { name: 'QRIS', value: byPayment.qris },
                ],
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/dashboard/recent-transactions — Recent transactions with items
    getRecentTransactions: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;

            const recentTransaksi = await db
                .select()
                .from(transaksi)
                .orderBy(desc(transaksi.createdAt))
                .limit(limit);

            // Fetch items for each transaction
            const result = await Promise.all(
                recentTransaksi.map(async (t) => {
                    const items = await db
                        .select()
                        .from(detailTransaksi)
                        .where(eq(detailTransaksi.transaksiId, t.id));
                    return { ...t, items };
                })
            );

            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};
