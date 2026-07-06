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
                        {}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8D6E63] mb-4 block">Lokasi Kami</span>
                            <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4 font-bold">Temukan RuangKopi</h1>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Nikmati kopi terbaik di suasana yang tenang dan nyaman. Kami menanti kedatangan Anda.
                            </p>

                            {}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-sm font-medium">Sedang {isOpen ? 'BUKA' : 'TUTUP'}</span>
                            </div>

                            {}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Alamat</h3>
                                        <p className="text-muted-foreground text-sm">Jl. Raya Solo - Tawangmangu, Keprabon, Karangpandan, Kec. Karangpandan, Kabupaten Karanganyar, Jawa Tengah 57791</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                                        <Clock size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Jam Operasional</h3>
                                        <p className="text-muted-foreground text-sm">Setiap Hari : <span className="text-foreground font-medium">09:00 - 00:00</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Hubungi Kami</h3>
                                        <p className="text-muted-foreground text-sm">085642332105</p>
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="flex flex-wrap gap-4 mt-10">
                                <a
                                    href="https://maps.app.goo.gl/iF77DJP89R5hARrQ6"
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

                        {}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#E8E4E0] rounded-3xl overflow-hidden shadow-lg h-[500px] relative"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15818.494369279775!2d111.06436821144354!3d-7.615872099999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a218f9d96e2c7%3A0x7a4a88f2aafc26d8!2sRuang%20Kopi!5e0!3m2!1sid!2sid!4v1769433306205!5m2!1sid!2sid"
                                className="w-full h-full border-0"
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LocationPage;
