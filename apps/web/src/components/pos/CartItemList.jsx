import React from 'react';
import CartItem from './CartItem';

const CartItemList = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="divide-y divide-[#3E2723]/5">
            {items.map((item) => (
                <CartItem key={item.id} item={item} />
            ))}
        </div>
    );
};

export default CartItemList;
