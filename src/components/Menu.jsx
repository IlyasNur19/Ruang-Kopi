import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Menu.css';

// Sample Data (can be moved to separate file later)
const menuItems = [
    { id: 1, name: 'Espresso', price: '25.000', category: 'Kopi', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80' },
    { id: 2, name: 'Cappuccino', price: '35.000', category: 'Kopi', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80' },
    { id: 3, name: 'V60 Manual Brew', price: '45.000', category: 'Manual Brew', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80' },
    { id: 4, name: 'Matcha Latte', price: '38.000', category: 'Non-Kopi', image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3114?auto=format&fit=crop&q=80' },
    { id: 5, name: 'Croissant', price: '28.000', category: 'Makanan', image: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80' },
    { id: 6, name: 'Japanese Cold Drip', price: '40.000', category: 'Manual Brew', image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7dd9b?auto=format&fit=crop&q=80' },
];

const categories = ['Semua', 'Kopi', 'Non-Kopi', 'Makanan', 'Manual Brew'];

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState('Semua');

    const filteredItems = activeCategory === 'Semua'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    return (
        <section id="menu" className="menu-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="menu-header"
                >
                    <h2 className="menu-title">Menu Kami</h2>
                    <p className="menu-subtitle">Explore our signature blends and savory treats.</p>
                </motion.div>

                {/* Categories */}
                <div className="menu-categories">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <motion.div layout className="menu-grid">
                    <AnimatePresence>
                        {filteredItems.map(item => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="menu-card"
                            >
                                <div className="menu-img-wrapper">
                                    <img src={item.image} alt={item.name} className="menu-img" />
                                </div>
                                <div className="menu-info">
                                    <div className="menu-text">
                                        <h3 className="menu-item-name">{item.name}</h3>
                                        <span className="menu-item-cat">{item.category}</span>
                                    </div>
                                    <span className="menu-price">Rp {item.price}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Menu;
