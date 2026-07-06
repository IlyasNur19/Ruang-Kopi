import { create } from 'zustand';

export const TABLE_STATUS = {
    tersedia: {
        label: 'Tersedia',
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
    },
    direservasi: {
        label: 'Direservasi',
        color: 'bg-red-500',
        textColor: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
    },
    terisi: {
        label: 'Terisi',
        color: 'bg-amber-500',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300',
    },
};

const useTableStore = create((set, get) => ({

    tables: [],
    loading: false,
    error: null,

    setTables: (tables) => set({ tables, loading: false, error: null }),

    updateTableStatus: (tableId, status) => {
        set({
            tables: get().tables.map((table) =>
                table.id === tableId ? { ...table, status } : table
            ),
        });
    },

    addTable: (table) => {
        set({ tables: [...get().tables, table] });
    },

    removeTable: (tableId) => {
        set({ tables: get().tables.filter((t) => t.id !== tableId) });
    },

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    getAvailable: () => {
        return get().tables.filter((t) => t.status === 'tersedia');
    },

    getByStatus: (status) => {
        return get().tables.filter((t) => t.status === status);
    },

    getById: (id) => {
        return get().tables.find((t) => t.id === id);
    },

    getCounts: () => {
        const tables = get().tables;
        return {
            tersedia: tables.filter((t) => t.status === 'tersedia').length,
            direservasi: tables.filter((t) => t.status === 'direservasi').length,
            terisi: tables.filter((t) => t.status === 'terisi').length,
            total: tables.length,
        };
    },
}));

export default useTableStore;
