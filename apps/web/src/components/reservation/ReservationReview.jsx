import React from 'react';
import { Check, CalendarDays, Clock, Users, User, Phone, CreditCard } from 'lucide-react';
import { formatCurrency, formatDateId } from '../../lib/utils';

const ReservationReview = ({ formData, selectedTable, onConfirm, onBack, loading }) => {
    const formattedDate = formData.date ? formatDateId(formData.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-';
    const dpAmount = 50000; // Default DP: Rp 50.000
    const tableNumber = selectedTable || 'Belum dipilih';

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

            {/* DP Info */}
            <div className="bg-[#FFF8E1] rounded-2xl p-4 border border-amber-200">
                <div className="flex items-start gap-2">
                    <CreditCard size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-[#3E2723] text-sm">Uang Muka (DP)</p>
                        <p className="text-xs text-[#6D4C41] mt-0.5">
                            Pembayaran DP sebesar {formatCurrency(dpAmount)} diperlukan untuk mengkonfirmasi reservasi Anda.
                            DP akan dipotong dari total tagihan.
                        </p>
                        <p className="text-lg font-bold text-[#3E2723] mt-2">{formatCurrency(dpAmount)}</p>
                    </div>
                </div>
            </div>

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
                    ) : (
                        <>
                            <CreditCard size={18} />
                            Bayar DP & Konfirmasi
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
