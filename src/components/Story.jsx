import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Sprout, Users, Award } from 'lucide-react';

const Story = () => {
    const features = [
        {
            icon: <Sprout size={32} />,
            title: 'Premium Beans',
            description: 'Sourced directly from sustainable local farmers.'
        },
        {
            icon: <Users size={32} />,
            title: 'Community',
            description: 'A space built for meaningful connections.'
        },
        {
            icon: <Award size={32} />,
            title: 'Mastery',
            description: 'Brewed by certified baristas with passion.'
        }
    ];

    return (
        <section id="story" className="py-32 bg-background text-center">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto mb-24 px-4"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EFEBE9] rounded-full mb-8 text-primary">
                        <Coffee size={24} />
                    </div>
                    <h2 className="font-heading text-5xl md:text-6xl mb-8 text-primary font-bold">Filosofi Kami</h2>
                    <p className="text-xl leading-relaxed text-muted-foreground mb-6 font-light">
                        We craft more than just coffee; we create moments. Every cup tells a story of tradition, precision, and passion in a sanctuary designed for connection.
                    </p>
                    <p className="text-base leading-relaxed text-muted-foreground/80">
                        Ruang Kopi is a place where time slows down, allowing you to savor the earthy notes of our signature beans amidst conversations that matter.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-white p-12 rounded-2xl shadow-sm transition-transform hover:-translate-y-1"
                        >
                            <div className="text-accent mb-6 flex justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="font-heading text-2xl mb-4 text-primary font-bold">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Story;
