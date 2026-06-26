import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Phone, Clock, Users, MapPin, Loader2, CheckCircle, XCircle, AlertTriangle,
    ChevronLeft, ChevronRight, CalendarDays
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reservationsApi, settingsApi, paymentApi } from '../services/api';
import { useMutation } from '../hooks/useApi';
import ReservationCalendar from '../components/reservation/ReservationCalendar';
import TableSelectionStep from '../components/reservation/TableSelectionStep';
import PreOrderStep from '../components/reservation/PreOrderStep';
import ReservationReview from '../components/reservation/ReservationReview';
import PaymentStep from '../components/reservation/PaymentStep';

const ReservationPage = () => {
    // Steps: 'form' | 'table' | 'preorder' | 'review' | 'payment' | 'success' | 'error'
    const [step, setStep] = useState('form');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: null,
        time: '10:00',
        guests: 2,
    });
    const [selectedTable, setSelectedTable] = useState(null);
    const [cartItems, setCartItems] = useState([]); // { menuId, name, price, qty }
    const [paymentType, setPaymentType] = useState('dp'); // 'dp' = 30%, 'full' = 100%
    const [snapToken, setSnapToken] = useState(null);
    const [shopStatus, setShopStatus] = useState('available');
    const [statusLoading, setStatusLoading] = useState(true);
    const [reservationErrorMsg, setReservationErrorMsg] = useState('');

    const { mutate: createReservation, loading, error } = useMutation(reservationsApi.create);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await settingsApi.getStatus();
                setShopStatus(data.status || 'available');
            } catch {
                setShopStatus('available');
            } finally {
                setStatusLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: name === 'guests' ? parseInt(value) : value }));
    };

    const handleDateSelect = (date) => {
        if (!date) {
            setFormData((prev) => ({ ...prev, date: '' }));
            return;
        }
        // Gunakan local date untuk menghindari offset timezone (WIB = UTC+7)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setFormData((prev) => ({ ...prev, date: `${year}-${month}-${day}` }));
    };

    const handleNextToTable = (e) => {
        e.preventDefault();
        if (!formData.date) {
            alert('Silakan pilih tanggal terlebih dahulu.');
            return;
        }
        setStep('table');
    };

    const handleNextToPreOrder = () => {
        if (!selectedTable) {
            alert('Silakan pilih meja terlebih dahulu.');
            return;
        }
        setStep('preorder');
    };

    const handleNextToReview = () => {
        setStep('review');
    };

    const handleBackToForm = () => setStep('form');
    const handleBackToTable = () => setStep('table');
    const handleBackToPreOrder = () => setStep('preorder');

    // Calculate totals — DP = 30% dari total pre-order, Full = 100%
    const cartTotal = cartItems.reduce((sum, ci) => sum + ci.price * ci.qty, 0);
    const dpAmount = Math.round(cartTotal * 0.3);
    const fullAmount = cartTotal;
    const paymentAmount = paymentType === 'full' ? fullAmount : dpAmount;
    const hasPreOrder = cartItems.length > 0;

    const handleConfirm = async () => {
        try {
            // 1. Create reservation
            const reservation = await createReservation({
                name: formData.name,
                phone: formData.phone,
                date: formData.date,
                time: formData.time,
                guests: formData.guests,
                mejaId: selectedTable,
            });

            // 2. If no pre-order, skip payment — go directly to success
            if (!hasPreOrder || paymentAmount <= 0) {
                setStep('success');
                return;
            }

            // 3. Get Snap token for payment (DP 30% or Full)
            const reservationId = reservation?.id || reservation?.data?.id;
            const snapResult = await paymentApi.getSnapToken({
                reservationId,
                amount: paymentAmount,
                customerName: formData.name,
                customerPhone: formData.phone,
                // Include cart items so they can be stored in the transaction
                items: cartItems.map(ci => ({
                    id: ci.menuId,
                    name: ci.name,
                    price: ci.price,
                    quantity: ci.qty,
                })),
            });

            setSnapToken(snapResult?.token || snapResult?.data?.token);
            setStep('payment');
        } catch (err) {
            console.error('Reservation failed:', err);
            setReservationErrorMsg(err.message || 'Terjadi kesalahan sistem');
            setStep('error');
        }
    };

    const handlePaymentSuccess = () => {
        setStep('success');
    };

    const handlePaymentError = () => {
        setStep('error');
    };

    const handlePaymentClose = () => {
        // Popup closed without completing — stay on payment step
    };

    const handleReset = () => {
        setStep('form');
        setFormData({ name: '', phone: '', date: null, time: '10:00', guests: 2 });
        setSelectedTable(null);
        setCartItems([]);
        setPaymentType('dp');
        setSnapToken(null);
    };

    const handleWhatsAppFallback = () => {
        const { name, date, time, guests } = formData;
        const whatsappPhone = '6285156432030';
        const formattedDate = date ? new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }) : '';
        // Include cart items in WhatsApp message
        let itemsText = '';
        if (cartItems.length > 0) {
            itemsText = '%0A%0A*Pre-Order:*%0A' + cartItems.map(ci =>
                `- ${ci.name} x${ci.qty} (${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(ci.price * ci.qty).replace('IDR', 'Rp')})`
            ).join('%0A');
            const cartTotalLocal = cartItems.reduce((sum, ci) => sum + ci.price * ci.qty, 0);
            const dpLocal = Math.round(cartTotalLocal * 0.3);
            itemsText += `%0A*Total Pre-Order:* ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(cartTotalLocal).replace('IDR', 'Rp')}`;
            itemsText += `%0A*DP 30%:* ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(dpLocal).replace('IDR', 'Rp')}`;
        }
        const message = `Halo RuangKopi, saya ingin reservasi.%0A%0ANama: ${name}%0ATanggal: ${formattedDate}%0AJam: ${time}%0AJumlah: ${guests} orang%0AMeja: ${selectedTable || '-'}${itemsText}%0A%0AMohon konfirmasinya. Terima kasih.`;
        window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
    };

    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

    // Step indicator — 5 steps
    const steps = [
        { id: 'form', label: 'Jadwal' },
        { id: 'table', label: 'Meja' },
        { id: 'preorder', label: 'Menu' },
        { id: 'review', label: 'Review' },
        { id: 'payment', label: 'Bayar' },
    ];
    const activeStepForIndicator = ['success', 'error'].includes(step) ? 'review' : step;
    const currentStepIndex = steps.findIndex((s) => s.id === activeStepForIndicator);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
            <Navbar />
            <main className="flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
                    {/* Left - Image Panel */}
                    <div className="hidden lg:block relative">
                        <img
                            src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80"
                            alt="Coffee Shop Interior"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                        <div className="absolute bottom-12 left-12 right-12">
                            <blockquote className="text-white">
                                <p className="font-heading text-3xl italic mb-4">"Coffee is a language in itself."</p>
                                <cite className="text-white/70 text-sm tracking-wider uppercase">— Jackie Chan</cite>
                            </blockquote>
                        </div>
                    </div>

                    {/* Right - Form Panel */}
                    <div className="flex items-start justify-center px-6 py-10 lg:py-16 overflow-y-auto">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-lg"
                        >
                            {/* ============ SUCCESS ============ */}
                            {step === 'success' && (
                                <div className="text-center py-10">
                                    <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
                                    <h2 className="font-heading text-3xl text-primary mb-4 font-bold">Reservasi Terkonfirmasi!</h2>
                                    {hasPreOrder ? (
                                        paymentType === 'full' ? (
                                            <>
                                                <p className="text-muted-foreground mb-2">
                                                    Pembayaran penuh sebesar {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(fullAmount).replace('IDR', 'Rp')} telah berhasil.
                                                </p>
                                                <p className="text-sm text-[#6D4C41] mb-2">
                                                    Pre-order Anda sudah lunas dan akan disiapkan sebelum kedatangan.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-muted-foreground mb-2">
                                                    DP sebesar {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(dpAmount).replace('IDR', 'Rp')} telah berhasil dibayar.
                                                </p>
                                                <p className="text-sm text-[#6D4C41] mb-2">
                                                    Sisa {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(cartTotal - dpAmount).replace('IDR', 'Rp')} dibayar di kedai. Pre-order Anda akan disiapkan.
                                                </p>
                                            </>
                                        )
                                    ) : (
                                        <p className="text-muted-foreground mb-2">
                                            Reservasi gratis Anda telah dikonfirmasi.
                                        </p>
                                    )}
                                    <p className="text-sm text-[#6D4C41] mb-8">
                                        Silakan datang tepat waktu. Kami tunggu kedatangan Anda!
                                    </p>
                                    <button
                                        onClick={handleReset}
                                        className="w-full py-3 bg-[#3E2723] text-white rounded-xl font-bold hover:bg-[#4E342E] transition-colors"
                                    >
                                        Buat Reservasi Lain
                                    </button>
                                </div>
                            )}

                            {/* ============ ERROR ============ */}
                            {step === 'error' && (
                                <div className="text-center py-10">
                                    <XCircle size={64} className="mx-auto text-red-500 mb-6" />
                                    <h2 className="font-heading text-3xl text-primary mb-4 font-bold">Terjadi Kesalahan</h2>
                                    <p className="text-red-500 mb-2 font-medium">Gagal memproses reservasi.</p>
                                    <p className="text-sm text-red-400 mb-6 bg-red-50 p-3 rounded-lg border border-red-100">
                                        Error: {reservationErrorMsg}
                                    </p>
                                    <p className="text-muted-foreground mb-8">
                                        Anda tetap dapat reservasi melalui WhatsApp.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleWhatsAppFallback}
                                            className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600"
                                        >
                                            <Phone size={18} /> Reservasi via WhatsApp
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="w-full py-3 border border-gray-300 rounded-xl font-medium hover:border-primary hover:text-primary"
                                        >
                                            Coba Lagi
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ============ PAYMENT STEP ============ */}
                            {step === 'payment' && (
                                <div>
                                    <h2 className="font-heading text-2xl text-primary mb-2 font-bold text-center">
                                        {paymentType === 'full' ? 'Pembayaran Penuh' : 'Pembayaran DP 30%'}
                                    </h2>
                                    <p className="text-center text-sm text-[#6D4C41] mb-4">
                                        {paymentType === 'full'
                                            ? `Bayar penuh ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(fullAmount).replace('IDR', 'Rp')}`
                                            : `Bayar uang muka ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(dpAmount).replace('IDR', 'Rp')} · Sisa ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(cartTotal - dpAmount).replace('IDR', 'Rp')} di kedai`
                                        }
                                    </p>
                                    <PaymentStep
                                        snapToken={snapToken}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                        onClose={handlePaymentClose}
                                    />
                                    <div className="text-center mt-4">
                                        <button
                                            onClick={handleWhatsAppFallback}
                                            className="text-sm text-[#6D4C41] underline hover:text-[#3E2723]"
                                        >
                                            Atau reservasi via WhatsApp
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ============ REVIEW STEP ============ */}
                            {step === 'review' && (
                                <ReservationReview
                                    formData={formData}
                                    selectedTable={selectedTable}
                                    cartItems={cartItems}
                                    paymentType={paymentType}
                                    onPaymentTypeChange={setPaymentType}
                                    onConfirm={handleConfirm}
                                    onBack={handleBackToPreOrder}
                                    loading={loading}
                                />
                            )}

                            {/* ============ PRE-ORDER STEP ============ */}
                            {step === 'preorder' && (
                                <PreOrderStep
                                    cartItems={cartItems}
                                    onCartChange={setCartItems}
                                    onNext={handleNextToReview}
                                    onBack={handleBackToTable}
                                />
                            )}

                            {/* ============ TABLE SELECTION STEP ============ */}
                            {step === 'table' && (
                                <div>
                                    <button onClick={handleBackToForm} className="flex items-center gap-1 text-[#6D4C41] hover:text-[#3E2723] mb-4 text-sm">
                                        <ChevronLeft size={16} /> Kembali
                                    </button>
                                    <h2 className="font-heading text-2xl text-primary mb-2 font-bold">Pilih Meja</h2>
                                    <p className="text-muted-foreground mb-6 text-sm">
                                        {formData.date ? (
                                            <>Meja tersedia untuk tanggal <strong>{new Date(formData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> jam <strong>{formData.time}</strong></>
                                        ) : 'Pilih meja yang tersedia.'}
                                    </p>
                                    <TableSelectionStep
                                        selectedTable={selectedTable}
                                        onSelect={setSelectedTable}
                                        date={formData.date}
                                        time={formData.time}
                                    />
                                    <button
                                        onClick={handleNextToPreOrder}
                                        disabled={!selectedTable}
                                        className="w-full mt-6 py-4 bg-[#3E2723] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-[#4E342E] disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Lanjut Pre-Order Menu
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* ============ FORM STEP ============ */}
                            {step === 'form' && (
                                <>
                                    <span className="inline-block px-4 py-1.5 bg-gray-100 text-xs font-bold uppercase tracking-widest text-muted-foreground rounded-full mb-6">
                                        Book Your Spot
                                    </span>
                                    <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4 font-bold">
                                        Reservasi Meja Anda
                                    </h1>
                                    <p className="text-muted-foreground mb-8 leading-relaxed">
                                        Nikmati momen terbaik bersama kopi terbaik. Pilih jadwal, meja, dan pre-order menu favorit Anda.
                                    </p>

                                    {/* Step Indicator */}
                                    <div className="flex items-center justify-center gap-2 mb-8">
                                        {steps.map((s, i) => (
                                            <React.Fragment key={s.id}>
                                                <div className={`flex items-center gap-1.5 text-xs font-medium ${i <= currentStepIndex ? 'text-[#3E2723]' : 'text-[#6D4C41]/40'}`}>
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= currentStepIndex ? 'bg-[#3E2723] text-white' : 'bg-[#E0D8D0] text-[#6D4C41]'}`}>
                                                        {i < currentStepIndex ? '✓' : i + 1}
                                                    </div>
                                                    <span className="hidden sm:inline">{s.label}</span>
                                                </div>
                                                {i < steps.length - 1 && <div className="w-6 h-px bg-[#3E2723]/15" />}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Calendar */}
                                    <div className="mb-6">
                                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                                            <CalendarDays size={16} className="text-[#6D4C41]" />
                                            Pilih Tanggal
                                        </label>
                                        <ReservationCalendar
                                            selected={formData.date ? new Date(formData.date) : null}
                                            onSelect={handleDateSelect}
                                        />
                                    </div>

                                    {/* Time + Guests */}
                                    <form onSubmit={handleNextToTable} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                                    <Clock size={16} className="text-[#6D4C41]" /> Jam
                                                </label>
                                                <select
                                                    name="time"
                                                    value={formData.time}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                                >
                                                    {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                                    <Users size={16} className="text-[#6D4C41]" /> Tamu
                                                </label>
                                                <select
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                                >
                                                    {guestOptions.map((g) => <option key={g} value={g}>{g} Orang</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                                <User size={16} className="text-[#6D4C41]" /> Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                placeholder="Masukkan nama anda"
                                                required
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                                <Phone size={16} className="text-[#6D4C41]" /> No. Telepon
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                placeholder="08xxxxxxxxxx"
                                                required
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!formData.date}
                                            className="w-full py-4 bg-[#3E2723] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-[#4E342E] hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        >
                                            Pilih Meja
                                            <ChevronRight size={18} />
                                        </button>
                                    </form>

                                    <div className="flex justify-center gap-8 mt-10 pt-8 border-t border-gray-200">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone size={16} /> +62 812 3456 7890
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin size={16} /> Jakarta Selatan
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReservationPage;
