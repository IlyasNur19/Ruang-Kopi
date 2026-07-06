import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    maxNotifications: 50,

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

    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

    clearAll: () => set({ notifications: [] }),

    get unreadCount() {
        return get().notifications.filter((n) => !n.read).length;
    },
}));

export default useNotificationStore;
