import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Coffee, Image, Calendar, Bell, User, LogOut, Menu, X, Home, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardOverview from '../components/admin/DashboardOverview';
import MenuManagement from '../components/admin/MenuManagement';
import GalleryManagement from '../components/admin/GalleryManagement';
import ReservationManagement from '../components/admin/ReservationManagement';
import SpaceImagesManagement from '../components/admin/SpaceImagesManagement';
import IdeasManagement from '../components/admin/IdeasManagement';

const Admin = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false); // Close sidebar on mobile after selecting
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardOverview />;
            case 'menu': return <MenuManagement />;
            case 'gallery': return <GalleryManagement />;
            case 'reservations': return <ReservationManagement />;
            case 'space-images': return <SpaceImagesManagement />;
            case 'ideas': return <IdeasManagement />;
            default: return <DashboardOverview />;
        }
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'menu', label: 'Menu Management', icon: Coffee },
        { id: 'gallery', label: 'Gallery', icon: Image },
        { id: 'space-images', label: 'Space Images', icon: Home },
        { id: 'ideas', label: 'Kotak Gagasan', icon: Lightbulb },
        { id: 'reservations', label: 'Reservations', icon: Calendar },
    ];

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-[#2D2420] text-[#D7CCC8] flex flex-col shrink-0
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <Coffee className="w-8 h-8 text-white" />
                        <span className="font-heading font-bold text-lg flex flex-col leading-tight text-white">
                            RUANG KOPI
                            <span className="font-sans text-[0.65rem] font-normal tracking-[0.15em] text-[#D7CCC8] mt-0.5">ADMIN DASHBOARD</span>
                        </span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                <nav className="p-4 flex flex-col gap-2 grow">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === item.id ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <a href="/" className="flex items-center gap-3 px-4 py-3 text-[#D7CCC8] hover:bg-white/5 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium">
                        <Coffee size={20} />
                        <span>View Website</span>
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="grow flex flex-col h-screen overflow-hidden w-full">
                {/* Header */}
                <header className="h-[70px] bg-background border-b px-4 lg:px-8 flex justify-between items-center shrink-0">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Right side items */}
                    <div className="flex items-center gap-4 lg:gap-6 ml-auto">
                        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
                        </button>
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <span className="block font-semibold text-sm text-foreground">
                                    {user?.name || 'Admin'}
                                </span>
                                <span className="block text-xs text-muted-foreground capitalize">
                                    {user?.role || 'Manager'}
                                </span>
                            </div>
                            <div className="w-10 h-10 bg-[#3E2723] rounded-full flex items-center justify-center text-white group-hover:bg-[#5D4037] transition-colors">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8 grow overflow-y-auto bg-muted/20">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Admin;
