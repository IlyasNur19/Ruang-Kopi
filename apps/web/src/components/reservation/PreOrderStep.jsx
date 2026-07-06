import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, ShoppingBag, Loader2, Coffee, ChevronLeft } from 'lucide-react';
import { menuApi, categoriesApi } from '../../services/api';
import { formatCurrency } from '../../lib/utils';

const PreOrderStep = ({ cartItems, onCartChange, onNext, onBack }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [menuData, catData] = await Promise.all([
                    menuApi.getAll().catch(() => []),
                    categoriesApi.getAll().catch(() => []),
                ]);
                setMenuItems(menuData.filter(item => item.available !== false));
                setCategories(catData);
            } catch {

            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredItems = useMemo(() => {
        let items = menuItems;
        if (activeCategory !== 'All') {
            items = items.filter(item => item.category === activeCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            items = items.filter(
                item =>
                    item.name.toLowerCase().includes(q) ||
                    (item.description && item.description.toLowerCase().includes(q))
            );
        }
        return items;
    }, [menuItems, activeCategory, searchQuery]);

    const categoryLabels = useMemo(() => {
        const cats = ['All'];
        if (categories.length > 0) {
            cats.push(...categories.map(c => c.name));
        } else {

            const unique = [...new Set(menuItems.map(item => item.category).filter(Boolean))];
            cats.push(...unique);
        }
        return cats;
    }, [categories, menuItems]);

    const getItemQty = (item) => {
        const cartItem = cartItems.find(ci => ci.menuId === item.id);
        return cartItem ? cartItem.qty : 0;
    };

    const addToCart = (item) => {
        onCartChange(prev => {
            const existing = prev.find(ci => ci.menuId === item.id);
            if (existing) {
                return prev.map(ci =>
                    ci.menuId === item.id ? { ...ci, qty: ci.qty + 1 } : ci
                );
            }
            return [...prev, { menuId: item.id, name: item.name, price: item.price, qty: 1 }];
        });
    };

    const removeFromCart = (item) => {
        onCartChange(prev => {
            const existing = prev.find(ci => ci.menuId === item.id);
            if (existing && existing.qty <= 1) {
                return prev.filter(ci => ci.menuId !== item.id);
            }
            return prev.map(ci =>
                ci.menuId === item.id ? { ...ci, qty: ci.qty - 1 } : ci
            );
        });
    };

    const cartTotal = cartItems.reduce((sum, ci) => sum + ci.price * ci.qty, 0);
    const cartCount = cartItems.reduce((sum, ci) => sum + ci.qty, 0);

    return (
        <div className="space-y-5">
            {}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-1 text-[#6D4C41] hover:text-[#3E2723] text-sm">
                    <ChevronLeft size={16} /> Kembali
                </button>
                <span className="text-xs text-[#6D4C41]/60">Langkah 3 dari 5</span>
            </div>
            <div>
                <h2 className="font-heading text-2xl text-primary font-bold">Pre-Order Menu</h2>
                <p className="text-sm text-[#6D4C41] mt-1">
                    Pesan lebih dulu agar kopi siap saat Anda tiba. <em>Opsional — bisa dilewati.</em>
                </p>
            </div>

            {}
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1887F]" />
                <input
                    type="text"
                    placeholder="Cari menu..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8D6E63]/20 focus:border-[#8D6E63] transition-all"
                />
            </div>

            {}
            {categoryLabels.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {categoryLabels.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border
                                ${activeCategory === cat
                                    ? 'bg-[#3E2723] text-white border-[#3E2723]'
                                    : 'bg-white text-[#6D4C41] border-gray-200 hover:border-[#3E2723]'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="w-8 h-8 text-[#3E2723] animate-spin" />
                    <p className="text-sm text-[#6D4C41]">Memuat menu...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-10">
                    <Coffee size={40} className="mx-auto text-[#3E2723]/10 mb-3" />
                    <p className="text-sm text-[#6D4C41]">Tidak ada menu ditemukan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-1">
                    {filteredItems.map((item, index) => {
                        const qty = getItemQty(item);
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:border-[#3E2723]/15 transition-all"
                            >
                                {}
                                <div className="w-14 h-14 rounded-lg bg-[#F5F0EB] overflow-hidden shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Coffee size={20} className="text-[#3E2723]/20" />
                                        </div>
                                    )}
                                </div>

                                {}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-[#3E2723] truncate">{item.name}</h4>
                                    <p className="text-xs text-[#6D4C41]/70 truncate">
                                        {item.description || 'Tanpa deskripsi'}
                                    </p>
                                    <p className="text-sm font-bold text-[#3E2723] mt-0.5">
                                        {formatCurrency(item.price)}
                                    </p>
                                </div>

                                {}
                                <div className="flex items-center gap-2 shrink-0">
                                    {qty > 0 ? (
                                        <>
                                            <button
                                                onClick={() => removeFromCart(item)}
                                                className="w-7 h-7 rounded-full border border-[#3E2723]/20 flex items-center justify-center text-[#3E2723] hover:bg-[#F5F0EB] transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold text-[#3E2723] w-5 text-center">
                                                {qty}
                                            </span>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-7 h-7 rounded-full bg-[#3E2723] flex items-center justify-center text-white hover:bg-[#4E342E] transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="w-7 h-7 rounded-full border-2 border-[#3E2723]/20 flex items-center justify-center text-[#3E2723] hover:border-[#3E2723] hover:bg-[#F5F0EB] transition-all"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {}
            <div className="pt-3 border-t border-gray-200">
                {cartCount > 0 && (
                    <div className="flex items-center justify-between mb-3 p-3 bg-[#F5F0EB] rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-[#3E2723]">
                            <ShoppingBag size={16} />
                            <span className="font-medium">{cartCount} item</span>
                        </div>
                        <span className="font-bold text-[#3E2723]">{formatCurrency(cartTotal)}</span>
                    </div>
                )}

                <div className="flex gap-3">
                    {cartCount > 0 && (
                        <button
                            onClick={() => onCartChange([])}
                            className="px-4 py-3 text-sm text-[#6D4C41] border border-gray-200 rounded-xl hover:border-[#3E2723]/40 transition-colors"
                        >
                            Kosongkan
                        </button>
                    )}
                    <button
                        onClick={onNext}
                        className="flex-1 py-3 bg-[#3E2723] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-[#4E342E] active:scale-[0.98]"
                    >
                        {cartCount > 0 ? (
                            <>Lanjut ke Review · {formatCurrency(cartTotal)}</>
                        ) : (
                            <>Lewati & Lanjut Review</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreOrderStep;
