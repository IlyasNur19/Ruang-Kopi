import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import useCartStore from '../../stores/cartStore';

const CartItem = ({ item }) => {
    const incrementQty = useCartStore((s) => s.incrementQty);
    const decrementQty = useCartStore((s) => s.decrementQty);
    const removeItem = useCartStore((s) => s.removeItem);

    const lineTotal = item.price * item.qty;

    return (
        <div className="flex items-start gap-3 py-3 group">
            {}
            <div className="w-12 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0 overflow-hidden">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="material-symbols-outlined text-[20px] text-[#3E2723]/15">local_cafe</span>
                )}
            </div>

            {}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[#3E2723] leading-tight line-clamp-2 mb-1">
                    {item.name}
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6D4C41]/60 line-through">
                        {formatCurrency(item.price)}
                    </span>
                    <span className="text-xs font-semibold text-[#3E2723]">
                        {item.qty}x
                    </span>
                </div>
            </div>

            {}
            <div className="text-right shrink-0">
                <span className="text-sm font-bold text-[#3E2723]">
                    {formatCurrency(lineTotal)}
                </span>
                <button
                    onClick={() => removeItem(item.id)}
                    className="block mt-1 text-[#6D4C41]/30 hover:text-red-500 transition-colors ml-auto"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
