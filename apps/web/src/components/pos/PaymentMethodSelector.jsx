import React from 'react';
import { Banknote, CreditCard, QrCode } from 'lucide-react';
import { cn } from '../../lib/utils';

const PaymentMethodSelector = ({ value, onChange }) => {
    const methods = [
        { id: 'cash', label: 'Tunai', icon: Banknote },
        { id: 'card', label: 'Kartu', icon: CreditCard },
        { id: 'qris', label: 'QRIS', icon: QrCode },
    ];

    return (
        <div className="flex justify-center gap-6">
            {methods.map((method) => {
                const isActive = value === method.id;
                return (
                    <button
                        key={method.id}
                        onClick={() => onChange(method.id)}
                        className="flex flex-col items-center gap-1.5 group"
                    >
                        <div
                            className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200',
                                isActive
                                    ? 'bg-[#3E2723] text-white shadow-md'
                                    : 'bg-[#F5F0EB] text-[#8D6E63] group-hover:bg-[#EDE8E3] group-hover:text-[#6D4C41]'
                            )}
                        >
                            <method.icon size={20} />
                        </div>
                        <span
                            className={cn(
                                'text-[10px] font-semibold',
                                isActive ? 'text-[#3E2723]' : 'text-[#6D4C41]'
                            )}
                        >
                            {method.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default PaymentMethodSelector;
