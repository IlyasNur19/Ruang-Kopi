import React, { useState, useEffect, useMemo } from 'react';
import { Coffee, AlertCircle, RefreshCw } from 'lucide-react';
import { menuApi } from '../../services/api';
import CategoryFilter from './CategoryFilter';
import MenuGrid from './MenuGrid';

const MenuPanel = ({ searchQuery = '' }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    const fetchMenu = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await menuApi.getAll();
            const items = Array.isArray(data) ? data : data?.data || [];
            setMenuItems(items);

            // Extract unique categories
            const cats = [...new Set(items.map((item) => item.category || item.categoryId).filter(Boolean))];
            setCategories(cats);
        } catch (err) {
            console.error('Failed to fetch menu:', err);
            setError('Gagal memuat menu. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    // Calculate item counts per category
    const itemCounts = useMemo(() => {
        const counts = {};
        const availableItems = menuItems.filter(
            (item) => item.available !== false && item.ketersediaan !== false
        );
        availableItems.forEach((item) => {
            const cat = (item.category || item.categoryId || '').toLowerCase();
            if (cat) {
                counts[cat] = (counts[cat] || 0) + 1;
            }
        });
        return counts;
    }, [menuItems]);

    // Filter menu based on category and search
    const filteredItems = useMemo(() => {
        let items = [...menuItems];

        // Filter by category
        if (activeCategory !== 'all') {
            items = items.filter((item) => {
                const cat = (item.category || item.categoryId || '').toLowerCase();
                return cat === activeCategory.toLowerCase();
            });
        }

        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            items = items.filter((item) =>
                (item.name || '').toLowerCase().includes(query)
            );
        }

        // Filter out unavailable items
        items = items.filter((item) => item.available !== false && item.ketersediaan !== false);

        return items;
    }, [menuItems, activeCategory, searchQuery]);

    return (
        <div className="h-full flex flex-col bg-[#F5F0EB]">
            {/* Category Filter */}
            <div className="py-4 px-4 bg-white border-b border-[#3E2723]/5">
                <CategoryFilter
                    categories={categories}
                    active={activeCategory}
                    onChange={setActiveCategory}
                    itemCounts={itemCounts}
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-4">
                        <MenuGrid.Skeleton />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <AlertCircle size={48} className="text-red-400 mb-4" />
                        <p className="text-[#6D4C41] mb-4">{error}</p>
                        <button
                            onClick={fetchMenu}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3E2723] text-white text-sm font-semibold hover:bg-[#4E342E] transition-colors shadow-md"
                        >
                            <RefreshCw size={16} />
                            Coba Lagi
                        </button>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <Coffee size={48} className="text-[#3E2723]/15 mb-4" />
                        <p className="text-[#6D4C41] font-medium">Tidak ada menu ditemukan</p>
                        <p className="text-[#6D4C41]/60 text-sm mt-1">
                            {searchQuery ? 'Coba kata kunci lain.' : 'Silakan tambahkan menu dari dashboard admin.'}
                        </p>
                    </div>
                ) : (
                    <MenuGrid items={filteredItems} />
                )}
            </div>
        </div>
    );
};

export default MenuPanel;
