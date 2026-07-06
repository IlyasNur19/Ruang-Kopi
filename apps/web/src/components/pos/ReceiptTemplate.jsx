import React, { forwardRef } from 'react';
import useCartStore from '../../stores/cartStore';
import { formatCurrency, formatDateId, formatTime, generateOrderId } from '../../lib/utils';

const ReceiptTemplate = forwardRef((props, ref) => {
    const items = useCartStore((s) => s.items);
    const summary = useCartStore((s) => s.getSummary);
    const tableId = useCartStore((s) => s.tableId);
    const customerName = useCartStore((s) => s.customerName);
    const orderType = useCartStore((s) => s.orderType);

    const now = new Date();
    const orderId = generateOrderId();

    return (
        <div ref={ref} className="receipt-container bg-white p-4 font-mono text-xs" style={{ width: '58mm', maxWidth: '58mm' }}>
            {}
            <div className="text-center border-b border-dashed border-gray-300 pb-2 mb-2">
                <h2 className="font-bold text-sm mb-0.5">RUANG KOPI</h2>
                <p className="text-[10px] text-gray-500">Jl. Example No. 123, Jakarta Selatan</p>
                <p className="text-[10px] text-gray-500">Tel: 0812-3456-7890</p>
            </div>

            {}
            <div className="space-y-0.5 mb-2 text-[10px]">
                <div className="flex justify-between">
                    <span>Tanggal</span>
                    <span>{formatDateId(now)} {formatTime(now)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Order</span>
                    <span className="font-bold">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tipe</span>
                    <span>{orderType === 'dine_in' ? 'Dine-In' : 'Take Away'}</span>
                </div>
                {tableId && (
                    <div className="flex justify-between">
                        <span>Meja</span>
                        <span>Meja {tableId}</span>
                    </div>
                )}
                {customerName && (
                    <div className="flex justify-between">
                        <span>Pelanggan</span>
                        <span>{customerName}</span>
                    </div>
                )}
            </div>

            {}
            <div className="border-t border-dashed border-gray-300 pt-2 mb-2">
                <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>Item</span>
                    <span>Total</span>
                </div>
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-[10px] py-0.5">
                        <span>
                            {item.name} x{item.qty}
                        </span>
                        <span>{formatCurrency(item.price * item.qty)}</span>
                    </div>
                ))}
            </div>

            {}
            <div className="border-t border-dashed border-gray-300 pt-2 space-y-0.5">
                <div className="flex justify-between text-[10px]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(summary().subtotal)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                    <span>PPN 11%</span>
                    <span>{formatCurrency(summary().tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-gray-300 pt-1 mt-1">
                    <span>TOTAL</span>
                    <span>{formatCurrency(summary().total)}</span>
                </div>
            </div>

            {}
            <div className="text-center border-t border-dashed border-gray-300 pt-2 mt-2 text-[10px] text-gray-500 space-y-1">
                <p>Terima kasih!</p>
                <p>Selamat menikmati kopi Anda :)</p>
                <p className="mt-1">---</p>
            </div>
        </div>
    );
});

ReceiptTemplate.displayName = 'ReceiptTemplate';

export default ReceiptTemplate;
