import React from 'react';
import { Search, Wifi, WifiOff, Bell } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import useCartStore from '../../stores/cartStore';

const POSTopBar = ({ searchQuery, onSearchChange }) => {
    const { isConnected, isReconnecting } = useSocket();
    const tableId = useCartStore((s) => s.tableId);
    const customerName = useCartStore((s) => s.customerName);

    return (
        <div className="h-16 bg-white border-b border-[#3E2723]/5 flex items-center justify-between px-6 shrink-0">
            {}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6D4C41]/50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Cari menu di sini..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F5F0EB] border border-[#3E2723]/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E2723]/15 focus:border-[#3E2723]/25 transition-all placeholder:text-[#6D4C41]/50 text-[#3E2723]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D4C41]/50 hover:text-[#3E2723] text-lg leading-none"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {}
            <div className="flex items-center gap-4">
                {}
                <div className="flex items-center gap-1.5">
                    {isConnected ? (
                        <div className="flex items-center gap-1.5 text-green-500">
                            <Wifi size={16} />
                            <span className="text-xs font-medium hidden xl:inline">Online</span>
                        </div>
                    ) : isReconnecting ? (
                        <div className="flex items-center gap-1.5 text-amber-500">
                            <WifiOff size={16} className="animate-pulse" />
                            <span className="text-xs font-medium hidden xl:inline">Reconnecting...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <WifiOff size={16} />
                            <span className="text-xs font-medium hidden xl:inline">Offline</span>
                        </div>
                    )}
                </div>

                {}
                <button className="relative w-9 h-9 rounded-xl bg-[#F5F0EB] flex items-center justify-center text-[#6D4C41] hover:bg-[#EDE8E3] transition-colors">
                    <Bell size={18} />
                </button>

                {}
                {(tableId || customerName) && (
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F0EB] border border-[#3E2723]/10">
                        {customerName && (
                            <span className="text-xs font-medium text-[#3E2723]">{customerName}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default POSTopBar;
