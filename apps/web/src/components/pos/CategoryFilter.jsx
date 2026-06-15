import React from 'react';
import {
    Coffee,
    UtensilsCrossed,
    Soup,
    IceCreamCone,
    Beef,
    Sandwich,
    CakeSlice,
    GlassWater,
    Grid2X2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Map category names to icons
const categoryIcons = {
    all: Grid2X2,
    kopi: Coffee,
    'non-kopi': GlassWater,
    makanan: UtensilsCrossed,
    snack: CakeSlice,
    minuman: GlassWater,
    dessert: IceCreamCone,
    'main course': Beef,
    pasta: Soup,
    burger: Sandwich,
};

const getCategoryIcon = (cat) => {
    const key = cat.toLowerCase();
    return categoryIcons[key] || Coffee;
};

const CategoryFilter = ({ categories, active, onChange, itemCounts = {} }) => {
    const allCategories = ['all', ...categories];

    return (
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide px-1">
            {allCategories.map((cat) => {
                const isActive = active === cat;
                const Icon = getCategoryIcon(cat);
                const label = cat === 'all' ? 'Semua' : cat;
                const count = cat === 'all' 
                    ? Object.values(itemCounts).reduce((sum, c) => sum + c, 0) 
                    : (itemCounts[cat] || 0);

                return (
                    <button
                        key={cat}
                        onClick={() => onChange(cat)}
                        className="flex flex-col items-center gap-1.5 shrink-0 group"
                    >
                        <div
                            className={cn(
                                'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200',
                                isActive
                                    ? 'bg-[#3E2723] text-white shadow-lg shadow-[#3E2723]/20 scale-105'
                                    : 'bg-[#F5F0EB] text-[#8D6E63] group-hover:bg-[#EDE8E3] group-hover:shadow-md'
                            )}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span
                            className={cn(
                                'text-[11px] font-semibold capitalize leading-tight text-center max-w-[60px] truncate',
                                isActive ? 'text-[#3E2723]' : 'text-[#6D4C41]'
                            )}
                        >
                            {label}
                        </span>
                        {count > 0 && (
                            <span className={cn(
                                'text-[10px] font-medium leading-none',
                                isActive ? 'text-[#8D6E63]' : 'text-[#6D4C41]/50'
                            )}>
                                {count} items
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryFilter;
