import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CalendarDays, Clock, Users, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ReservationPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '08:00',
        guests: '2'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, date, time, guests } = formData;
        const phone = '6281234567890';
        const message = `Halo RuangKopi, saya ingin reservasi.%0A%0ANama: ${name}%0ATanggal: ${date}%0AJam: ${time}%0AJumlah: ${guests} orang%0A%0AMohon konfirmasinya. Terima kasih.`;
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8+'];

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
                            <span className="inline-block px-4 py-1.5 bg-gray-100 text-xs font-bold uppercase tracking-widest text-muted-foreground rounded-full mb-6">Book Your Spot</span>
                            <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4 font-bold">Reservasi Meja Anda</h1>
                            <p className="text-muted-foreground mb-10 leading-relaxed">
                                Nikmati momen terbaik bersama kopi terbaik. Silakan isi formulir di bawah ini, kami akan menyiapkan tempat spesial untuk Anda.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Masukkan nama anda"
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
                                    className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-[#2D2420] hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <Phone size={18} /> Pesan via WhatsApp
                                </button>
                            </form>

                            <p className="text-xs text-muted-foreground text-center mt-6">
                                Dengan menekan tombol di atas, Anda akan diarahkan ke WhatsApp untuk mengirim detail reservasi secara otomatis.
                            </p>

                            <div className="flex justify-center gap-8 mt-10 pt-8 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone size={16} /> +62 812 3456 7890
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin size={16} /> Jakarta Selatan, Indonesia
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReservationPage;
