import React, { useState, useEffect } from 'react';
import { Download, Search, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

const TransactionHistory = () => {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tipePesanan, setTipePesanan] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append('startDate', startDate);
            if (endDate) queryParams.append('endDate', endDate);
            if (tipePesanan) queryParams.append('tipePesanan', tipePesanan);

            const response = await fetch(`/api/transaksi?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchTransactions();
    };

    const handleExportCSV = () => {
        if (transactions.length === 0) {
            alert('Tidak ada data untuk diekspor');
            return;
        }

        const headers = ['Order ID', 'Tanggal', 'Tipe Pesanan', 'Metode Bayar', 'Subtotal', 'Pajak', 'HPP', 'Total', 'Laba Bersih', 'Item Terjual'];
        
        const csvRows = [];
        csvRows.push(headers.join(','));

        transactions.forEach(t => {
            const date = new Date(t.createdAt).toLocaleString('id-ID');
            const itemsStr = (t.items || []).map(i => `${i.qty}x ${i.namaMenu}`).join(' | ');
            const labaBersih = t.total - (t.totalHpp || 0);
            
            const row = [
                t.orderId,
                `"${date}"`,
                t.tipePesanan,
                t.paymentMethod,
                t.subtotal,
                t.tax,
                t.totalHpp || 0,
                t.total,
                labaBersih,
                `"${itemsStr}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        
        const fileName = startDate && endDate 
            ? `laporan_transaksi_${startDate}_sampai_${endDate}.csv` 
            : `laporan_transaksi_semua.csv`;
            
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Riwayat Transaksi</h1>
                <p className="text-muted-foreground mt-2">
                    Laporan lengkap histori penjualan dan keuntungan (Khusus Super Admin).
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filter & Ekspor</CardTitle>
                    <CardDescription>Cari berdasarkan tanggal untuk laporan periode tertentu.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Tanggal Mulai</label>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="border rounded-md px-3 py-2 text-sm bg-background"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Tanggal Selesai</label>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="border rounded-md px-3 py-2 text-sm bg-background"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Tipe Pesanan</label>
                            <select 
                                value={tipePesanan}
                                onChange={e => setTipePesanan(e.target.value)}
                                className="border rounded-md px-3 py-2 text-sm bg-background"
                            >
                                <option value="">Semua Tipe</option>
                                <option value="dine_in">Dine In</option>
                                <option value="take_away">Take Away</option>
                                <option value="online">Online</option>
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2 text-sm font-medium"
                        >
                            <Filter size={16} /> Filter Data
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={handleExportCSV}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 text-sm font-medium ml-auto"
                        >
                            <Download size={16} /> Ekspor CSV
                        </button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground border-b uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Order ID / Tanggal</th>
                                    <th className="px-4 py-3">Tipe / Bayar</th>
                                    <th className="px-4 py-3 text-right">Pendapatan</th>
                                    <th className="px-4 py-3 text-right text-red-600">Total HPP</th>
                                    <th className="px-4 py-3 text-right text-green-600">Laba Bersih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-t-0">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-muted-foreground">Memuat data...</td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-muted-foreground">Tidak ada riwayat transaksi ditemukan.</td>
                                    </tr>
                                ) : (
                                    transactions.map(t => {
                                        const laba = t.total - (t.totalHpp || 0);
                                        return (
                                            <tr key={t.id} className="hover:bg-muted/50 border-t">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-primary">{t.orderId}</div>
                                                    <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString('id-ID')}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="capitalize">{t.tipePesanan.replace('_', ' ')}</div>
                                                    <div className="text-xs text-muted-foreground uppercase">{t.paymentMethod}</div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium">{formatCurrency(t.total)}</td>
                                                <td className="px-4 py-3 text-right text-red-600">{formatCurrency(t.totalHpp || 0)}</td>
                                                <td className="px-4 py-3 text-right text-green-600 font-bold">{formatCurrency(laba)}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionHistory;
