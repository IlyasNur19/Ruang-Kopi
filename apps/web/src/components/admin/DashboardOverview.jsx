import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, AlertTriangle, CheckCircle, XCircle, Users, Calendar, ShoppingBag, Loader2 } from 'lucide-react';
import { menuApi, reservationsApi, settingsApi } from '../../services/api';
import { Card, CardContent } from '../ui/card';
import RevenueBarChart from './RevenueBarChart';
import TransactionTypePieChart from './TransactionTypePieChart';
import RecentTransactionsTable from './RecentTransactionsTable';

const DashboardOverview = () => {
    const [shopStatus, setShopStatus] = useState('available');
    const [stats, setStats] = useState({
        menuItems: 0,
        reservations: 0,
        pendingReservations: 0,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch menu items, reservations, and current status in parallel
                const [menuData, reservationsData, statusData] = await Promise.all([
                    menuApi.getAll().catch(() => []),
                    reservationsApi.getAll().catch(() => []),
                    settingsApi.getStatus().catch(() => ({ status: 'available' })),
                ]);

                const menuItems = Array.isArray(menuData) ? menuData : [];
                const reservations = Array.isArray(reservationsData) ? reservationsData : [];

                setStats({
                    menuItems: menuItems.length,
                    reservations: reservations.length,
                    pendingReservations: reservations.filter(r => r.status === 'Pending').length,
                });

                // Set the status from API
                if (statusData && statusData.status) {
                    setShopStatus(statusData.status);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to update status via API
    const handleStatusChange = async (newStatus) => {
        try {
            setSaving(true);
            await settingsApi.updateStatus(newStatus);
            setShopStatus(newStatus);
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update status');
        } finally {
            setSaving(false);
        }
    };

    const statusOptions = [
        {
            id: 'available',
            label: 'Tersedia',
            desc: 'Banyak kursi kosong.',
            icon: <CheckCircle size={24} />,
            color: 'text-green-500',
            bg: 'bg-green-50',
            border: 'border-green-500',
            ring: 'ring-green-500'
        },
        {
            id: 'busy',
            label: 'Hampir Penuh',
            desc: 'Sisa beberapa kursi.',
            icon: <AlertTriangle size={24} />,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            border: 'border-orange-500',
            ring: 'ring-orange-500'
        },
        {
            id: 'full',
            label: 'Penuh',
            desc: 'Tidak ada kursi kosong.',
            icon: <XCircle size={24} />,
            color: 'text-red-500',
            bg: 'bg-red-50',
            border: 'border-red-500',
            ring: 'ring-red-500'
        }
    ];

    const statsCards = [
        {
            label: 'Menu Items',
            value: stats.menuItems,
            icon: <ShoppingBag size={20} />,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            label: 'Total Reservations',
            value: stats.reservations,
            icon: <Calendar size={20} />,
            color: 'bg-green-100 text-green-600'
        },
        {
            label: 'Pending Reservations',
            value: stats.pendingReservations,
            icon: <Users size={20} />,
            color: 'bg-purple-100 text-purple-600'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#3E2723]" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="font-heading text-3xl font-bold text-[#3E2723] mb-2">Overview</h1>
                <p className="text-muted-foreground">Manage your shop status and content.</p>
            </motion.div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <RevenueBarChart />
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <TransactionTypePieChart />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                    <RecentTransactionsTable />
                </CardContent>
            </Card>

            {/* Status Section */}
            <section>
                <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-foreground">
                    <Coffee size={20} />
                    Status Ketersediaan Tempat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statusOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`relative bg-card p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${shopStatus === option.id ? `${option.border} shadow-sm` : 'border-transparent hover:border-gray-200'} ${saving ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={() => handleStatusChange(option.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${option.bg} ${option.color}`}>
                                    {option.icon}
                                </div>
                                <div className="grow">
                                    <h3 className="font-bold text-foreground mb-1">{option.label}</h3>
                                    <p className="text-sm text-muted-foreground">{option.desc}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${shopStatus === option.id ? option.border : 'border-gray-200'}`}>
                                    {shopStatus === option.id && <div className={`w-3 h-3 rounded-full ${option.color.replace('text-', 'bg-')}`} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DashboardOverview;
