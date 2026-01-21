import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

const Hero = () => {
    const [shopStatus] = useLocalStorage('shopStatus', 'available');

    const statusConfig = {
        available: { text: 'Tersedia • Masih ada kursi', color: 'bg-green-500', border: 'border-green-500/30' },
        busy: { text: 'Hampir Penuh • Sisa sedikit', color: 'bg-orange-500', border: 'border-orange-500/30' },
        full: { text: 'Penuh • Waiting List', color: 'bg-red-500', border: 'border-red-500/30' }
    };

    const status = statusConfig[shopStatus] || statusConfig.available;

    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80"
                    alt="Ruang Kopi Interior"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Availability Widget - Connected to Admin */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md border rounded-full mb-8 ${status.border}`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${status.color}`} />
                        <span className="text-xs font-medium uppercase tracking-wider text-white">{status.text}</span>
                    </div>

                    <h1 className="font-heading font-bold text-6xl md:text-8xl lg:text-9xl mb-6 leading-tight tracking-tighter">
                        RUANG KOPI
                    </h1>

                    <p className="text-2xl font-light text-white/90 mb-12 italic">
                        "Cerita di Setiap Tegukan"
                    </p>

                    <motion.a
                        href="#menu"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-bold text-lg transition-all hover:bg-background hover:-translate-y-0.5"
                    >
                        Lihat Menu
                        <ArrowRight size={20} />
                    </motion.a>
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm tracking-[0.2em] uppercase z-10"
            >
                <span>SCROLL</span>
            </motion.div>
        </section>
    );
};

export default Hero;
