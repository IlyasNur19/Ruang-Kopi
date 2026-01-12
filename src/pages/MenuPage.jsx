import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const menuItems = [
    { id: 1, name: 'Espresso', price: '25K', category: 'Kopi', description: 'Rich, full-bodied shot of pure Arabica goodness.', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80' },
    { id: 2, name: 'V60 Manual Brew', price: '35K', category: 'Manual Brew', description: 'Clean, bright, and floral notes from our single origin selection.', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80' },
    { id: 3, name: 'Butter Croissant', price: '28K', category: 'Makanan', description: 'Flaky, buttery, and freshly baked every morning.', image: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80' },
    { id: 4, name: 'Matcha Latte', price: '32K', category: 'Non-Kopi', description: 'Premium Japanese matcha whisked with steamed milk.', image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3114?auto=format&fit=crop&q=80' },
    { id: 5, name: 'Cappuccino', price: '30K', category: 'Kopi', description: 'Perfect balance of espresso, steamed milk and foam.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80' },
    { id: 6, name: 'Cold Brew', price: '30K', category: 'Kopi', description: 'Slow-steeped for 12 hours for a smooth, less acidic taste.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7dd9b?auto=format&fit=crop&q=80' },
    { id: 7, name: 'Pain au Chocolat', price: '30K', category: 'Makanan', description: 'Classic French pastry filled with rich dark chocolate.', image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?auto=format&fit=crop&q=80' },
    { id: 8, name: 'Lychee Tea', price: '28K', category: 'Non-Kopi', description: 'Refreshing black tea with sweet lychee fruit essence.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80' },
];

const categories = ['All', 'Kopi', 'Non-Kopi', 'Manual Brew', 'Makanan'];

const MenuPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredItems = activeCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
            <Navbar />
            <main className="flex-grow pt-28 pb-20">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        <h1 className="font-heading text-5xl md:text-6xl text-primary mb-4 font-bold">Menu Kami</h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Crafted with passion, served with love. Explore our selection of premium beans and handcrafted pastries, made to perfect your daily ritual.
                        </p>
                    </motion.div>

                    {/* Category Filter */}
                    <div className="flex justify-center gap-3 flex-wrap mb-12">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border
                                    ${activeCategory === category
                                        ? 'bg-primary text-white border-primary shadow-md'
                                        : 'bg-white text-muted-foreground border-gray-200 hover:border-primary hover:text-primary'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Menu Grid */}
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <AnimatePresence>
                            {filteredItems.map(item => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-heading text-lg text-primary font-bold">{item.name}</h3>
                                            <span className="font-bold text-primary">{item.price}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full text-muted-foreground hover:border-primary hover:text-primary transition-colors font-medium">
                            Load More Menu <ChevronDown size={18} />
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MenuPage;
