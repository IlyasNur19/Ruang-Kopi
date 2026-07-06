import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { paymentGateway, reservations, meja, transaksi, detailTransaksi } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import {
    createSnapTransaction,
    verifyWebhookSignature,
    mapMidtransStatus,
} from '../services/midtrans.service.js';
import {
    emitPaymentConfirmed,
    emitTableUpdate,
    emitNewTransaction,
} from '../services/socket.service.js';

function generateMidtransOrderId(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RK-${dateStr}-${timeStr}${random}`;
}

export const paymentController = {

    createSnapToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { reservationId, transaksiId, amount, customerName, customerEmail, customerPhone, items: requestItems } = req.body;

            const orderId = generateMidtransOrderId();

            let snapItems: Array<{ id: string; price: number; quantity: number; name: string }> = [];

            if (transaksiId) {

                const [existingTransaction] = await db
                    .select()
                    .from(transaksi)
                    .where(eq(transaksi.id, transaksiId));

                if (!existingTransaction) {
                    res.status(404).json({ error: 'Transaksi tidak ditemukan' });
                    return;
                }

                if (requestItems && requestItems.length > 0) {
                    snapItems = requestItems.map((item: { id?: string; menuId?: number; price: number; quantity?: number; qty?: number; name: string }) => ({
                        id: String(item.id || item.menuId || 'ITEM'),
                        price: item.price,
                        quantity: item.quantity || item.qty || 1,
                        name: item.name,
                    }));
                } else {
                    snapItems = [{
                        id: `TRX-${transaksiId}`,
                        price: amount,
                        quantity: 1,
                        name: `Pembayaran Transaksi #${existingTransaction.orderId}`,
                    }];
                }
            } else {

                snapItems = [{
                    id: 'DP-RESERVASI',
                    price: amount,
                    quantity: 1,
                    name: 'Uang Muka Reservasi - Ruang Kopi',
                }];
            }

            const { token, redirect_url } = await createSnapTransaction({
                orderId,
                amount,
                customerName,
                customerEmail,
                customerPhone,
                items: snapItems,
            });

            const [payment] = await db
                .insert(paymentGateway)
                .values({
                    transaksiId: transaksiId || null,
                    reservasiId: reservationId || null,
                    orderIdMidtrans: orderId,
                    metodePembayaran: null,
                    statusPembayaran: 'pending',
                })
                .returning();

            if (reservationId) {
                const [reservation] = await db
                    .select()
                    .from(reservations)
                    .where(eq(reservations.id, reservationId));

                if (reservation?.mejaId) {
                    await db
                        .update(meja)
                        .set({ status: 'direservasi' })
                        .where(eq(meja.id, reservation.mejaId));

                    emitPaymentConfirmed({
                        tableId: reservation.mejaId,
                        reservationId: reservation.id,
                        orderId,
                    });
                }
            }

            res.status(201).json({
                token,
                redirect_url,
                orderId,
                paymentId: payment.id,
            });
        } catch (error) {
            next(error);
        }
    },

    webhook: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                order_id,
                transaction_status,
                status_code,
                gross_amount,
                signature_key,
                payment_type,
                transaction_time,
            } = req.body;

            console.log('[Payment Webhook] Received:', {
                order_id,
                transaction_status,
                payment_type,
                status_code,
            });

            const isSignatureValid = verifyWebhookSignature(
                order_id,
                status_code,
                gross_amount,
                signature_key
            );

            if (!isSignatureValid) {
                console.error('[Payment Webhook] Invalid signature for order:', order_id);
                res.status(400).json({ error: 'Invalid signature' });
                return;
            }

            const [payment] = await db
                .select()
                .from(paymentGateway)
                .where(eq(paymentGateway.orderIdMidtrans, order_id));

            if (!payment) {
                console.error('[Payment Webhook] Payment not found for order:', order_id);
                res.status(404).json({ error: 'Payment record not found' });
                return;
            }

            const internalStatus = mapMidtransStatus(transaction_status);

            await db
                .update(paymentGateway)
                .set({
                    statusPembayaran: internalStatus,
                    metodePembayaran: payment_type || payment.metodePembayaran,
                    waktuDibayar:
                        internalStatus === 'settlement' ? new Date() : payment.waktuDibayar,
                })
                .where(eq(paymentGateway.id, payment.id));

            if (payment.reservasiId) {
                const [reservation] = await db
                    .select()
                    .from(reservations)
                    .where(eq(reservations.id, payment.reservasiId));

                if (reservation) {
                    if (internalStatus === 'settlement') {

                        await db
                            .update(reservations)
                            .set({ status: 'dibayar' })
                            .where(eq(reservations.id, reservation.id));

                        if (reservation.mejaId) {
                            await db
                                .update(meja)
                                .set({ status: 'direservasi' })
                                .where(eq(meja.id, reservation.mejaId));

                            emitPaymentConfirmed({
                                tableId: reservation.mejaId,
                                reservationId: reservation.id,
                                orderId: order_id,
                            });

                            emitTableUpdate(reservation.mejaId, 'direservasi');
                        }
                    } else if (internalStatus === 'cancel' || internalStatus === 'expire') {

                        if (reservation.mejaId) {
                            await db
                                .update(meja)
                                .set({ status: 'tersedia' })
                                .where(eq(meja.id, reservation.mejaId));

                            emitTableUpdate(reservation.mejaId, 'tersedia');
                        }

                        await db
                            .update(reservations)
                            .set({ status: 'batal' })
                            .where(eq(reservations.id, reservation.id));
                    }
                }
            }

            if (payment.transaksiId) {
                if (internalStatus === 'settlement') {
                    await db
                        .update(transaksi)
                        .set({ status: 'completed' })
                        .where(eq(transaksi.id, payment.transaksiId));

                    const [updatedTrx] = await db
                        .select()
                        .from(transaksi)
                        .where(eq(transaksi.id, payment.transaksiId));
                    if (updatedTrx) {
                        const trxItems = await db
                            .select()
                            .from(detailTransaksi)
                            .where(eq(detailTransaksi.transaksiId, updatedTrx.id));
                        emitNewTransaction({ ...updatedTrx, items: trxItems });
                    }
                } else if (internalStatus === 'cancel' || internalStatus === 'expire') {
                    await db
                        .update(transaksi)
                        .set({ status: 'cancelled' })
                        .where(eq(transaksi.id, payment.transaksiId));
                }
            }

            res.status(200).json({
                status: 'ok',
                message: `Payment status updated to ${internalStatus}`,
            });
        } catch (error) {
            console.error('[Payment Webhook] Error processing webhook:', error);

            res.status(200).json({ status: 'error', message: 'Internal error, logged' });
        }
    },

    getStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = req.params.orderId as string;

            const [payment] = await db
                .select()
                .from(paymentGateway)
                .where(eq(paymentGateway.orderIdMidtrans, orderId));

            if (!payment) {
                res.status(404).json({ error: 'Payment tidak ditemukan' });
                return;
            }

            res.json({
                orderId: payment.orderIdMidtrans,
                status: payment.statusPembayaran,
                metodePembayaran: payment.metodePembayaran,
                waktuDibayar: payment.waktuDibayar,
            });
        } catch (error) {
            next(error);
        }
    },

    getByReservation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reservationId = parseInt(req.params.reservationId as string);

            const [payment] = await db
                .select()
                .from(paymentGateway)
                .where(eq(paymentGateway.reservasiId, reservationId));

            if (!payment) {
                res.status(404).json({ error: 'Payment untuk reservasi ini tidak ditemukan' });
                return;
            }

            res.json(payment);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allPayments = await db.select().from(paymentGateway);
            res.json(allPayments);
        } catch (error) {
            next(error);
        }
    },
};
