import { create } from 'zustand';

/**
 * UI Store
 * Manages global UI state: active tabs, sidebar, modals.
 */
const useUIStore = create((set) => ({
    // ========== POS ==========
    posActiveView: 'menu', // 'menu' | 'tables' | 'reservation'
    posTableMapOpen: false,
    posCheckoutOpen: false,

    setPosActiveView: (view) => set({ posActiveView: view }),
    setPosTableMapOpen: (open) => set({ posTableMapOpen: open }),
    setPosCheckoutOpen: (open) => set({ posCheckoutOpen: open }),
    togglePosTableMap: () => set((s) => ({ posTableMapOpen: !s.posTableMapOpen })),

    // ========== Admin ==========
    adminActiveTab: 'dashboard',
    adminSidebarOpen: false,

    setAdminActiveTab: (tab) => set({ adminActiveTab: tab }),
    setAdminSidebarOpen: (open) => set({ adminSidebarOpen: open }),
    toggleAdminSidebar: () => set((s) => ({ adminSidebarOpen: !s.adminSidebarOpen })),

    // ========== Global ==========
    sidebarOpen: false,

    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

export default useUIStore;
