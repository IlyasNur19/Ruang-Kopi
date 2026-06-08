import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CalendarDays, Clock, Users, Phone, MapPin, Loader2, CheckCircle, XCircle, AlertTriangle, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reservationsApi, settingsApi } from '../services/api';
import { useMutation } from '../hooks/useApi';

const ReservationPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '10:00',
        guests: 2,
    });
    const [step, setStep] = useState('form'); // 'form', 'review', 'success', 'error'
    const [shopStatus, setShopStatus] = useState('available'); // 'available', 'busy', 'full'
    const [statusLoading, setStatusLoading] = useState(true);

    // Mutation for creating reservation
    const { mutate: createReservation, loading, error, reset } = useMutation(reservationsApi.create);

    // Fetch shop status on mount
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await settingsApi.getStatus();
                setShopStatus(data.status || 'available');
            } catch (err) {
                console.error('Failed to fetch status:', err);
                setShopStatus('available'); // Default to available on error
            } finally {
                setStatusLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'guests' ? parseInt(value) : value
        }));
    };

    const handleReview = (e) => {
        e.preventDefault();
        setStep('review');
    };

    const handleConfirm = async () => {
        try {
            // Save to database first
            await createReservation({
                name: formData.name,
                phone: formData.phone,
                date: formData.date,
                time: formData.time,
                guests: formData.guests,
            });

            // Then open WhatsApp
            handleWhatsApp();
            setStep('success');
        } catch (err) {
            console.error('Reservation failed:', err);
            setStep('error');
        }
    };

    const handleWhatsApp = () => {
        const { name, date, time, guests } = formData;
        const whatsappPhone = '6285156432030';
        const formattedDate = new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const message = `Halo RuangKopi, saya ingin reservasi.%0A%0ANama: ${name}%0ATanggal: ${formattedDate}%0AJam: ${time}%0AJumlah: ${guests} orang%0A%0AMohon konfirmasinya. Terima kasih.`;
        window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
    };

    const handleReset = () => {
        setStep('form');
        reset();
        setFormData({
            name: '',
            phone: '',
            date: '',
            time: '10:00',
            guests: 2,
        });
    };

    const handleBack = () => {
        setStep('form');
    };

    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

    // Status indicator component
    const StatusWidget = () => {
        const statusConfig = {
            available: {
                color: 'bg-green-500',
                textColor: 'text-green-700',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                label: 'Tersedia',
                description: 'Tempat masih tersedia untuk reservasi',
                icon: CheckCircle
            },
            busy: {
                color: 'bg-yellow-500',
                textColor: 'text-yellow-700',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                label: 'Hampir Penuh',
                description: 'Segera reservasi sebelum kehabisan',
                icon: AlertTriangle
            },
            full: {
                color: 'bg-red-500',
                textColor: 'text-red-700',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                label: 'Penuh',
                description: 'Maaf, tempat sedang penuh. Coba lagi nanti.',
                icon: XCircle
            }
        };

        const config = statusConfig[shopStatus] || statusConfig.available;
        const Icon = config.icon;

        if (statusLoading) {
            return (
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6">
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                    <span className="text-gray-500">Memuat status ketersediaan...</span>
                </div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-4 ${config.bgColor} border ${config.borderColor} rounded-xl mb-6`}
            >
                <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`} />
                <Icon size={20} className={config.textColor} />
                <div className="flex-1">
                    <span className={`font-semibold ${config.textColor}`}>{config.label}</span>
                    <p className={`text-sm ${config.textColor} opacity-80`}>{config.description}</p>
                </div>
            </motion.div>
        );
    };

    // Review Modal
    const ReviewModal = () => {
        const formattedDate = new Date(formData.date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                >
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-primary" />
                        </div>
                        <h3 className="font-heading text-2xl text-primary font-bold">Konfirmasi Reservasi</h3>
                        <p className="text-muted-foreground mt-2">Pastikan data berikut sudah benar</p>
                    </div>

                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl mb-6">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Nama</span>
                            <span className="font-medium text-primary">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">No. Telepon</span>
                            <span className="font-medium text-primary">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tanggal</span>
                            <span className="font-medium text-primary">{formattedDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Jam</span>
                            <span className="font-medium text-primary">{formData.time}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Jumlah Tamu</span>
                            <span className="font-medium text-primary">{formData.guests} Orang</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="w-full py-4 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Memproses...
                                </>
                            ) : (
                                <>
                                    <Phone size={18} /> Konfirmasi via WhatsApp
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleBack}
                            disabled={loading}
                            className="w-full py-3 border border-gray-300 text-muted-foreground rounded-xl font-medium hover:border-primary hover:text-primary disabled:opacity-50"
                        >
                            Kembali & Edit
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

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
                    <div className="flex items-center justify-center px-6 py-20 lg:py-0">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-lg"
                        >
                            {/* Success State */}
                            {step === 'success' && (
                                <div className="text-center py-10">
                                    <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
                                    <h2 className="font-heading text-3xl text-primary mb-4 font-bold">Reservasi Terkirim!</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Terima kasih! Silakan kirim pesan WhatsApp untuk konfirmasi. Kami akan segera merespon.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleWhatsApp}
                                            className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600"
                                        >
                                            <Phone size={18} /> Buka WhatsApp Lagi
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="w-full py-3 border border-gray-300 text-muted-foreground rounded-xl font-medium hover:border-primary hover:text-primary"
                                        >
                                            Buat Reservasi Lain
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {step === 'error' && (
                                <div className="text-center py-10">
                                    <XCircle size={64} className="mx-auto text-red-500 mb-6" />
                                    <h2 className="font-heading text-3xl text-primary mb-4 font-bold">Terjadi Kesalahan</h2>
                                    <p className="text-red-500 mb-6">{error || 'Gagal menyimpan reservasi. Silakan coba via WhatsApp langsung.'}</p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleWhatsApp}
                                            className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600"
                                        >
                                            <Phone size={18} /> Pesan via WhatsApp
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="w-full py-3 border border-gray-300 text-muted-foreground rounded-xl font-medium hover:border-primary hover:text-primary"
                                        >
                                            Coba Lagi
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            {step === 'form' && (
                                <>
                                    <span className="inline-block px-4 py-1.5 bg-gray-100 text-xs font-bold uppercase tracking-widest text-muted-foreground rounded-full mb-6">Book Your Spot</span>
                                    <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4 font-bold">Reservasi Meja Anda</h1>
                                    <p className="text-muted-foreground mb-8 leading-relaxed">
                                        Nikmati momen terbaik bersama kopi terbaik. Silakan isi formulir di bawah ini.
                                    </p>

                                    {/* Status Widget */}
                                    <StatusWidget />

                                    {/* Form - Disabled when full */}
                                    <form onSubmit={handleReview} className={`space-y-5 ${shopStatus === 'full' ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
                                            <div className="relative">
                                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    placeholder="Masukkan nama anda"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">No. Telepon</label>
                                            <div className="relative">
                                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    placeholder="08xxxxxxxxxx"
                                                    required
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Tanggal</label>
                                                <div className="relative">
                                                    <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        value={formData.date}
                                                        required
                                                        min={new Date().toISOString().split('T')[0]}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Jam</label>
                                                <div className="relative">
                                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                    <select
                                                        name="time"
                                                        value={formData.time}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                                    >
                                                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Jumlah Tamu</label>
                                            <div className="relative">
                                                <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <select
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                                >
                                                    {guestOptions.map(g => <option key={g} value={g}>{g} Orang</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={shopStatus === 'full'}
                                            className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-[#2D2420] hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        >
                                            Review Reservasi
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

            {/* Review Modal */}
            <AnimatePresence>
                {step === 'review' && <ReviewModal />}
            </AnimatePresence>
        </div>
    );
};

export default ReservationPage;
