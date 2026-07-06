import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { menuApi, categoriesApi } from '../services/api';
import { useApi } from '../hooks/useApi';

const formatPrice = (price) => {
    if (price >= 1000) {
        return `${Math.round(price / 1000)}K`;
    }
    return `${price}K`;
};

const MenuPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const { data: menuItems, loading: menuLoading, error: menuError } = useApi(menuApi.getAll);

    const { data: categoriesData, loading: categoriesLoading } = useApi(categoriesApi.getAll);

    const categories = useMemo(() => {
        if (!categoriesData) return ['All'];
        return ['All', ...categoriesData.map(cat => cat.name)];
    }, [categoriesData]);

    const filteredItems = useMemo(() => {
        if (!menuItems) return [];
        if (activeCategory === 'All') return menuItems.filter(item => item.available !== false);
        return menuItems.filter(item => item.category === activeCategory && item.available !== false);
    }, [menuItems, activeCategory]);

    const isLoading = menuLoading || categoriesLoading;

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
            <Navbar />
            <main className="flex-grow pt-10 pb-20">
                <div className="container mx-auto px-8">
                    {}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-2xl mx-auto mb-12"
                    >
                        <h1 className="font-heading text-5xl md:text-6xl text-primary mb-4 font-bold">Menu Kami</h1>
                        <p className="text-muted-foreground text-sm md:text-lg leading-relaxed px-6">
                            Crafted with passion, served with love. Explore our selection of premium beans and handcrafted pastries, made to perfect your daily ritual.
                        </p>
                    </motion.div>

                    {}
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

                    {}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-muted-foreground">Memuat menu...</p>
                        </div>
                    )}

                    {}
                    {menuError && !isLoading && (
                        <div className="text-center py-20">
                            <p className="text-red-500 mb-4">Gagal memuat menu: {menuError}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {}
                    {!isLoading && !menuError && (
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
                                        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-heading text-lg text-primary font-bold">{item.name}</h3>
                                                <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {}
                    {!isLoading && !menuError && filteredItems.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">Tidak ada menu dalam kategori ini.</p>
                        </div>
                    )}

                    {}
                    {!isLoading && filteredItems.length > 8 && (
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full text-muted-foreground hover:border-primary hover:text-primary transition-colors font-medium">
                                Load More Menu <ChevronDown size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MenuPage;
