import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { loadSnapScript, openSnapPopup } from '../../lib/midtrans';

const PaymentStep = ({ snapToken, onSuccess, onError, onClose }) => {
    const [status, setStatus] = useState('loading');
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!snapToken) {
            setStatus('error');
            setErrorMsg('Token pembayaran tidak tersedia.');
            return;
        }

        const initSnap = async () => {
            try {
                await loadSnapScript();
                setStatus('ready');

                setTimeout(() => {
                    setStatus('processing');
                    openSnapPopup(snapToken, {
                        onSuccess: (result) => {
                            setStatus('success');
                            onSuccess?.(result);
                        },
                        onPending: (result) => {
                            console.log('Payment pending:', result);

                            setStatus('success');
                            onSuccess?.(result);
                        },
                        onError: (result) => {
                            setStatus('error');
                            setErrorMsg(result?.status_message || 'Pembayaran gagal.');
                            onError?.(result);
                        },
                        onClose: () => {

                            if (status !== 'success') {
                                onClose?.();
                            }
                        },
                    });
                }, 500);
            } catch (err) {
                setStatus('error');
                setErrorMsg(err.message || 'Gagal memuat sistem pembayaran.');
            }
        };

        initSnap();
    }, [snapToken]);

    if (status === 'loading') {
        return (
            <div className="text-center py-10">
                <Loader2 size={48} className="mx-auto text-[#8D6E63] animate-spin mb-4" />
                <h3 className="text-lg font-bold text-[#3E2723] mb-2">Memuat Pembayaran</h3>
                <p className="text-sm text-[#6D4C41]">Sedang menyiapkan sistem pembayaran...</p>
            </div>
        );
    }

    if (status === 'processing') {
        return (
            <div className="text-center py-10">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 size={32} className="text-amber-500 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-[#3E2723] mb-2">Menunggu Pembayaran</h3>
                <p className="text-sm text-[#6D4C41]">
                    Silakan selesaikan pembayaran di popup Midtrans.
                </p>
                <p className="text-xs text-[#6D4C41]/50 mt-2">
                    Jika popup tidak muncul, klik tombol di bawah.
                </p>
                <button
                    onClick={() => openSnapPopup(snapToken, {
                        onSuccess: (r) => { setStatus('success'); onSuccess?.(r); },
                        onError: (r) => { setStatus('error'); setErrorMsg(r?.status_message); onError?.(r); },
                        onClose: () => onClose?.(),
                    })}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#3E2723] text-white text-sm font-semibold hover:bg-[#4E342E] transition-colors"
                >
                    Buka Popup Pembayaran
                </button>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="text-center py-10">
                <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-[#3E2723] mb-2">Pembayaran Berhasil!</h3>
                <p className="text-sm text-[#6D4C41]">
                    Reservasi Anda telah dikonfirmasi. Silakan datang tepat waktu.
                </p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center py-10">
                <XCircle size={64} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-[#3E2723] mb-2">Pembayaran Gagal</h3>
                <p className="text-sm text-red-600 mb-4">{errorMsg || 'Terjadi kesalahan.'}</p>
                <button
                    onClick={() => {
                        setStatus('ready');
                        setErrorMsg(null);
                        setTimeout(() => {
                            setStatus('processing');
                            openSnapPopup(snapToken, {
                                onSuccess: (r) => { setStatus('success'); onSuccess?.(r); },
                                onError: (r) => { setStatus('error'); onError?.(r); },
                                onClose: () => onClose?.(),
                            });
                        }, 500);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#3E2723] text-white text-sm font-semibold hover:bg-[#4E342E] transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    return null;
};

export default PaymentStep;
