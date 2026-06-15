import React, { useEffect, useState } from 'react';
import { Users, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { mejaApi } from '../../services/api';
import { TABLE_STATUS } from '../../stores/tableStore';

const TableSelectionStep = ({ selectedTable, onSelect, date, time }) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                setLoading(true);
                setError(null);
                const params = {};
                if (date) params.date = date;
                if (time) params.time = time;
                const data = await mejaApi.getStatus(params);
                setTables(Array.isArray(data) ? data : data?.data || []);
            } catch (err) {
                console.error('Failed to fetch table status:', err);
                // Fallback: get all tables
                try {
                    const data = await mejaApi.getAll();
                    setTables(Array.isArray(data) ? data : data?.data || []);
                } catch {
                    setError('Gagal memuat data meja.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, [date, time]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-[#F5F0EB] animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
                <p className="text-[#6D4C41] text-sm mb-3">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-[#3E2723] text-white text-xs hover:bg-[#4E342E]"
                >
                    <RefreshCw size={14} />
                    Muat Ulang
                </button>
            </div>
        );
    }

    if (tables.length === 0) {
        return (
            <div className="text-center py-8">
                <span className="material-symbols-outlined text-[48px] text-[#3E2723]/10">table_restaurant</span>
                <p className="text-[#6D4C41] text-sm mt-3">Tidak ada meja tersedia untuk tanggal ini.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tables.map((table) => {
                const status = table.status || 'tersedia';
                const config = TABLE_STATUS[status] || TABLE_STATUS.tersedia;
                const isAvailable = status === 'tersedia';
                const isSelected = selectedTable === table.id;

                return (
                    <button
                        key={table.id}
                        onClick={() => isAvailable && onSelect(table.id)}
                        disabled={!isAvailable}
                        className={cn(
                            'aspect-square rounded-2xl border-2 p-3 flex flex-col items-center justify-center gap-1.5 transition-all',
                            isSelected && 'ring-2 ring-offset-2 ring-[#3E2723] border-[#3E2723]',
                            isAvailable
                                ? 'border-[#3E2723]/10 hover:border-[#3E2723]/40 hover:shadow-md cursor-pointer active:scale-95'
                                : 'border-transparent cursor-not-allowed opacity-60'
                        )}
                        style={{ backgroundColor: isAvailable ? '#F9F7F5' : config.bgColor }}
                    >
                        <div className={cn('w-3 h-3 rounded-full', config.color)} />
                        <span className="font-bold text-[#3E2723] text-lg leading-none">
                            {table.nomor_meja || table.nomorMeja}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[#6D4C41]">
                            <Users size={10} />
                            <span>{table.kapasitas || 4} org</span>
                        </div>
                        <span className="text-[10px] text-[#6D4C41]/70">{config.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default TableSelectionStep;
