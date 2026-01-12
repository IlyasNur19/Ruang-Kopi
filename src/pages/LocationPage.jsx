import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation, MessageSquare, Coffee } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useLocalStorage from '../hooks/useLocalStorage';

const LocationPage = () => {
    const [shopStatus] = useLocalStorage('shopStatus', 'available');
    const isOpen = shopStatus !== 'full';

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
            <Navbar />
            <main className="flex-grow pt-28 pb-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
                        {/* Left - Info Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8D6E63] mb-4 block">Lokasi Kami</span>
                            <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4 font-bold">Temukan RuangKopi</h1>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Nikmati kopi terbaik di suasana yang tenang dan nyaman. Kami menanti kedatangan Anda.
                            </p>

                            {/* Status Badge */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-sm font-medium">Sedang {isOpen ? 'BUKA' : 'TUTUP'}</span>
                            </div>

                            {/* Info Items */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Alamat</h3>
                                        <p className="text-muted-foreground text-sm">Jl. Kopi No. 123, Kota, Indonesia</p>
                                        <p className="text-xs text-muted-foreground/70">500m dari Taman Kota</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                                        <Clock size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Jam Operasional</h3>
                                        <p className="text-muted-foreground text-sm">Senin - Jumat <span className="text-foreground font-medium">08:00 - 22:00</span></p>
                                        <p className="text-muted-foreground text-sm">Sabtu - Minggu <span className="text-foreground font-medium">09:00 - 23:00</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Hubungi Kami</h3>
                                        <p className="text-muted-foreground text-sm">+62 812-3456-7890</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 mt-10">
                                <a
                                    href="https://www.google.com/maps"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-[#2D2420] transition-colors"
                                >
                                    <Navigation size={18} /> Petunjuk Arah
                                </a>
                                <Link
                                    to="/reservation"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-foreground rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
                                >
                                    <MessageSquare size={18} /> Reservasi WA
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right - Map Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#E8E4E0] rounded-3xl overflow-hidden shadow-lg h-[500px] relative"
                        >
                            {/* Placeholder Map - Replace with actual iframe */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-md">
                                    <Coffee size={32} className="text-primary" />
                                </div>
                                <span className="font-heading text-lg font-bold text-primary">RuangKopi</span>
                                <p className="text-sm text-muted-foreground mt-1">Map Integration Here</p>
                            </div>
                            {/* Uncomment for actual map:
                            <iframe
                                src="https://www.google.com/maps/embed?..."
                                className="w-full h-full border-0"
                                allowFullScreen=""
                                loading="lazy"
                            /> */}
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LocationPage;
