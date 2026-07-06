import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, CreditCard } from 'lucide-react';
import useCartStore from '../../stores/cartStore';
import useUIStore from '../../stores/uiStore';
import ReceiptTemplate from './ReceiptTemplate';

const CartActions = () => {
    const printRef = useRef(null);
    const setCheckoutOpen = useUIStore((s) => s.setPosCheckoutOpen);
    const isEmpty = useCartStore((s) => s.isEmpty);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Struk-RuangKopi',
        removeAfterPrint: false,
    });

    return (
        <div className="p-4 flex flex-col gap-2">
            {}
            <button
                onClick={() => handlePrint()}
                disabled={isEmpty()}
                className="w-full py-2.5 rounded-xl border-2 border-[#3E2723] text-[#3E2723] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#3E2723]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
                <Printer size={16} />
                Cetak Bill
            </button>

            {}
            <button
                onClick={() => setCheckoutOpen(true)}
                disabled={isEmpty()}
                className="w-full py-3 rounded-xl bg-[#3E2723] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#4E342E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-md"
            >
                <CreditCard size={16} />
                Checkout
            </button>

            {}
            <div className="hidden">
                <ReceiptTemplate ref={printRef} />
            </div>
        </div>
    );
};

export default CartActions;
