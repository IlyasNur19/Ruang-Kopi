import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Loader2, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { formatCurrency } from '../../lib/utils';
import useCartStore from '../../stores/cartStore';
import useUIStore from '../../stores/uiStore';
import { transaksiApi, paymentApi } from '../../services/api';
import { loadSnapScript, openSnapPopup } from '../../lib/midtrans';
import PaymentMethodSelector from './PaymentMethodSelector';

const CheckoutModal = () => {
    const setOpen = useUIStore((s) => s.setPosCheckoutOpen);
    const { items, getSummary, tableId, customerName, orderType, clearCart } = useCartStore();

    const [step, setStep] = useState('payment'); // 'payment' | 'processing' | 'midtrans' | 'success'
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amountPaid, setAmountPaid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const total = getSummary().total;
    const change = amountPaid ? Math.max(0, parseInt(amountPaid) - total) : 0;

    // Preload Midtrans Snap script when non-cash payment is selected
    useEffect(() => {
        if (paymentMethod !== 'cash') {
            loadSnapScript().catch(() => {});
        }
    }, [paymentMethod]);

    const isMidtransPayment = paymentMethod === 'qris' || paymentMethod === 'card';

    const handleCheckout = async () => {
        if (paymentMethod === 'cash' && (!amountPaid || parseInt(amountPaid) < total)) {
            setError('Jumlah pembayaran kurang.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const transactionData = {
                items: items.map((item) => ({
                    menuId: item.menuId,
                    name: item.name,
                    qty: item.qty,
                    price: item.price,
                    subtotal: item.price * item.qty,
                })),
                total,
                tableId,
                customerName,
                orderType,
                paymentMethod: isMidtransPayment ? 'qris' : paymentMethod,
                amountPaid: paymentMethod === 'cash' ? parseInt(amountPaid) : total,
                change: paymentMethod === 'cash' ? change : 0,
            };

            // Step 1: Create transaction in database
            const transactionResult = await transaksiApi.create(transactionData);

            if (isMidtransPayment) {
                // Calculate tax for Midtrans item_details
                const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                const tax = total - subtotal; // PPN 11%

                // Build Midtrans items (must sum up to gross_amount exactly)
                const midtransItems = items.map((item) => ({
                    id: String(item.menuId),
                    price: item.price,
                    quantity: item.qty,
                    name: item.name,
                }));

                // Add tax as a separate line item so the total matches
                if (tax > 0) {
                    midtransItems.push({
                        id: 'TAX-PPN',
                        price: tax,
                        quantity: 1,
                        name: 'PPN 11%',
                    });
                }

                // Step 2: Get Midtrans Snap Token
                const snapData = await paymentApi.getSnapToken({
                    transaksiId: transactionResult.id,
                    amount: total,
                    customerName: customerName || 'Pelanggan',
                    items: midtransItems,
                });

                setLoading(false);
                setStep('midtrans');

                // Step 3: Open Midtrans Snap Popup
                await loadSnapScript();
                openSnapPopup(snapData.token, {
                    onSuccess: (result) => {
                        console.log('[POS Midtrans] Payment success:', result);
                        setStep('success');
                        // Auto-close after 2s and clear cart
                        setTimeout(() => {
                            clearCart();
                            setOpen(false);
                            setStep('payment');
                            setAmountPaid('');
                            setPaymentMethod('cash');
                        }, 2000);
                    },
                    onPending: (result) => {
                        console.log('[POS Midtrans] Payment pending:', result);
                        // Treat pending as success — webhook will confirm later
                        setStep('success');
                        setTimeout(() => {
                            clearCart();
                            setOpen(false);
                            setStep('payment');
                            setAmountPaid('');
                            setPaymentMethod('cash');
                        }, 2000);
                    },
                    onError: (result) => {
                        console.error('[POS Midtrans] Payment error:', result);
                        setStep('payment');
                        setError(result?.status_message || 'Pembayaran gagal. Silakan coba lagi.');
                    },
                    onClose: () => {
                        console.log('[POS Midtrans] Popup closed by user');
                        // User closed popup without finishing payment
                        setStep('payment');
                        setError('Popup pembayaran ditutup. Silakan coba lagi atau pilih metode lain.');
                    },
                });
            } else {
                // Cash payment — immediately successful
                setStep('success');

                // Auto-close after 2s and clear cart
                setTimeout(() => {
                    clearCart();
                    setOpen(false);
                    setStep('payment');
                    setAmountPaid('');
                    setPaymentMethod('cash');
                }, 2000);
            }
        } catch (err) {
            console.error('Checkout failed:', err);
            setError(err.message || 'Gagal memproses pembayaran.');
        } finally {
            setLoading(false);
        }
    };

    // When Midtrans popup is open, hide the dialog so it doesn't block the iframe
    if (step === 'midtrans') {
        return null;
    }

    return (
        <Dialog open={true} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                {step === 'success' ? (
                    // Success State
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                        <DialogTitle className="text-xl text-[#3E2723] mb-2">Pembayaran Berhasil!</DialogTitle>
                        <p className="text-[#6D4C41] text-sm">
                            Total: <span className="font-bold text-[#3E2723]">{formatCurrency(total)}</span>
                        </p>
                        {paymentMethod === 'cash' && change > 0 && (
                            <p className="text-green-600 font-semibold mt-1">
                                Kembalian: {formatCurrency(change)}
                            </p>
                        )}
                    </motion.div>
                ) : (
                    // Payment Flow
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-[#3E2723]">Konfirmasi Pembayaran</DialogTitle>
                            <DialogDescription>
                                Total tagihan: <span className="font-bold text-[#3E2723]">{formatCurrency(total)}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Payment Method */}
                            <PaymentMethodSelector
                                value={paymentMethod}
                                onChange={setPaymentMethod}
                            />

                            {/* Cash Input */}
                            {paymentMethod === 'cash' && (
                                <div>
                                    <label className="text-sm font-medium text-[#3E2723] mb-1.5 block">
                                        Jumlah Dibayar
                                    </label>
                                    <input
                                        type="number"
                                        value={amountPaid}
                                        onChange={(e) => setAmountPaid(e.target.value)}
                                        placeholder="Masukkan jumlah uang..."
                                        className="w-full px-4 py-3 rounded-xl border border-[#3E2723]/15 text-lg font-bold text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#3E2723]/20 focus:border-[#3E2723]/30"
                                        autoFocus
                                    />
                                    {amountPaid && parseInt(amountPaid) >= total && (
                                        <p className="text-green-600 text-sm font-medium mt-1.5">
                                            Kembalian: {formatCurrency(change)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* QRIS / Card Info */}
                            {isMidtransPayment && (
                                <div className="bg-[#F5F0EB] p-4 rounded-xl text-center">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 border border-[#3E2723]/10">
                                        <QrCode size={24} className="text-[#3E2723]" />
                                    </div>
                                    <p className="text-sm font-medium text-[#3E2723] mb-1">
                                        Pembayaran via Midtrans
                                    </p>
                                    <p className="text-xs text-[#6D4C41]">
                                        Klik "Konfirmasi" untuk membuka popup pembayaran.
                                        Pelanggan bisa scan QR atau bayar lewat metode lain.
                                    </p>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setError(null);
                                }}
                                disabled={loading}
                                className="flex-1 py-2.5 rounded-xl border border-[#3E2723]/15 text-[#6D4C41] text-sm font-medium hover:bg-[#F5F0EB] transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCheckout}
                                disabled={loading || (paymentMethod === 'cash' && (!amountPaid || parseInt(amountPaid) < total))}
                                className="flex-1 py-2.5 rounded-xl bg-[#3E2723] text-white text-sm font-bold hover:bg-[#4E342E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Konfirmasi'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutModal;
