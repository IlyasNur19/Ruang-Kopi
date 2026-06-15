import React from 'react';
import { Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TABLE_STATUS } from '../../stores/tableStore';

const TableNode = ({ table, isSelected, onSelect, disabled }) => {
    const status = table.status || 'tersedia';
    const config = TABLE_STATUS[status] || TABLE_STATUS.tersedia;
    const tableNumber = table.nomor_meja || table.nomorMeja || table.id;
    const isSelectable = status === 'tersedia' && !disabled;

    return (
        <button
            onClick={() => isSelectable && onSelect(table.id)}
            disabled={!isSelectable}
            className={cn(
                'aspect-square rounded-2xl border-2 p-3 flex flex-col items-center justify-center gap-1.5 transition-all relative',
                isSelected && 'ring-2 ring-offset-2 ring-[#3E2723]',
                isSelectable
                    ? 'border-[#3E2723]/10 hover:border-[#3E2723]/40 hover:shadow-md cursor-pointer active:scale-95'
                    : 'border-transparent cursor-not-allowed opacity-60'
            )}
            style={{ backgroundColor: config.bgColor }}
        >
            {/* Status dot */}
            <div className={cn('w-3 h-3 rounded-full', config.color)} />

            {/* Table number */}
            <span className="font-bold text-[#3E2723] text-lg leading-none">
                {tableNumber}
            </span>

            {/* Capacity */}
            <div className="flex items-center gap-1 text-xs text-[#6D4C41]">
                <Users size={10} />
                <span>{table.kapasitas || 4}</span>
            </div>

            {/* Selected check */}
            {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#3E2723] flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                </div>
            )}
        </button>
    );
};

export default TableNode;
