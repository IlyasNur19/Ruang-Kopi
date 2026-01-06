import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Coffee, Image, Calendar, Bell, User, LogOut } from 'lucide-react';
import '../styles/Admin.css';

// Admin Components
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
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <Coffee className="w-8 h-8 text-white" />
                    <span className="sidebar-brand">RUANG KOPI <span className="brand-subtitle">ADMIN DASHBOARD</span></span>
                </div>

                <nav className="sidebar-nav">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
                        style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
                    >
                        <Coffee size={20} />
                        <span>Menu Management</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                        style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
                    >
                        <Image size={20} />
                        <span>Gallery</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={`nav-item ${activeTab === 'reservations' ? 'active' : ''}`}
                        style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
                    >
                        <Calendar size={20} />
                        <span>Reservations</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <a href="/" className="nav-item logout">
                        <LogOut size={20} />
                        <span>Back to Home</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Header */}
                <header className="admin-header">
                    <div className="header-right">
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">Admin Barista</span>
                                <span className="user-role">Manager</span>
                            </div>
                            <div className="user-avatar">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Admin;
