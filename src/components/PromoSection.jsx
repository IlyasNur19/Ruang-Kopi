import React from 'react';
import { motion } from 'framer-motion';
import { Music, Clock, Percent } from 'lucide-react';

const PromoSection = () => {
    const promos = [
        {
            icon: <Music size={40} />,
            title: 'Live Acoustic',
            subtitle: 'Every Friday • 7PM',
            color: 'text-accent',
            delay: 0
        },
        {
            icon: <Percent size={40} />,
            title: 'Discount 20%',
            subtitle: 'Manual Brew • All Day',
            color: 'text-primary',
            delay: 0.2
        },
        {
            icon: <Clock size={40} />,
            title: 'Happy Hour',
            subtitle: '15:00 - 17:00 • Free Cookie',
            color: 'text-accent',
            delay: 0.4
        }
    ];

    return (
        <section className="py-24 bg-secondary/30 border-y border-black/5">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center font-heading text-5xl text-primary mb-16 font-bold"
                >
                    Promo & Events
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {promos.map((promo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: promo.delay }}
                            whileHover={{ y: -10 }}
                            className="group bg-white p-10 rounded-3xl text-center transition-all border border-black/5 shadow-sm hover:shadow-xl hover:border-primary/10"
                        >
                            <div className={`inline-flex mb-6 p-4 rounded-full bg-background transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 ${promo.color}`}>
                                {promo.icon}
                            </div>
                            <h3 className="font-heading text-2xl mb-2 text-primary font-bold">{promo.title}</h3>
                            <p className="text-base text-muted-foreground font-medium tracking-wide">{promo.subtitle}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromoSection;
