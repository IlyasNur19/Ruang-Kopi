import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import { dashboardApi } from '../../services/api';
import { formatCurrency } from '../../lib/utils';

const RevenueBarChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [days, setDays] = useState(7);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await dashboardApi.getRevenueDaily({ days });
                const chartData = Array.isArray(result) ? result : result?.data || [];
                setData(chartData);
            } catch (err) {
                console.error('Failed to fetch revenue data:', err);
                setError('Gagal memuat data pendapatan.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [days]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-[#3E2723]/10 rounded-xl shadow-lg p-3">
                    <p className="text-sm font-semibold text-[#3E2723] mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-xs" style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={24} className="animate-spin text-[#8D6E63]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle size={32} className="text-red-400 mb-2" />
                <p className="text-sm text-[#6D4C41]">{error}</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-sm text-[#6D4C41]">Belum ada data pendapatan.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#3E2723]">Pendapatan Harian</h3>
                <div className="flex gap-1">
                    {[7, 14, 30].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${days === d ? 'bg-[#3E2723] text-white' : 'bg-[#F5F0EB] text-[#6D4C41] hover:bg-[#E0D8D0]'}`}
                        >
                            {d}H
                        </button>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0D8D0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6D4C41' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#6D4C41' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="online" name="Online" fill="#8D6E63" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="walk_in" name="Walk-in" fill="#D7CCC8" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueBarChart;
