import React from 'react';
import { formatCurrency } from '../../lib/utils';
import useCartStore from '../../stores/cartStore';

const CartSummary = () => {
    const summary = useCartStore((s) => s.getSummary);
    const itemCount = useCartStore((s) => s.getItemCount);

    return (
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-[#6D4C41]">Sub Total</span>
                <span className="font-medium text-[#3E2723]">{formatCurrency(summary().subtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-[#6D4C41]">PPN 11%</span>
                <span className="font-medium text-[#3E2723]">{formatCurrency(summary().tax)}</span>
            </div>
            <div className="border-t border-dashed border-[#3E2723]/10 my-2" />
            <div className="flex justify-between items-center">
                <span className="font-bold text-[#3E2723] text-base">Total</span>
                <span className="font-bold text-[#3E2723] text-lg">{formatCurrency(summary().total)}</span>
            </div>
        </div>
    );
};

export default CartSummary;
