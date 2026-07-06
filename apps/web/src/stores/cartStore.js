import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateTax } from '../lib/utils';

const useCartStore = create(
    persist(
        (set, get) => ({

            items: [],
            tableId: null,
            customerName: '',
            orderType: 'dine_in',

            addItem: (menuItem) => {
                const { items } = get();
                const existing = items.find((item) => item.menuId === menuItem.id);

                if (existing) {
                    set({
                        items: items.map((item) =>
                            item.menuId === menuItem.id
                                ? { ...item, qty: item.qty + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                id: Date.now().toString(),
                                menuId: menuItem.id,
                                name: menuItem.name,
                                price: menuItem.price,
                                qty: 1,
                                image: menuItem.image || null,
                                category: menuItem.category || null,
                            },
                        ],
                    });
                }
            },

            removeItem: (itemId) => {
                set({ items: get().items.filter((item) => item.id !== itemId) });
            },

            updateQty: (itemId, qty) => {
                if (qty < 1) {
                    get().removeItem(itemId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === itemId ? { ...item, qty } : item
                    ),
                });
            },

            incrementQty: (itemId) => {
                set({
                    items: get().items.map((item) =>
                        item.id === itemId ? { ...item, qty: item.qty + 1 } : item
                    ),
                });
            },

            decrementQty: (itemId) => {
                const item = get().items.find((i) => i.id === itemId);
                if (!item) return;
                if (item.qty <= 1) {
                    get().removeItem(itemId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === itemId ? { ...item, qty: item.qty - 1 } : item
                    ),
                });
            },

            clearCart: () => {
                set({
                    items: [],
                    tableId: null,
                    customerName: '',
                    orderType: 'dine_in',
                });
            },

            setTableId: (tableId) => set({ tableId }),

            setCustomerName: (name) => set({ customerName: name }),

            setOrderType: (orderType) => set({ orderType }),

            getSubtotal: () => {
                return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
            },

            getTax: () => {
                return calculateTax(get().getSubtotal());
            },

            getTotal: () => {
                return get().getSubtotal() + get().getTax();
            },

            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.qty, 0);
            },

            isEmpty: () => {
                return get().items.length === 0;
            },

            getSummary: () => {
                return {
                    subtotal: get().getSubtotal(),
                    tax: get().getTax(),
                    total: get().getTotal(),
                    itemCount: get().getItemCount(),
                };
            },
        }),
        {
            name: 'ruangkopi-pos-cart',
            partialize: (state) => ({
                items: state.items,
                tableId: state.tableId,
                customerName: state.customerName,
                orderType: state.orderType,
            }),
        }
    )
);

export default useCartStore;
