import { create } from 'zustand';

const useUIStore = create((set) => ({

    posActiveView: 'dashboard',
    posTableMapOpen: false,
    posCheckoutOpen: false,

    setPosActiveView: (view) => set({ posActiveView: view }),
    setPosTableMapOpen: (open) => set({ posTableMapOpen: open }),
    setPosCheckoutOpen: (open) => set({ posCheckoutOpen: open }),
    togglePosTableMap: () => set((s) => ({ posTableMapOpen: !s.posTableMapOpen })),

    adminActiveTab: 'dashboard',
    adminSidebarOpen: false,

    setAdminActiveTab: (tab) => set({ adminActiveTab: tab }),
    setAdminSidebarOpen: (open) => set({ adminSidebarOpen: open }),
    toggleAdminSidebar: () => set((s) => ({ adminSidebarOpen: !s.adminSidebarOpen })),

    sidebarOpen: false,

    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

export default useUIStore;
