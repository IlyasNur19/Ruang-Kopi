import React, { useEffect } from 'react';
import { Table as TableIcon, Loader2 } from 'lucide-react';
import { mejaApi } from '../../services/api';
import useCartStore from '../../stores/cartStore';
import useTableStore from '../../stores/tableStore';
import { fetchTablesWithFallback } from '../../lib/tableData';

const TableSelector = () => {
    const orderType = useCartStore((s) => s.orderType);
    const tableId = useCartStore((s) => s.tableId);
    const setTableId = useCartStore((s) => s.setTableId);
    const { tables, loading, setTables, setLoading, setError, getAvailable } = useTableStore();

    useEffect(() => {
        if (orderType !== 'dine_in') return;

        const loadTables = async () => {
            setLoading(true);
            const result = await fetchTablesWithFallback(mejaApi.getAll);
            setTables(result.tables);
            setLoading(false);
        };
        loadTables();
    }, [orderType]);

    if (orderType !== 'dine_in') return null;

    const available = getAvailable ? getAvailable() : tables.filter((t) => t.status === 'tersedia');

    return (
        <div className="flex items-center gap-2">
            <TableIcon size={14} className="text-[#6D4C41]/50 shrink-0" />
            {loading ? (
                <div className="flex items-center gap-2 text-xs text-[#6D4C41]/50">
                    <Loader2 size={14} className="animate-spin" />
                    Memuat meja...
                </div>
            ) : available.length === 0 ? (
                <span className="text-xs text-red-500 font-medium">Tidak ada meja tersedia</span>
            ) : (
                <select
                    value={tableId || ''}
                    onChange={(e) => setTableId(e.target.value || null)}
                    className="flex-1 text-xs bg-transparent border-none focus:outline-none text-[#3E2723] font-medium cursor-pointer py-1"
                >
                    <option value="">Pilih Meja...</option>
                    {available.map((table) => (
                        <option key={table.id} value={table.id}>
                            Meja {table.nomor_meja || table.nomorMeja} ({table.kapasitas} org)
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default TableSelector;
