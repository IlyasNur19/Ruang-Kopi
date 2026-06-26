import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, ShoppingBag, Globe } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { dashboardApi } from '../../services/api';
import { formatCurrency, formatDateShort, formatTime } from '../../lib/utils';

const RecentTransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await dashboardApi.getRecentTransactions(10);
                setTransactions(Array.isArray(result) ? result : result?.data || []);
            } catch (err) {
                console.error('Failed to fetch recent transactions:', err);
                setError('Gagal memuat transaksi terbaru.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-[#8D6E63]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle size={24} className="text-red-400 mb-2" />
                <p className="text-sm text-[#6D4C41]">{error}</p>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-[#6D4C41]">Belum ada transaksi.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-sm font-bold text-[#3E2723] mb-4">Transaksi Terbaru</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs">Waktu</TableHead>
                        <TableHead className="text-xs">Tipe</TableHead>
                        <TableHead className="text-xs text-right">Jumlah</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                            <TableCell className="text-xs">
                                <div>{formatDateShort(tx.createdAt)}</div>
                                <div className="text-[#6D4C41]/60">{formatTime(tx.createdAt)}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    {tx.tipePesanan === 'online' ? (
                                        <Globe size={12} className="text-blue-500" />
                                    ) : (
                                        <ShoppingBag size={12} className="text-amber-500" />
                                    )}
                                    <span className="text-xs capitalize">
                                        {tx.tipePesanan === 'online' ? 'Online' : 'Walk-in'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right text-xs font-semibold">
                                {formatCurrency(tx.total)}
                            </TableCell>
                            <TableCell>
                                <Badge variant={tx.status === 'completed' || tx.status === 'selesai' ? 'success' : 'default'} className="text-[10px]">
                                    {tx.status === 'completed' || tx.status === 'selesai' ? 'Selesai' : tx.status || 'Pending'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default RecentTransactionsTable;
