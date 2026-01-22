import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CalendarDays, Clock, Users, Phone, MapPin, Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reservationsApi } from '../services/api';
import { useMutation } from '../hooks/useApi';

const ReservationPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '08:00',
        guests: 2,
        notes: ''
    });
    const [submitted, setSubmitted] = useState(false);

    // Mutation for creating reservation
    const { mutate: createReservation, loading, error, reset } = useMutation(reservationsApi.create);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'guests' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createReservation({
                name: formData.name,
                phone: formData.phone || formData.email, // Use phone or fallback to email
                date: formData.date,
                time: formData.time,
                guests: formData.guests,
            });
            setSubmitted(true);
        } catch (err) {
            // Error is already handled by useMutation
            console.error('Reservation failed:', err);
        }
    };

    const handleWhatsApp = () => {
        const { name, date, time, guests, notes } = formData;
        const whatsappPhone = '6281234567890';
        const message = `Halo RuangKopi, saya ingin reservasi.%0A%0ANama: ${name}%0ATanggal: ${date}%0AJam: ${time}%0AJumlah: ${guests} orang${notes ? `%0ACatatan: ${notes}` : ''}%0A%0AMohon konfirmasinya. Terima kasih.`;
        window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
    };

    const handleReset = () => {
        setSubmitted(false);
        reset();
        setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '08:00',
            guests: 2,
            notes: ''
        });
    };

    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

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
                            {submitted && !error && (
                                <div className="text-center py-10">
                                    <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
                                    <h2 className="font-heading text-3xl text-primary mb-4 font-bold">Reservasi Berhasil!</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Terima kasih, kami akan segera menghubungi Anda untuk konfirmasi.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleWhatsApp}
                                            className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600"
                                        >
                                            <Phone size={18} /> Konfirmasi via WhatsApp
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
                            {error && (
                                <div className="text-center py-10">
                                    <XCircle size={64} className="mx-auto text-red-500 mb-6" />
                                    <h2 className="font-heading text-3xl text-primary mb-4 font-bold">Reservasi Gagal</h2>
                                    <p className="text-red-500 mb-6">{error}</p>
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
                            {!submitted && !error && (
                                <>
                                    <span className="inline-block px-4 py-1.5 bg-gray-100 text-xs font-bold uppercase tracking-widest text-muted-foreground rounded-full mb-6">Book Your Spot</span>
                                    <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4 font-bold">Reservasi Meja Anda</h1>
                                    <p className="text-muted-foreground mb-10 leading-relaxed">
                                        Nikmati momen terbaik bersama kopi terbaik. Silakan isi formulir di bawah ini, kami akan menyiapkan tempat spesial untuk Anda.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-5">
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

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                                                <div className="relative">
                                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        placeholder="email@contoh.com"
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
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                    />
                                                </div>
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
                                            disabled={loading}
                                            className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-[#2D2420] hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" /> Mengirim...
                                                </>
                                            ) : (
                                                'Kirim Reservasi'
                                            )}
                                        </button>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-[#F8F5F2] px-2 text-muted-foreground">atau</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleWhatsApp}
                                            className="w-full py-4 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg"
                                        >
                                            <Phone size={18} /> Pesan via WhatsApp
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
