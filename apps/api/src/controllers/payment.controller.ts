import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { paymentGateway, reservations, meja, transaksi } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import {
    createSnapTransaction,
    verifyWebhookSignature,
    mapMidtransStatus,
} from '../services/midtrans.service.js';
import {
    emitPaymentConfirmed,
    emitTableUpdate,
} from '../services/socket.service.js';

/**
 * Generate a unique Midtrans order ID
 */
function generateMidtransOrderId(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RK-${dateStr}-${timeStr}${random}`;
}

export const paymentController = {
    /**
     * POST /api/payment/snap-token
     * Generate a Midtrans Snap token for the popup payment flow
     * Used for online reservation down payment (DP)
     */
    createSnapToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { reservationId, amount, customerName, customerEmail, customerPhone } = req.body;

            const orderId = generateMidtransOrderId();

            // Generate Snap token via Midtrans API
            const { token, redirect_url } = await createSnapTransaction({
                orderId,
                amount,
                customerName,
                customerEmail,
                customerPhone,
                items: [
                    {
                        id: 'DP-RESERVASI',
                        price: amount,
                        quantity: 1,
                        name: 'Uang Muka Reservasi - Ruang Kopi',
                    },
                ],
            });

            // Insert payment record into database
            const [payment] = await db
                .insert(paymentGateway)
                .values({
                    transaksiId: null, // Will be linked when transaction is created
                    reservasiId: reservationId || null,
                    orderIdMidtrans: orderId,
                    metodePembayaran: null,
                    statusPembayaran: 'pending',
                })
                .returning();

            // If this is for a reservation, lock the table
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

                    // Emit real-time table update
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

    /**
     * POST /api/payment/webhook
     * Handle Midtrans webhook notifications for payment status updates
     * Called by Midtrans server when payment status changes
     */
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

            // Verify webhook signature for security
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

            // Find the payment record
            const [payment] = await db
                .select()
                .from(paymentGateway)
                .where(eq(paymentGateway.orderIdMidtrans, order_id));

            if (!payment) {
                console.error('[Payment Webhook] Payment not found for order:', order_id);
                res.status(404).json({ error: 'Payment record not found' });
                return;
            }

            // Map Midtrans status to our internal status
            const internalStatus = mapMidtransStatus(transaction_status);

            // Update payment record
            await db
                .update(paymentGateway)
                .set({
                    statusPembayaran: internalStatus,
                    metodePembayaran: payment_type || payment.metodePembayaran,
                    waktuDibayar:
                        internalStatus === 'settlement' ? new Date() : payment.waktuDibayar,
                })
                .where(eq(paymentGateway.id, payment.id));

            // Handle reservation-related payment
            if (payment.reservasiId) {
                const [reservation] = await db
                    .select()
                    .from(reservations)
                    .where(eq(reservations.id, payment.reservasiId));

                if (reservation) {
                    if (internalStatus === 'settlement') {
                        // Update reservation status to 'dibayar'
                        await db
                            .update(reservations)
                            .set({ status: 'dibayar' })
                            .where(eq(reservations.id, reservation.id));

                        // Lock the table
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
                        // Release the table if payment failed/expired
                        if (reservation.mejaId) {
                            await db
                                .update(meja)
                                .set({ status: 'tersedia' })
                                .where(eq(meja.id, reservation.mejaId));

                            emitTableUpdate(reservation.mejaId, 'tersedia');
                        }

                        // Update reservation to 'batal'
                        await db
                            .update(reservations)
                            .set({ status: 'batal' })
                            .where(eq(reservations.id, reservation.id));
                    }
                }
            }

            // Handle transaction-related payment
            if (payment.transaksiId) {
                if (internalStatus === 'settlement') {
                    await db
                        .update(transaksi)
                        .set({ status: 'completed' })
                        .where(eq(transaksi.id, payment.transaksiId));
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
            // Always return 200 to Midtrans to prevent retries
            res.status(200).json({ status: 'error', message: 'Internal error, logged' });
        }
    },

    /**
     * GET /api/payment/status/:orderId
     * Check payment status (for frontend polling)
     */
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

    /**
     * GET /api/payment/by-reservation/:reservationId
     * Get payment info for a specific reservation
     */
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

    /**
     * GET /api/payment/all — Get all payment records (admin)
     */
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allPayments = await db.select().from(paymentGateway);
            res.json(allPayments);
        } catch (error) {
            next(error);
        }
    },
};
