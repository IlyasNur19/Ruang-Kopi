import React, { useState } from 'react';
import { LayoutDashboard, Coffee, Image, Calendar, Bell, User, LogOut } from 'lucide-react';
import DashboardOverview from '../components/admin/DashboardOverview';
import MenuManagement from '../components/admin/MenuManagement';
import GalleryManagement from '../components/admin/GalleryManagement';
import ReservationManagement from '../components/admin/ReservationManagement';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardOverview />;
            case 'menu': return <MenuManagement />;
            case 'gallery': return <GalleryManagement />;
            case 'reservations': return <ReservationManagement />;
            default: return <DashboardOverview />;
        }
    };

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2D2420] text-[#D7CCC8] flex flex-col shrink-0 transition-all duration-300">
                <div className="p-6 flex items-center gap-4 border-b border-white/10">
                    <Coffee className="w-8 h-8 text-white" />
                    <span className="font-heading font-bold text-lg flex flex-col leading-tight text-white">
                        RUANG KOPI
                        <span className="font-sans text-[0.65rem] font-normal tracking-[0.15em] text-[#D7CCC8] mt-0.5">ADMIN DASHBOARD</span>
                    </span>
                </div>

                <nav className="p-4 flex flex-col gap-2 grow">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'menu' ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <Coffee size={20} />
                        <span>Menu Management</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'gallery' ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <Image size={20} />
                        <span>Gallery</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'reservations' ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <Calendar size={20} />
                        <span>Reservations</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <a href="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-all duration-200 text-sm font-medium">
                        <LogOut size={20} />
                        <span>Back to Home</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="grow flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-[70px] bg-background border-b px-8 flex justify-end items-center shrink-0">
                    <div className="flex items-center gap-6">
                        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
                        </button>
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <span className="block font-semibold text-sm text-foreground">Admin Barista</span>
                                <span className="block text-xs text-muted-foreground">Manager</span>
                            </div>
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground group-hover:bg-muted/80 transition-colors">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 grow overflow-y-auto bg-muted/20">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Admin;
