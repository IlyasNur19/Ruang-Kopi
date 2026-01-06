import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import '../styles/Hero.css';
import useLocalStorage from '../hooks/useLocalStorage';

const Hero = () => {
    const [shopStatus] = useLocalStorage('shopStatus', 'available');

    const statusConfig = {
        available: { text: 'Tersedia • Masih ada kursi', color: 'bg-green-400', border: 'border-green-400/30' },
        busy: { text: 'Hampir Penuh • Sisa sedikit', color: 'bg-orange-400', border: 'border-orange-400/30' },
        full: { text: 'Penuh • Waiting List', color: 'bg-red-400', border: 'border-red-400/30' }
    };

    const status = statusConfig[shopStatus] || statusConfig.available;

    return (
        <section className="hero-section">
            {/* Background Image with Overlay */}
            <div className="hero-bg">
                <img
                    src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80"
                    alt="Ruang Kopi Interior"
                    className="hero-img"
                />
                <div className="hero-overlay" />
            </div>

            {/* Content */}
            <div className="hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Availability Widget - Connected to Admin */}
                    <div className="availability-widget" style={{ borderColor: status.color.replace('bg-', '') }}>
                        <span className="status-dot" style={{ backgroundColor: status.color === 'bg-green-400' ? '#4CAF50' : status.color === 'bg-orange-400' ? '#FF9800' : '#EF5350' }} />
                        <span className="status-text">{status.text}</span>
                    </div>

                    <h1 className="hero-title">
                        RUANG KOPI
                    </h1>

                    <p className="hero-subtitle">
                        "Cerita di Setiap Tegukan"
                    </p>

                    <motion.a
                        href="#menu"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-hero"
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
                className="scroll-indicator"
            >
                <span>SCROLL</span>
            </motion.div>
        </section>
    );
};

export default Hero;
