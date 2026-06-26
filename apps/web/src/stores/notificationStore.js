import { create } from 'zustand';

/**
 * Notification Store
 * Manages real-time admin notifications from Socket.io events.
 * Notifications are in-memory only (no persistence).
 */
const useNotificationStore = create((set, get) => ({
    notifications: [],
    maxNotifications: 50,

    /**
     * Add a new notification to the top of the list.
     * Auto-assigns id, read=false, and createdAt timestamp.
     * Trims the list to maxNotifications to prevent memory bloat.
     */
    addNotification: (notification) =>
        set((state) => ({
            notifications: [
                {
                    id: crypto.randomUUID(),
                    ...notification,
                    read: false,
                    createdAt: new Date().toISOString(),
                },
                ...state.notifications,
            ].slice(0, state.maxNotifications),
        })),

    /**
     * Mark a single notification as read by id.
     */
    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),

    /**
     * Mark all notifications as read.
     */
    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

    /**
     * Remove all notifications from the store.
     */
    clearAll: () => set({ notifications: [] }),

    /**
     * Get the count of unread notifications.
     * Called as: useNotificationStore(s => s.unreadCount) — NOT get().unreadCount
     * The selector re-evaluates on every state change.
     */
    get unreadCount() {
        return get().notifications.filter((n) => !n.read).length;
    },
}));

export default useNotificationStore;
