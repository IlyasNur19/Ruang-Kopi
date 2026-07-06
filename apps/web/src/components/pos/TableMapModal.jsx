import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, AlertCircle } from 'lucide-react';
import { mejaApi } from '../../services/api';
import useUIStore from '../../stores/uiStore';
import useTableStore, { TABLE_STATUS } from '../../stores/tableStore';
import useCartStore from '../../stores/cartStore';
import { fetchTablesWithFallback } from '../../lib/tableData';
import TableGrid from './TableGrid';

const TableMapModal = () => {
    const setOpen = useUIStore((s) => s.setPosTableMapOpen);
    const { tables, loading, error, setTables, setLoading, setError } = useTableStore();
    const tableId = useCartStore((s) => s.tableId);
    const setTableId = useCartStore((s) => s.setTableId);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        const loadTables = async () => {
            setLoading(true);
            setError(null);
            const result = await fetchTablesWithFallback(mejaApi.getAll);
            setTables(result.tables);
            setLoading(false);
        };
        loadTables();
    }, []);

    const handleSelectTable = (id) => {
        setAssigning(true);
        setTableId(id === tableId ? null : id);
        setTimeout(() => {
            setAssigning(false);
            setOpen(false);
        }, 300);
    };

    const counts = useTableStore((s) => s.getCounts);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
                {}
                <div className="p-6 border-b border-[#3E2723]/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#3E2723] font-heading">Peta Meja</h2>
                        <p className="text-sm text-[#6D4C41] mt-0.5">
                            Pilih meja untuk pelanggan walk-in
                        </p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F5F0EB] transition-colors"
                    >
                        <X size={20} className="text-[#6D4C41]" />
                    </button>
                </div>

                {}
                <div className="px-6 py-3 flex items-center gap-4 border-b border-[#3E2723]/5 bg-[#F5F0EB]/50">
                    {Object.entries(TABLE_STATUS).map(([status, config]) => (
                        <div key={status} className="flex items-center gap-1.5 text-xs">
                            <span className={`w-3 h-3 rounded-full ${config.color}`} />
                            <span className="text-[#6D4C41] capitalize">{config.label}</span>
                        </div>
                    ))}
                    <div className="ml-auto text-xs text-[#6D4C41]">
                        Total: {counts().total} meja
                    </div>
                </div>

                {}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="grid grid-cols-4 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="aspect-square rounded-2xl bg-[#F5F0EB] animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <AlertCircle size={48} className="text-red-400 mb-4" />
                            <p className="text-[#6D4C41] mb-4">{error}</p>
                            <button
                                onClick={() => {
                                    setLoading(true);
                                    setError(null);
                                    mejaApi.getAll()
                                        .then((data) => setTables(Array.isArray(data) ? data : data?.data || []))
                                        .catch(() => setError('Gagal memuat data meja.'))
                                        .finally(() => setLoading(false));
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3E2723] text-white text-sm hover:bg-[#4E342E] transition-colors"
                            >
                                <RefreshCw size={16} />
                                Coba Lagi
                            </button>
                        </div>
                    ) : tables.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <span className="material-symbols-outlined text-[64px] text-[#3E2723]/10">table_restaurant</span>
                            <p className="text-[#6D4C41] font-medium mt-4">Belum ada meja</p>
                            <p className="text-[#6D4C41]/60 text-sm mt-1">Tambahkan meja dari dashboard admin.</p>
                        </div>
                    ) : (
                        <TableGrid
                            tables={tables}
                            selectedId={tableId}
                            onSelect={handleSelectTable}
                            assigning={assigning}
                        />
                    )}
                </div>

                {}
                <div className="p-4 border-t border-[#3E2723]/10 flex gap-3">
                    <button
                        onClick={() => {
                            setTableId(null);
                            setOpen(false);
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-[#3E2723]/15 text-[#6D4C41] text-sm font-medium hover:bg-[#F5F0EB] transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => setOpen(false)}
                        className="flex-1 py-2.5 rounded-xl bg-[#3E2723] text-white text-sm font-semibold hover:bg-[#4E342E] transition-colors"
                    >
                        Selesai
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TableMapModal;
