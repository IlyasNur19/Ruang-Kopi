import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Sprout, Users, Award } from 'lucide-react';
import '../styles/Story.css';

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
        <section id="story" className="story-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="story-header"
                >
                    <div className="story-icon-wrapper">
                        <Coffee size={24} className="story-icon-top" />
                    </div>
                    <h2 className="story-title">Filosofi Kami</h2>
                    <p className="story-text">
                        We craft more than just coffee; we create moments. Every cup tells a story of tradition, precision, and passion in a sanctuary designed for connection.
                    </p>
                    <p className="story-subtext">
                        Ruang Kopi is a place where time slows down, allowing you to savor the earthy notes of our signature beans amidst conversations that matter.
                    </p>
                </motion.div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="feature-card"
                        >
                            <div className="feature-icon">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Story;
