import React, { useState, useEffect } from 'react';
import { Coffee, Grid3X3, Wifi, WifiOff, Clock, User } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import useUIStore from '../../stores/uiStore';
import useCartStore from '../../stores/cartStore';

const POSHeader = ({ user }) => {
    const { isConnected, isReconnecting } = useSocket();
    const toggleTableMap = useUIStore((s) => s.togglePosTableMap);
    const itemCount = useCartStore((s) => s.getItemCount);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <header className="h-16 bg-[#2D2420] text-white flex items-center justify-between px-4 lg:px-6 shrink-0 z-30">
            {/* Left: Brand */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#8D6E63] flex items-center justify-center">
                    <Coffee size={18} className="text-white" />
                </div>
                <div className="hidden sm:block">
                    <h1 className="font-heading font-bold text-sm tracking-wide">RUANG KOPI</h1>
                    <p className="text-[10px] text-[#D7CCC8] tracking-wider">POINT OF SALES</p>
                </div>
            </div>

            {/* Center: Clock & Cart Info */}
            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 text-[#D7CCC8] text-sm">
                    <Clock size={16} />
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-[#8D6E63]">•</span>
                    <span>{formatDate(currentTime)}</span>
                </div>

                {itemCount() > 0 && (
                    <div className="px-3 py-1 rounded-full bg-[#8D6E63] text-white text-xs font-semibold">
                        {itemCount()} item
                    </div>
                )}
            </div>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-3">
                {/* Table Map Toggle */}
                <button
                    onClick={toggleTableMap}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                >
                    <Grid3X3 size={18} />
                    <span className="hidden sm:inline">Peta Meja</span>
                </button>

                {/* Connection Status */}
                <div className="flex items-center gap-1.5">
                    {isConnected ? (
                        <Wifi size={16} className="text-green-400" />
                    ) : isReconnecting ? (
                        <div className="flex items-center gap-1">
                            <WifiOff size={16} className="text-red-400 animate-pulse" />
                            <span className="text-[10px] text-red-400 hidden sm:inline">Reconnecting...</span>
                        </div>
                    ) : (
                        <WifiOff size={16} className="text-gray-400" />
                    )}
                </div>

                {/* User */}
                <div className="flex items-center gap-2 pl-3 border-l border-white/20">
                    <div className="w-8 h-8 rounded-full bg-[#5D4037] flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                    <span className="hidden sm:block text-sm text-[#D7CCC8]">{user?.name || 'Kasir'}</span>
                </div>
            </div>
        </header>
    );
};

export default POSHeader;
