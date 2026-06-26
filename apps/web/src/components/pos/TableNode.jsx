import React from 'react';
import { Users, MoreVertical, LogIn, LogOut, CornerDownLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TABLE_STATUS } from '../../stores/tableStore';
import { useSocket } from '../../context/SocketContext';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
} from '../ui/dropdown-menu';

/**
 * Available status transition options per current status.
 */
const STATUS_ACTIONS = {
    tersedia: [
        { targetStatus: 'terisi', label: 'Tandai Terisi', icon: LogIn, desc: 'Meja digunakan walk-in' },
    ],
    terisi: [
        { targetStatus: 'tersedia', label: 'Tandai Tersedia', icon: LogOut, desc: 'Meja sudah kosong' },
    ],
    direservasi: [
        { targetStatus: 'terisi', label: 'Tandai Terisi', icon: LogIn, desc: 'Tamu reservasi datang' },
        { targetStatus: 'tersedia', label: 'Tandai Tersedia', icon: CornerDownLeft, desc: 'Batalkan reservasi' },
    ],
};

const TableNode = ({ table, isSelected, onSelect, disabled }) => {
    const { occupyTable, releaseTable } = useSocket();
    const status = table.status || 'tersedia';
    const config = TABLE_STATUS[status] || TABLE_STATUS.tersedia;
    const tableNumber = table.nomor_meja || table.nomorMeja || table.id;
    const isSelectable = status === 'tersedia' && !disabled;
    const actions = STATUS_ACTIONS[status] || [];

    /**
     * Change the table status via socket event.
     * - 'terisi' → calls occupyTable (emits table:occupy)
     * - 'tersedia' → calls releaseTable (emits table:release)
     */
    const handleStatusChange = (e, targetStatus) => {
        e.stopPropagation();
        if (targetStatus === 'terisi') {
            occupyTable(table.id);
        } else if (targetStatus === 'tersedia') {
            releaseTable(table.id);
        }
    };

    return (
        <div className="relative group">
            {/* Status action menu — top-right corner */}
            {actions.length > 0 && !disabled && (
                <div className="absolute top-1 right-1 z-10"
                     onClick={(e) => e.stopPropagation()}
                     onMouseDown={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="w-6 h-6 rounded-full bg-white/70 hover:bg-white shadow-sm flex items-center justify-center transition-colors border border-[#3E2723]/10"
                                title="Ubah status meja"
                            >
                                <MoreVertical size={12} className="text-[#3E2723]" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={4} className="w-48">
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                Meja {tableNumber} · <span className={cn('font-medium', config.textColor)}>{config.label}</span>
                            </DropdownMenuLabel>
                            {actions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <DropdownMenuItem
                                        key={action.targetStatus}
                                        onClick={(e) => handleStatusChange(e, action.targetStatus)}
                                        className="flex items-center gap-3 cursor-pointer py-2"
                                    >
                                        <Icon size={16} className="text-[#3E2723]" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{action.label}</span>
                                            <span className="text-[10px] text-muted-foreground">{action.desc}</span>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            {/* Main card button */}
            <button
                onClick={() => isSelectable && onSelect(table.id)}
                disabled={!isSelectable}
                className={cn(
                    'w-full aspect-square rounded-2xl border-2 p-3 flex flex-col items-center justify-center gap-1.5 transition-all relative',
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

                {/* Selected check — top-left to avoid overlap with status menu */}
                {isSelected && (
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#3E2723] flex items-center justify-center">
                        <span className="text-white text-[10px]">✓</span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default TableNode;
