import React from 'react';
import { motion } from 'framer-motion';
import MenuItemCard from './MenuItemCard';
import { Skeleton } from '../ui/skeleton';

const MenuGrid = ({ items }) => {
    return (
        <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id || item._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                        <MenuItemCard item={item} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

/** Skeleton loading state for MenuGrid */
MenuGrid.Skeleton = function MenuGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#3E2723]/5">
                    <Skeleton className="w-full h-36" />
                    <div className="p-3 space-y-2">
                        <Skeleton className="w-3/4 h-4 rounded" />
                        <div className="flex justify-between items-center">
                            <Skeleton className="w-20 h-4 rounded" />
                            <Skeleton className="w-16 h-7 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuGrid;
