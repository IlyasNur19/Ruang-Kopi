import React from 'react';
import { cn } from '../../lib/utils';

const CategoryFilter = ({ categories, active, onChange }) => {
    const allCategories = ['all', ...categories];

    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {allCategories.map((cat) => {
                const isActive = active === cat;
                const label = cat === 'all' ? 'Semua' : cat;

                return (
                    <button
                        key={cat}
                        onClick={() => onChange(cat)}
                        className={cn(
                            'px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all duration-200 shrink-0',
                            isActive
                                ? 'bg-[#3E2723] text-white shadow-sm'
                                : 'bg-[#F5F0EB] text-[#6D4C41] hover:bg-[#EDE8E3]'
                        )}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryFilter;

