import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    Receipt,
    TrendingUp,
    Grid3X3,
    PlusCircle,
    CalendarCheck,
    Clock,
    Users,
    ChevronRight,
    Loader2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { dashboardApi, mejaApi, reservationsApi } from '../../services/api';
import useUIStore from '../../stores/uiStore';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('IDR', 'Rp');
};

const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const COLORS = ['#3E2723', '#8D6E63', '#D7CCC8', '#5D4037'];

const POSDashboard = () => {
    const setActiveView = useUIStore((s) => s.setPosActiveView);
    const toggleTableMap = useUIStore((s) => s.togglePosTableMap);

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ count: 0, revenue: 0, avg: 0 });
    const [tableStatus, setTableStatus] = useState({ tersedia: 0, total: 0 });
    const [dailyRevenue, setDailyRevenue] = useState([]);
    const [paymentMethodData, setPaymentMethodData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [
                    statsData,
                    mejaStatusData,
                    revenueDailyData,
                    revenueTypeData,
                    recentTransData,
                    reservationsData
                ] = await Promise.all([
                    dashboardApi.getStats().catch(() => null),
                    mejaApi.getStatus().catch(() => null),
                    dashboardApi.getRevenueDaily().catch(() => []),
                    dashboardApi.getRevenueByType().catch(() => null),
                    dashboardApi.getRecentTransactions(5).catch(() => []),
                    reservationsApi.getAll().catch(() => [])
                ]);

                if (statsData?.today) {
                    setStats({
                        count: statsData.today.count || 0,
                        revenue: statsData.today.revenue || 0,
                        avg: statsData.averagePerTransaction || 0
                    });
                }

                if (mejaStatusData) {
                    setTableStatus({
                        tersedia: mejaStatusData.tersedia || 0,
                        total: mejaStatusData.total || 0
                    });
                }

                if (revenueDailyData && revenueDailyData.length > 0) {
                    const formattedChart = revenueDailyData.map(item => ({
                        date: formatDate(item.date),
                        revenue: item.revenue
                    }));
                    setDailyRevenue(formattedChart);
                }

                if (revenueTypeData?.byPaymentMethod) {
                    setPaymentMethodData(revenueTypeData.byPaymentMethod);
                }

                if (recentTransData) {
                    setRecentTransactions(recentTransData);
                }

                if (reservationsData && Array.isArray(reservationsData)) {

                    const today = new Date();
                    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                    const todaysPending = reservationsData.filter(r =>
                        r.date === todayStr &&
                        (r.status === 'Pending' || r.status === 'pending')
                    );
                    setReservations(todaysPending);
                }

            } catch (error) {
                console.error("Error fetching POS dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        const interval = setInterval(fetchDashboardData, 60000);
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        {
            title: 'Pendapatan Hari Ini',
            value: formatCurrency(stats.revenue),
            icon: <DollarSign size={24} className="text-[#8D6E63]" />,
            bg: 'bg-white'
        },
        {
            title: 'Transaksi Hari Ini',
            value: stats.count,
            icon: <Receipt size={24} className="text-[#8D6E63]" />,
            bg: 'bg-white'
        },
        {
            title: 'Rata-rata per Transaksi',
            value: formatCurrency(stats.avg),
            icon: <TrendingUp size={24} className="text-[#8D6E63]" />,
            bg: 'bg-white'
        },
        {
            title: 'Status Meja',
            value: `${tableStatus.tersedia} / ${tableStatus.total}`,
            subtitle: 'Meja Tersedia',
            icon: <Grid3X3 size={24} className="text-[#8D6E63]" />,
            bg: 'bg-white'
        }
    ];

    if (loading) {
        return (
            <div className="flex-1 h-full flex flex-col items-center justify-center bg-[#F5F0EB]">
                <Loader2 className="w-10 h-10 animate-spin text-[#3E2723] mb-4" />
                <p className="text-[#6D4C41] font-medium animate-pulse">Memuat data operasional...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full overflow-y-auto bg-[#F5F0EB] p-6 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-6">

                {}
                <div className="flex justify-between items-end">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-2xl font-bold text-[#3E2723] tracking-tight">Dashboard Kasir</h1>
                        <p className="text-[#6D4C41] text-sm">Ringkasan operasional hari ini secara real-time.</p>
                    </motion.div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#3E2723]">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-[#6D4C41] text-xs">Pembaruan otomatis tiap menit</p>
                    </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`${card.bg} rounded-2xl p-5 shadow-sm border border-[#3E2723]/5 flex items-center gap-4`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center shrink-0">
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#6D4C41] mb-1">{card.title}</p>
                                <h3 className="text-lg font-bold text-[#3E2723] leading-none">{card.value}</h3>
                                {card.subtitle && (
                                    <p className="text-[10px] text-[#8D6E63] mt-1">{card.subtitle}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#3E2723]/5"
                    >
                        <h3 className="text-base font-bold text-[#3E2723] mb-6">Pendapatan 7 Hari Terakhir</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3E2723" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3E2723" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0D8D0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#8D6E63', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#8D6E63', fontSize: 12 }}
                                        tickFormatter={(val) => `Rp${(val/1000000).toFixed(1)}M`}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        formatter={(value) => [formatCurrency(value), 'Pendapatan']}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3E2723"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-[#3E2723]/5"
                    >
                        <h3 className="text-base font-bold text-[#3E2723] mb-2">Metode Pembayaran</h3>
                        <div className="h-[250px] w-full flex items-center justify-center">
                            {paymentMethodData.length > 0 && paymentMethodData.some(d => d.value > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={paymentMethodData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {paymentMethodData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-sm text-[#8D6E63]">Belum ada data transaksi hari ini.</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">

                    {}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setActiveView('menu')}
                                className="bg-[#3E2723] text-white p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#4E342E] transition-colors shadow-sm"
                            >
                                <PlusCircle size={20} />
                                <span className="font-semibold text-sm">Pesanan Baru</span>
                            </button>
                            <button
                                onClick={() => toggleTableMap()}
                                className="bg-white text-[#3E2723] border border-[#3E2723]/20 p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#F5F0EB] transition-colors shadow-sm"
                            >
                                <Grid3X3 size={20} />
                                <span className="font-semibold text-sm">Lihat Peta Meja</span>
                            </button>
                        </div>

                        {}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#3E2723]/5 overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#3E2723]/5 flex justify-between items-center">
                                <h3 className="text-base font-bold text-[#3E2723]">Transaksi Terakhir</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-[#8D6E63] uppercase bg-[#F9F7F5]">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Order ID</th>
                                            <th className="px-6 py-3 font-semibold">Waktu</th>
                                            <th className="px-6 py-3 font-semibold">Tipe</th>
                                            <th className="px-6 py-3 font-semibold">Metode</th>
                                            <th className="px-6 py-3 font-semibold text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#3E2723]/5">
                                        {recentTransactions.map((trx) => (
                                            <tr key={trx.id} className="hover:bg-[#F5F0EB]/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-[#3E2723]">{trx.orderId}</td>
                                                <td className="px-6 py-4 text-[#6D4C41]">{formatTime(trx.createdAt)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        trx.tipePesanan === 'dine_in' ? 'bg-orange-100 text-orange-800' :
                                                        trx.tipePesanan === 'take_away' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {trx.tipePesanan === 'dine_in' ? 'Dine In' : trx.tipePesanan === 'take_away' ? 'Take Away' : 'Online'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="uppercase text-xs font-bold text-[#6D4C41]">
                                                        {trx.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-[#3E2723]">
                                                    {formatCurrency(trx.total)}
                                                </td>
                                            </tr>
                                        ))}
                                        {recentTransactions.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-[#8D6E63]">
                                                    Belum ada transaksi hari ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>

                    {}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-sm border border-[#3E2723]/5 flex flex-col h-full"
                    >
                        <div className="px-6 py-5 border-b border-[#3E2723]/5 flex justify-between items-center">
                            <h3 className="text-base font-bold text-[#3E2723] flex items-center gap-2">
                                <CalendarCheck size={18} />
                                Reservasi Hari Ini
                            </h3>
                            <span className="bg-[#3E2723] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {reservations.length}
                            </span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                            {reservations.length > 0 ? (
                                <div className="space-y-3">
                                    {reservations.map(res => (
                                        <div key={res.id} className="p-4 rounded-xl border border-[#3E2723]/10 hover:border-[#3E2723]/30 transition-colors bg-[#F9F7F5] group cursor-pointer" onClick={() => setActiveView('reservation')}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-[#3E2723] text-sm">{res.name}</h4>
                                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    {res.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-[#6D4C41]">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-[#8D6E63]" />
                                                    <span>{res.time}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users size={14} className="text-[#8D6E63]" />
                                                    <span>{res.guests} Pax</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-[#3E2723]/5 flex justify-end">
                                                <span className="text-[11px] font-semibold text-[#8D6E63] group-hover:text-[#3E2723] flex items-center transition-colors">
                                                    Tandai Tiba <ChevronRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                    <div className="w-12 h-12 rounded-full bg-[#F5F0EB] flex items-center justify-center mb-3">
                                        <CalendarCheck size={20} className="text-[#8D6E63]" />
                                    </div>
                                    <p className="text-sm font-medium text-[#6D4C41]">Tidak ada reservasi mendatang hari ini.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-[#3E2723]/5">
                            <button
                                onClick={() => setActiveView('reservation')}
                                className="w-full py-2.5 text-sm font-semibold text-[#3E2723] bg-[#F5F0EB] hover:bg-[#E0D8D0] rounded-xl transition-colors"
                            >
                                Kelola Semua Reservasi
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default POSDashboard;
