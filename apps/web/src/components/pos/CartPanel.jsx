import React, { useState } from 'react';
import { ShoppingBag, Coffee, User } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import useCartStore from '../../stores/cartStore';
import useTableStore from '../../stores/tableStore';
import OrderTypeSelector from './OrderTypeSelector';
import TableSelector from './TableSelector';
import CartItemList from './CartItemList';
import CartSummary from './CartSummary';
import PaymentMethodSelector from './PaymentMethodSelector';
import useUIStore from '../../stores/uiStore';

const CartPanel = () => {
    const items = useCartStore((s) => s.items);
    const isEmpty = useCartStore((s) => s.isEmpty);
    const tableId = useCartStore((s) => s.tableId);
    const customerName = useCartStore((s) => s.customerName);
    const setCustomerName = useCartStore((s) => s.setCustomerName);
    const getItemCount = useCartStore((s) => s.getItemCount);
    const setCheckoutOpen = useUIStore((s) => s.setPosCheckoutOpen);
    const [paymentMethod, setPaymentMethod] = useState('cash');

    // Get selected table info
    const tables = useTableStore((s) => s.tables);
    const selectedTable = tables.find((t) => t.id === tableId);
    const tableLabel = selectedTable
        ? `Meja ${selectedTable.nomor_meja || selectedTable.nomorMeja}`
        : null;

    return (
        <div className="h-full flex flex-col bg-white w-full">
            {/* Header - Table Info */}
            <div className="px-5 pt-5 pb-3 border-b border-[#3E2723]/5">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-lg font-bold text-[#3E2723]">
                            {tableLabel || 'Pilih Meja'}
                        </h2>
                        {customerName && (
                            <p className="text-xs text-[#6D4C41] mt-0.5">{customerName}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#6D4C41]">
                            {getItemCount()} item
                        </span>
                    </div>
                </div>

                {/* Order Type Tabs */}
                <OrderTypeSelector />
            </div>

            {/* Table Selector (for dine-in) */}
            <div className="px-5 py-2 border-b border-[#3E2723]/5">
                <TableSelector />
                {/* Customer Name Input */}
                <div className="flex items-center gap-2 mt-2">
                    <User size={14} className="text-[#6D4C41]/50 shrink-0" />
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nama pelanggan (opsional)"
                        className="flex-1 text-xs bg-transparent border-none focus:outline-none py-1 placeholder:text-[#6D4C41]/40 text-[#3E2723]"
                    />
                </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-hidden">
                {isEmpty() ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-8">
                        <div className="w-16 h-16 rounded-full bg-[#F5F0EB] flex items-center justify-center mb-4">
                            <Coffee size={28} className="text-[#3E2723]/15" />
                        </div>
                        <p className="text-[#6D4C41] font-medium text-sm">Keranjang kosong</p>
                        <p className="text-[#6D4C41]/50 text-xs mt-1 max-w-[200px]">
                            Pilih menu dari panel kiri untuk memulai pesanan.
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-full">
                        <div className="px-5">
                            <CartItemList items={items} />
                        </div>
                    </ScrollArea>
                )}
            </div>

            {/* Bottom Section: Summary, Payment, Place Order */}
            {!isEmpty() && (
                <div className="shrink-0 border-t border-[#3E2723]/5 bg-white">
                    {/* Summary */}
                    <div className="px-5 py-3">
                        <CartSummary />
                    </div>

                    {/* Payment Method Icons */}
                    <div className="px-5 pb-3">
                        <PaymentMethodSelector
                            value={paymentMethod}
                            onChange={setPaymentMethod}
                        />
                    </div>

                    {/* Place Order Button */}
                    <div className="px-5 pb-5">
                        <button
                            onClick={() => setCheckoutOpen(true)}
                            className="w-full py-3.5 rounded-xl bg-[#3E2723] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#4E342E] transition-all shadow-md active:scale-[0.98]"
                        >
                            <ShoppingBag size={16} />
                            Proses Pesanan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPanel;
