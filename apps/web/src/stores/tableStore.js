import { create } from 'zustand';

/**
 * Table Store
 * Manages real-time table status for POS and Reservation.
 * Updated via Socket.io events for live sync.
 */

// Status color mapping for UI
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
    // ========== State ==========
    tables: [],
    loading: false,
    error: null,

    // ========== Actions ==========

    /**
     * Set all tables (from API fetch)
     * @param {Array} tables - Array of table objects
     */
    setTables: (tables) => set({ tables, loading: false, error: null }),

    /**
     * Update a single table's status
     * @param {string} tableId - Table ID
     * @param {string} status - New status ('tersedia' | 'direservasi' | 'terisi')
     */
    updateTableStatus: (tableId, status) => {
        set({
            tables: get().tables.map((table) =>
                table.id === tableId ? { ...table, status } : table
            ),
        });
    },

    /**
     * Add a new table to the list
     * @param {Object} table
     */
    addTable: (table) => {
        set({ tables: [...get().tables, table] });
    },

    /**
     * Remove a table from the list
     * @param {string} tableId
     */
    removeTable: (tableId) => {
        set({ tables: get().tables.filter((t) => t.id !== tableId) });
    },

    /**
     * Set loading state
     * @param {boolean} loading
     */
    setLoading: (loading) => set({ loading }),

    /**
     * Set error state
     * @param {string|null} error
     */
    setError: (error) => set({ error }),

    // ========== Selectors ==========

    /**
     * Get available tables only
     * @returns {Array}
     */
    getAvailable: () => {
        return get().tables.filter((t) => t.status === 'tersedia');
    },

    /**
     * Get tables by status
     * @param {string} status
     * @returns {Array}
     */
    getByStatus: (status) => {
        return get().tables.filter((t) => t.status === status);
    },

    /**
     * Get table by ID
     * @param {string} id
     * @returns {Object|undefined}
     */
    getById: (id) => {
        return get().tables.find((t) => t.id === id);
    },

    /**
     * Get table count by status
     * @returns {Object} { tersedia, direservasi, terisi, total }
     */
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
