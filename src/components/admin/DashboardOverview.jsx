import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, AlertTriangle, CheckCircle, XCircle, Users, DollarSign, ShoppingBag } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';

const DashboardOverview = () => {
    const [shopStatus, setShopStatus] = useLocalStorage('shopStatus', 'available');

    const statusOptions = [
        {
            id: 'available',
            label: 'Tersedia',
            desc: 'Banyak kursi kosong.',
            icon: <CheckCircle size={24} />,
            color: '#4CAF50',
            bg: '#E8F5E9'
        },
        {
            id: 'busy',
            label: 'Hampir Penuh',
            desc: 'Sisa beberapa kursi.',
            icon: <AlertTriangle size={24} />,
            color: '#FF9800',
            bg: '#FFF3E0'
        },
        {
            id: 'full',
            label: 'Penuh',
            desc: 'Tidak ada kursi kosong.',
            icon: <XCircle size={24} />,
            color: '#EF5350',
            bg: '#FFEBEE'
        }
    ];

    const stats = [
        { label: 'Total Pesanan', value: '128', icon: <ShoppingBag size={20} />, color: 'blue' },
        { label: 'Pendapatan', value: 'Rp 2.5jt', icon: <DollarSign size={20} />, color: 'green' },
        { label: 'Pengunjung', value: '84', icon: <Users size={20} />, color: 'purple' },
    ];

    return (
        <div className="dashboard-overview">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="content-header"
            >
                <h1>Overview</h1>
                <p>Manage your shop status and content.</p>
            </motion.div>

            {/* Stats Row */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '10px', borderRadius: '8px', background: `var(--${stat.color}-100, #f3f4f6)`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Section */}
            <section className="status-section">
                <h2><Coffee size={20} /> Status Ketersediaan Tempat</h2>
                <div className="status-grid">
                    {statusOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`status-card ${shopStatus === option.id ? 'active' : ''}`}
                            onClick={() => setShopStatus(option.id)}
                            style={{ borderColor: shopStatus === option.id ? option.color : 'transparent' }}
                        >
                            <div className="status-icon" style={{ color: option.color, backgroundColor: option.bg }}>
                                {option.icon}
                            </div>
                            <div className="status-info">
                                <h3>{option.label}</h3>
                                <p>{option.desc}</p>
                            </div>
                            <div className={`radio-indicator ${shopStatus === option.id ? 'checked' : ''}`} style={{ borderColor: shopStatus === option.id ? option.color : '#ddd' }}>
                                {shopStatus === option.id && <div className="radio-inner" style={{ backgroundColor: option.color }} />}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DashboardOverview;
