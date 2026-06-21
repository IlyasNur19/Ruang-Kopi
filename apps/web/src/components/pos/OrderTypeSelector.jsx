import React from 'react';
import { Utensils, ShoppingBag } from 'lucide-react';
import { cn } from '../../lib/utils';
import useCartStore from '../../stores/cartStore';

const OrderTypeSelector = () => {
    const orderType = useCartStore((s) => s.orderType);
    const setOrderType = useCartStore((s) => s.setOrderType);

    const types = [
        { id: 'dine_in', label: 'Dine In', icon: Utensils },
        { id: 'take_away', label: 'Take Away', icon: ShoppingBag },
    ];

    return (
        <div className="flex rounded-xl bg-[#F5F0EB] p-1">
            {types.map((type) => {
                const isActive = orderType === type.id;
                return (
                    <button
                        key={type.id}
                        onClick={() => setOrderType(type.id)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200',
                            isActive
                                ? 'bg-white text-[#3E2723] shadow-sm'
                                : 'text-[#6D4C41] hover:text-[#3E2723]'
                        )}
                    >
                        <type.icon size={14} />
                        {type.label}
                    </button>
                );
            })}
        </div>
    );
};

export default OrderTypeSelector;
