import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { transaksi, detailTransaksi } from '../db/schema.js';
import { desc, sql, inArray, and, gte, lte } from 'drizzle-orm';

export const dashboardController = {
    // GET /api/dashboard/stats — Overall statistics (optimized with SQL aggregation)
    getStats: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get today's date at midnight
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Start of this month
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            // Use SQL aggregation — push computation to the database, not Node.js memory
            const todayResult = await db
                .select({
                    count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .where(gte(transaksi.createdAt, today));

            const monthResult = await db
                .select({
                    count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .where(gte(transaksi.createdAt, startOfMonth));

            const totalResult = await db
                .select({
                    count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                })
                .from(transaksi);

            const todayStats = todayResult[0] || { count: 0, revenue: 0 };
            const monthStats = monthResult[0] || { count: 0, revenue: 0 };
            const totalStats = totalResult[0] || { count: 0, revenue: 0 };

            const stats = {
                today: {
                    count: todayStats.count,
                    revenue: todayStats.revenue,
                },
                thisMonth: {
                    count: monthStats.count,
                    revenue: monthStats.revenue,
                },
                total: {
                    count: totalStats.count,
                    revenue: totalStats.revenue,
                },
                averagePerTransaction: totalStats.count
                    ? Math.round(totalStats.revenue / totalStats.count)
                    : 0,
            };

            res.json(stats);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/dashboard/revenue-daily — Daily revenue for chart (optimized with SQL GROUP BY)
    getRevenueDaily: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate, days } = req.query;

            // Default to last 7 days
            const end = endDate
                ? new Date(endDate as string)
                : new Date();
            end.setHours(23, 59, 59, 999);

            const start = startDate
                ? new Date(startDate as string)
                : new Date(end.getTime() - (parseInt(days as string) || 7) * 24 * 60 * 60 * 1000);
            start.setHours(0, 0, 0, 0);

            // SQL GROUP BY query — only returns dates that have transactions
            const rows = await db
                .select({
                    date: sql<string>`TO_CHAR(${transaksi.createdAt}::timestamp, 'YYYY-MM-DD')`,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .where(
                    and(
                        gte(transaksi.createdAt, start),
                        lte(transaksi.createdAt, end),
                    )
                )
                .groupBy(sql`TO_CHAR(${transaksi.createdAt}::timestamp, 'YYYY-MM-DD')`)
                .orderBy(sql`TO_CHAR(${transaksi.createdAt}::timestamp, 'YYYY-MM-DD')`);

            // Build a map of existing results
            const revenueMap = new Map<string, number>();
            rows.forEach((row) => {
                revenueMap.set(row.date, row.revenue);
            });

            // Fill in missing dates with 0
            const dailyRevenue: { date: string; revenue: number }[] = [];
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateKey = d.toISOString().slice(0, 10);
                dailyRevenue.push({
                    date: dateKey,
                    revenue: revenueMap.get(dateKey) || 0,
                });
            }

            res.json(dailyRevenue);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/dashboard/revenue-by-type — Revenue by order type (optimized with SQL GROUP BY)
    getRevenueByType: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Single query grouped by order type
            const byTypeRows = await db
                .select({
                    type: transaksi.tipePesanan,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .groupBy(transaksi.tipePesanan);

            // Single query grouped by payment method
            const byPaymentRows = await db
                .select({
                    method: transaksi.paymentMethod,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .groupBy(transaksi.paymentMethod);

            // Build result maps
            const typeMap: Record<string, number> = { dine_in: 0, take_away: 0, online: 0 };
            byTypeRows.forEach((row) => {
                if (typeMap.hasOwnProperty(row.type)) {
                    typeMap[row.type] = row.revenue;
                }
            });

            const paymentMap: Record<string, number> = { cash: 0, qris: 0 };
            byPaymentRows.forEach((row) => {
                if (paymentMap.hasOwnProperty(row.method)) {
                    paymentMap[row.method] = row.revenue;
                }
            });

            res.json({
                byOrderType: [
                    { name: 'Online', value: typeMap.online },
                    { name: 'Dine In', value: typeMap.dine_in },
                    { name: 'Take Away', value: typeMap.take_away },
                ],
                byPaymentMethod: [
                    { name: 'Tunai', value: paymentMap.cash },
                    { name: 'QRIS', value: paymentMap.qris },
                ],
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/dashboard/recent-transactions — Recent transactions with items (optimized: single batch query)
    getRecentTransactions: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;

            // 1. Fetch recent transactions
            const recentTransaksi = await db
                .select()
                .from(transaksi)
                .orderBy(desc(transaksi.createdAt))
                .limit(limit);

            if (recentTransaksi.length === 0) {
                res.json([]);
                return;
            }

            // 2. Single batch query to get ALL items for ALL recent transactions
            const transaksiIds: number[] = recentTransaksi
                .map((t) => t.id)
                .filter((id): id is number => id !== null);

            const allItems = transaksiIds.length > 0
                ? await db
                    .select()
                    .from(detailTransaksi)
                    .where(inArray(detailTransaksi.transaksiId, transaksiIds))
                : [];

            // 3. Group items by transaction ID in memory (fast, single pass)
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

            // 4. Merge
            const result = recentTransaksi.map((t) => ({
                ...t,
                items: itemsByTransaksiId.get(t.id) || [],
            }));

            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};
