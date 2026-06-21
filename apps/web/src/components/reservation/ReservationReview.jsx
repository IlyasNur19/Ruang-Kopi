import React from 'react';
import { Check, CalendarDays, Clock, Users, User, Phone, CreditCard, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatDateId } from '../../lib/utils';

const ReservationReview = ({ formData, selectedTable, cartItems = [], paymentType = 'dp', onPaymentTypeChange, onConfirm, onBack, loading }) => {
    const formattedDate = formData.date ? formatDateId(formData.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-';
    const tableNumber = selectedTable || 'Belum dipilih';
    const cartTotal = cartItems.reduce((sum, ci) => sum + ci.price * ci.qty, 0);
    const dpAmount = Math.round(cartTotal * 0.3);
    const fullAmount = cartTotal;
    const hasPreOrder = cartItems.length > 0;
    const payAmount = paymentType === 'full' ? fullAmount : dpAmount;
    const remainingAmount = cartTotal - payAmount;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 bg-[#3E2723]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check size={32} className="text-[#3E2723]" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2723] font-heading">Konfirmasi Reservasi</h3>
                <p className="text-sm text-[#6D4C41] mt-1">Pastikan data berikut sudah benar</p>
            </div>

            {/* Details */}
            <div className="bg-[#F5F0EB] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                    <User size={16} className="text-[#6D4C41] shrink-0" />
                    <span className="text-[#6D4C41]">Nama</span>
                    <span className="ml-auto font-semibold text-[#3E2723]">{formData.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-[#6D4C41] shrink-0" />
                    <span className="text-[#6D4C41]">No. Telepon</span>
                    <span className="ml-auto font-semibold text-[#3E2723]">{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <CalendarDays size={16} className="text-[#6D4C41] shrink-0" />
                    <span className="text-[#6D4C41]">Tanggal</span>
                    <span className="ml-auto font-semibold text-[#3E2723]">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-[#6D4C41] shrink-0" />
                    <span className="text-[#6D4C41]">Jam</span>
                    <span className="ml-auto font-semibold text-[#3E2723]">{formData.time}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Users size={16} className="text-[#6D4C41] shrink-0" />
                    <span className="text-[#6D4C41]">Jumlah Tamu</span>
                    <span className="ml-auto font-semibold text-[#3E2723]">{formData.guests} Orang</span>
                </div>
                <div className="flex items-center gap-3 text-sm pt-3 border-t border-[#3E2723]/10">
                    <span className="material-symbols-outlined text-[18px] text-[#6D4C41]">table_restaurant</span>
                    <span className="text-[#6D4C41]">Nomor Meja</span>
                    <span className="ml-auto font-semibold text-[#3E2723]">Meja {tableNumber}</span>
                </div>
            </div>

            {/* Pre-Order Items (if any) */}
            {cartItems.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-[#3E2723]/10 space-y-3">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-[#3E2723]" />
                        <h4 className="text-sm font-bold text-[#3E2723]">Pre-Order Menu</h4>
                    </div>
                    <div className="space-y-2">
                        {cartItems.map((ci, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#6D4C41]">{ci.name}</span>
                                    <span className="text-xs text-[#8D6E63]">x{ci.qty}</span>
                                </div>
                                <span className="font-medium text-[#3E2723]">
                                    {formatCurrency(ci.price * ci.qty)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#3E2723]/5">
                        <span className="text-sm font-semibold text-[#3E2723]">Subtotal Menu</span>
                        <span className="text-sm font-bold text-[#3E2723]">{formatCurrency(cartTotal)}</span>
                    </div>
                </div>
            )}

            {/* Payment Method Selector + Summary */}
            {hasPreOrder ? (
                <div className="space-y-3">
                    {/* Payment Method Toggle */}
                    <div className="bg-white rounded-2xl p-1 border border-[#3E2723]/10 grid grid-cols-2 gap-1">
                        <button
                            type="button"
                            onClick={() => onPaymentTypeChange && onPaymentTypeChange('dp')}
                            className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                                paymentType === 'dp'
                                    ? 'bg-[#3E2723] text-white shadow-sm'
                                    : 'text-[#6D4C41] hover:bg-[#F5F0EB]'
                            }`}
                        >
                            <div>DP 30%</div>
                            <div className={`text-xs mt-0.5 ${paymentType === 'dp' ? 'text-white/70' : 'text-[#8D6E63]'}`}>
                                {formatCurrency(dpAmount)}
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => onPaymentTypeChange && onPaymentTypeChange('full')}
                            className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                                paymentType === 'full'
                                    ? 'bg-[#3E2723] text-white shadow-sm'
                                    : 'text-[#6D4C41] hover:bg-[#F5F0EB]'
                            }`}
                        >
                            <div>Bayar Penuh</div>
                            <div className={`text-xs mt-0.5 ${paymentType === 'full' ? 'text-white/70' : 'text-[#8D6E63]'}`}>
                                {formatCurrency(fullAmount)}
                            </div>
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="bg-[#FFF8E1] rounded-2xl p-4 border border-amber-200 space-y-2">
                        <div className="flex items-start gap-2">
                            <CreditCard size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-[#3E2723] text-sm">Rincian Pembayaran</p>
                                <div className="mt-2 space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#6D4C41]">Total Pre-Order</span>
                                        <span className="font-medium text-[#3E2723]">{formatCurrency(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#6D4C41]">
                                            {paymentType === 'full' ? 'Dibayar Sekarang' : 'DP 30%'}
                                        </span>
                                        <span className="font-bold text-[#3E2723]">{formatCurrency(payAmount)}</span>
                                    </div>
                                    {paymentType === 'dp' && (
                                        <div className="flex justify-between pt-2 border-t border-amber-300">
                                            <span className="text-xs text-[#6D4C41]">Sisa dibayar di kedai</span>
                                            <span className="text-xs font-medium text-[#6D4C41]">{formatCurrency(remainingAmount)}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-[#6D4C41] mt-2">
                                    {paymentType === 'full'
                                        ? 'Bayar lunas sekarang, langsung bisa dinikmati saat tiba.'
                                        : 'Bayar 30% sekarang via Midtrans. Sisa 70% dibayar saat tiba di kedai.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#E8F5E9] rounded-2xl p-4 border border-green-200">
                    <div className="flex items-start gap-2">
                        <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-[#2E7D32] text-sm">Reservasi Gratis</p>
                            <p className="text-xs text-[#4CAF50] mt-1">
                                Tanpa pre-order tidak ada biaya. Konfirmasi reservasi Anda secara gratis.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="w-full py-4 bg-[#3E2723] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-[#4E342E] hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Memproses...
                        </>
                    ) : hasPreOrder ? (
                        <>
                            <CreditCard size={18} />
                            {paymentType === 'full'
                                ? `Bayar Penuh ${formatCurrency(fullAmount)}`
                                : `Bayar DP ${formatCurrency(dpAmount)}`
                            }
                        </>
                    ) : (
                        <>
                            <Check size={18} />
                            Konfirmasi Reservasi
                        </>
                    )}
                </button>
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="w-full py-3 border border-[#3E2723]/15 text-[#6D4C41] rounded-xl font-medium hover:border-[#3E2723]/40 hover:text-[#3E2723] disabled:opacity-50"
                >
                    Kembali & Edit
                </button>
            </div>
        </div>
    );
};

export default ReservationReview;
