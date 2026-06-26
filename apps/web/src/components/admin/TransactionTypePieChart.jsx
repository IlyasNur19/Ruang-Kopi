import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import { dashboardApi } from '../../services/api';

const COLORS = ['#8D6E63', '#D7CCC8'];

const TransactionTypePieChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await dashboardApi.getRevenueByType();
                const byOrderType = result?.byOrderType || [];
                const formatted = [
                    { name: 'Online', value: byOrderType.find((d) => d.name === 'Online')?.value || 0 },
                    { name: 'Walk-in', value: (byOrderType.find((d) => d.name === 'Dine In')?.value || 0) + (byOrderType.find((d) => d.name === 'Take Away')?.value || 0) },
                ];
                setData(formatted);
                setTotal(formatted.reduce((sum, d) => sum + d.value, 0));
            } catch (err) {
                console.error('Failed to fetch revenue by type:', err);
                setError('Gagal memuat data tipe transaksi.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
            return (
                <div className="bg-white border border-[#3E2723]/10 rounded-xl shadow-lg p-3">
                    <p className="text-sm font-semibold" style={{ color: payload[0].color }}>
                        {payload[0].name}: {percentage}%
                    </p>
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

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-sm text-[#6D4C41]">Belum ada transaksi.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-sm font-bold text-[#3E2723] mb-4">Tipe Transaksi</h3>
            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransactionTypePieChart;
