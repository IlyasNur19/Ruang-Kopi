import React from 'react';
import { User } from 'lucide-react';
import useCartStore from '../../stores/cartStore';

const CustomerInput = () => {
    const customerName = useCartStore((s) => s.customerName);
    const setCustomerName = useCartStore((s) => s.setCustomerName);

    return (
        <div className="flex items-center gap-2">
            <User size={14} className="text-[#6D4C41]/50 shrink-0" />
            <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama pelanggan (opsional)"
                className="flex-1 text-xs bg-transparent border-b border-transparent focus:border-[#3E2723]/20 focus:outline-none py-1 placeholder:text-[#6D4C41]/40 text-[#3E2723]"
            />
        </div>
    );
};

export default CustomerInput;
