import React from 'react';
import { motion } from 'framer-motion';
import { Music, Clock, Percent } from 'lucide-react';
import '../styles/PromoSection.css';

const PromoSection = () => {
    const promos = [
        {
            icon: <Music size={40} />,
            title: 'Live Acoustic',
            subtitle: 'Every Friday • 7PM',
            color: 'var(--accent)',
            delay: 0
        },
        {
            icon: <Percent size={40} />,
            title: 'Discount 20%',
            subtitle: 'Manual Brew • All Day',
            color: 'var(--primary)',
            delay: 0.2
        },
        {
            icon: <Clock size={40} />,
            title: 'Happy Hour',
            subtitle: '15:00 - 17:00 • Free Cookie',
            color: 'var(--accent)',
            delay: 0.4
        }
    ];

    return (
        <section className="promo-section">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="promo-heading"
                >
                    Promo & Events
                </motion.h2>

                <div className="promo-grid">
                    {promos.map((promo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: promo.delay }}
                            whileHover={{ y: -10 }}
                            className="promo-card"
                        >
                            <div className="promo-icon" style={{ color: promo.color }}>
                                {promo.icon}
                            </div>
                            <h3 className="promo-title">{promo.title}</h3>
                            <p className="promo-subtitle">{promo.subtitle}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromoSection;
