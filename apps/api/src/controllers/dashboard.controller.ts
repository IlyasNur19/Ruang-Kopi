import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { transaksi, detailTransaksi } from '../db/schema.js';
import { desc, sql, inArray, and, gte, lte } from 'drizzle-orm';

export const dashboardController = {

    getStats: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            const todayResult = await db
                .select({
                    count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                    totalHpp: sql<number>`CAST(COALESCE(SUM(${transaksi.totalHpp}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .where(gte(transaksi.createdAt, today));

            const monthResult = await db
                .select({
                    count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                    totalHpp: sql<number>`CAST(COALESCE(SUM(${transaksi.totalHpp}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .where(gte(transaksi.createdAt, startOfMonth));

            const totalResult = await db
                .select({
                    count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                    totalHpp: sql<number>`CAST(COALESCE(SUM(${transaksi.totalHpp}), 0) AS INTEGER)`,
                })
                .from(transaksi);

            const todayStats = todayResult[0] || { count: 0, revenue: 0, totalHpp: 0 };
            const monthStats = monthResult[0] || { count: 0, revenue: 0, totalHpp: 0 };
            const totalStats = totalResult[0] || { count: 0, revenue: 0, totalHpp: 0 };

            const stats = {
                today: {
                    count: todayStats.count,
                    revenue: todayStats.revenue,
                    netProfit: todayStats.revenue - (todayStats.totalHpp || 0),
                },
                thisMonth: {
                    count: monthStats.count,
                    revenue: monthStats.revenue,
                    netProfit: monthStats.revenue - (monthStats.totalHpp || 0),
                },
                total: {
                    count: totalStats.count,
                    revenue: totalStats.revenue,
                    netProfit: totalStats.revenue - (totalStats.totalHpp || 0),
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

    getRevenueDaily: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate, days } = req.query;

            const end = endDate
                ? new Date(endDate as string)
                : new Date();
            end.setHours(23, 59, 59, 999);

            const start = startDate
                ? new Date(startDate as string)
                : new Date(end.getTime() - (parseInt(days as string) || 7) * 24 * 60 * 60 * 1000);
            start.setHours(0, 0, 0, 0);

            const rows = await db
                .select({
                    date: sql<string>`TO_CHAR((${transaksi.createdAt} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta'), 'YYYY-MM-DD')`,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                    totalHpp: sql<number>`CAST(COALESCE(SUM(${transaksi.totalHpp}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .where(
                    and(
                        gte(transaksi.createdAt, start),
                        lte(transaksi.createdAt, end),
                    )
                )
                .groupBy(sql`TO_CHAR((${transaksi.createdAt} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta'), 'YYYY-MM-DD')`)
                .orderBy(sql`TO_CHAR((${transaksi.createdAt} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta'), 'YYYY-MM-DD')`);

            const revenueMap = new Map<string, { revenue: number, netProfit: number }>();
            rows.forEach((row) => {
                revenueMap.set(row.date, { 
                    revenue: row.revenue, 
                    netProfit: row.revenue - (row.totalHpp || 0)
                });
            });

            const dailyRevenue: { date: string; revenue: number; netProfit: number }[] = [];
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                const data = revenueMap.get(dateKey) || { revenue: 0, netProfit: 0 };
                dailyRevenue.push({
                    date: dateKey,
                    revenue: data.revenue,
                    netProfit: data.netProfit,
                });
            }

            res.json(dailyRevenue);
        } catch (error) {
            next(error);
        }
    },

    getRevenueByType: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const byTypeRows = await db
                .select({
                    type: transaksi.tipePesanan,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .groupBy(transaksi.tipePesanan);

            const byPaymentRows = await db
                .select({
                    method: transaksi.paymentMethod,
                    revenue: sql<number>`CAST(COALESCE(SUM(${transaksi.total}), 0) AS INTEGER)`,
                })
                .from(transaksi)
                .groupBy(transaksi.paymentMethod);

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

    getRecentTransactions: async (req: Request, res: Response, next: NextFunction) => {
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

            const allItems = transaksiIds.length > 0
                ? await db
                    .select()
                    .from(detailTransaksi)
                    .where(inArray(detailTransaksi.transaksiId, transaksiIds))
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

            const enriched = recentTransaksi.map((t) => ({
                ...t,
                items: itemsByTransaksiId.get(t.id) || [],
            }));

            res.json(enriched);
        } catch (error) {
            next(error);
        }
    },

    getPopularMenus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const popularItems = await db
                .select({
                    menuId: detailTransaksi.menuId,
                    namaMenu: sql<string>`MAX(${detailTransaksi.namaMenu})`,
                    totalSold: sql<number>`CAST(SUM(${detailTransaksi.qty}) AS INTEGER)`,
                    totalRevenue: sql<number>`CAST(SUM(${detailTransaksi.subtotal}) AS INTEGER)`,
                    totalHpp: sql<number>`CAST(SUM(${detailTransaksi.hpp} * ${detailTransaksi.qty}) AS INTEGER)`,
                })
                .from(detailTransaksi)
                .where(sql`${detailTransaksi.menuId} IS NOT NULL`)
                .groupBy(detailTransaksi.menuId)
                .orderBy(desc(sql`SUM(${detailTransaksi.qty})`))
                .limit(10);
            
            const results = popularItems.map(item => ({
                menuId: item.menuId,
                namaMenu: item.namaMenu,
                totalSold: item.totalSold,
                totalRevenue: item.totalRevenue,
                netProfit: item.totalRevenue - (item.totalHpp || 0)
            }));

            res.json(results);
        } catch (error) {
            next(error);
        }
    }
};
