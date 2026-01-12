import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <section id="menu" className="py-32 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-heading text-6xl text-primary mb-4 font-bold">Menu Kami</h2>
                    <p className="text-muted-foreground text-lg">Explore our signature blends and savory treats.</p>
                </motion.div>

                {/* Categories */}
                <div className="flex justify-center gap-4 flex-wrap mb-16">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-3 rounded-full border border-primary/20 font-medium transition-all hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5 hover:shadow-md 
                                ${activeCategory === category
                                    ? 'bg-primary text-white border-primary shadow-md transform -translate-y-0.5'
                                    : 'bg-transparent text-muted-foreground'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto">
                    <AnimatePresence>
                        {filteredItems.map(item => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="w-full h-64 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="p-6 flex justify-between items-end">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-heading text-2xl text-primary font-bold">{item.name}</h3>
                                        <span className="inline-block text-xs uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded w-fit">{item.category}</span>
                                    </div>
                                    <span className="font-bold text-xl text-primary">Rp {item.price}</span>
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
