import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateTax } from '../lib/utils';

/**
 * POS Cart Store
 * Manages the POS cart state with localStorage persistence.
 * Each cart item stores a snapshot of the menu item at time of adding.
 */
const useCartStore = create(
    persist(
        (set, get) => ({
            // ========== State ==========
            items: [],
            tableId: null,
            customerName: '',
            orderType: 'dine_in', // 'dine_in' | 'take_away'

            // ========== Actions ==========

            /**
             * Add item to cart or increment quantity if already exists
             * @param {Object} menuItem - { id, name, price, image, category }
             */
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

            /**
             * Remove item from cart entirely
             * @param {string} itemId - The cart item's internal ID
             */
            removeItem: (itemId) => {
                set({ items: get().items.filter((item) => item.id !== itemId) });
            },

            /**
             * Set exact quantity for an item
             * @param {string} itemId - Cart item ID
             * @param {number} qty - New quantity (must be >= 1)
             */
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

            /**
             * Increment quantity by 1
             * @param {string} itemId - Cart item ID
             */
            incrementQty: (itemId) => {
                set({
                    items: get().items.map((item) =>
                        item.id === itemId ? { ...item, qty: item.qty + 1 } : item
                    ),
                });
            },

            /**
             * Decrement quantity by 1. Removes item if qty reaches 0.
             * @param {string} itemId - Cart item ID
             */
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

            /**
             * Clear all items and reset order details
             */
            clearCart: () => {
                set({
                    items: [],
                    tableId: null,
                    customerName: '',
                    orderType: 'dine_in',
                });
            },

            /**
             * Set assigned table ID for dine-in orders
             * @param {string|null} tableId
             */
            setTableId: (tableId) => set({ tableId }),

            /**
             * Set customer name for the order
             * @param {string} name
             */
            setCustomerName: (name) => set({ customerName: name }),

            /**
             * Set order type
             * @param {'dine_in' | 'take_away'} orderType
             */
            setOrderType: (orderType) => set({ orderType }),

            // ========== Computed (via getters) ==========

            /**
             * Get cart subtotal
             * @returns {number}
             */
            getSubtotal: () => {
                return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
            },

            /**
             * Get tax (11% PPN)
             * @returns {number}
             */
            getTax: () => {
                return calculateTax(get().getSubtotal());
            },

            /**
             * Get grand total (subtotal + tax)
             * @returns {number}
             */
            getTotal: () => {
                return get().getSubtotal() + get().getTax();
            },

            /**
             * Get total item count
             * @returns {number}
             */
            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.qty, 0);
            },

            /**
             * Check if cart is empty
             * @returns {boolean}
             */
            isEmpty: () => {
                return get().items.length === 0;
            },

            /**
             * Get cart summary as an object
             * @returns {Object} { subtotal, tax, total, itemCount }
             */
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
