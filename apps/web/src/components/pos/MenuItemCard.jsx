import React from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatCurrency } from '../../lib/utils';
import useCartStore from '../../stores/cartStore';

const MenuItemCard = ({ item }) => {
    const addItem = useCartStore((s) => s.addItem);
    const incrementQty = useCartStore((s) => s.incrementQty);
    const decrementQty = useCartStore((s) => s.decrementQty);
    const cartItems = useCartStore((s) => s.items);
    const cartItem = cartItems.find((ci) => ci.menuId === (item.id || item._id));
    const isInCart = !!cartItem;
    const qtyInCart = cartItem?.qty || 0;

    const handleAdd = () => {
        addItem({
            id: item.id || item._id,
            name: item.name,
            price: item.price || item.harga,
            image: item.image,
            category: item.category || item.categoryId,
        });
    };

    const isUnavailable = item.available === false || item.ketersediaan === false;
    const categoryLabel = item.category || item.categoryId || '';

    return (
        <div
            className={cn(
                'bg-white rounded-2xl overflow-hidden transition-all duration-200 group',
                isInCart
                    ? 'ring-2 ring-[#3E2723]/40 shadow-lg'
                    : 'shadow-sm hover:shadow-md border border-[#3E2723]/5',
                isUnavailable && 'opacity-50 pointer-events-none'
            )}
        >
            {}
            <div className="relative h-36 bg-[#F9F7F5] flex items-center justify-center overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-1 text-[#3E2723]/10">
                        <span className="material-symbols-outlined text-[48px]">local_cafe</span>
                    </div>
                )}

                {}
                {categoryLabel && (
                    <span className={cn(
                        'absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize',
                        'bg-white/90 backdrop-blur-sm text-[#6D4C41] shadow-sm'
                    )}>
                        {categoryLabel}
                    </span>
                )}

                {}
                {isUnavailable && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-semibold text-[#6D4C41] bg-white px-3 py-1 rounded-full shadow-sm">
                            Habis
                        </span>
                    </div>
                )}
            </div>

            {}
            <div className="p-3">
                <h3 className="font-semibold text-sm text-[#3E2723] line-clamp-2 mb-1 leading-snug">
                    {item.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-[#3E2723]">
                        {formatCurrency(item.price || item.harga)}
                    </p>

                    {isInCart ? (

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => decrementQty(cartItem.id)}
                                className="w-7 h-7 rounded-full bg-[#3E2723] text-white flex items-center justify-center hover:bg-[#4E342E] transition-colors active:scale-90"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-[#3E2723]">
                                {qtyInCart}
                            </span>
                            <button
                                onClick={handleAdd}
                                className="w-7 h-7 rounded-full bg-[#3E2723] text-white flex items-center justify-center hover:bg-[#4E342E] transition-colors active:scale-90"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    ) : (

                        <button
                            onClick={handleAdd}
                            className="text-xs font-semibold text-[#3E2723] hover:text-[#4E342E] px-3 py-1.5 rounded-lg hover:bg-[#F5F0EB] transition-all active:scale-95"
                        >
                            + Tambah
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
