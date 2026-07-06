import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Coffee,
    UtensilsCrossed,
    Grid3X3,
    CalendarCheck,
    LayoutDashboard,
    LogOut,
    User,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import useUIStore from '../../stores/uiStore';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'tables', label: 'Peta Meja', icon: Grid3X3 },
    { id: 'reservation', label: 'Reservasi', icon: CalendarCheck },
];

const POSSidebar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const activeView = useUIStore((s) => s.posActiveView);
    const setActiveView = useUIStore((s) => s.setPosActiveView);
    const toggleTableMap = useUIStore((s) => s.togglePosTableMap);

    const handleNavClick = (id) => {
        if (id === 'tables') {
            toggleTableMap();
        } else {
            setActiveView(id);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <aside className="w-[220px] h-full bg-[#2D2420] text-[#D7CCC8] flex flex-col shrink-0">
            {}
            <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#8D6E63] flex items-center justify-center shadow-md">
                    <Coffee size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-sm text-white tracking-wide">RUANG KOPI</h1>
                    <p className="text-[10px] text-[#D7CCC8] font-medium tracking-wider">POINT OF SALES</p>
                </div>
            </div>

            {}
            <nav className="flex-1 px-3 py-4">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-white/10 text-white shadow-sm'
                                        : 'text-[#D7CCC8] hover:bg-white/5 hover:text-white'
                                )}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {}
            <div className="px-3 pb-4 space-y-2 border-t border-white/10 pt-4">
                {}
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-[#5D4037] flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{user?.name || 'Kasir'}</p>
                        <p className="text-[10px] text-[#D7CCC8] capitalize">{user?.role || 'kasir'}</p>
                    </div>
                </div>

                {}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default POSSidebar;
