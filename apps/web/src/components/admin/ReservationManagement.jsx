import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Check, X, Clock, MessageSquare, Loader2, RefreshCw, Filter, User, Users, Phone, ChevronDown } from 'lucide-react';
import { reservationsApi } from '../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const ReservationManagement = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null);

    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [customDate, setCustomDate] = useState('');

    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await reservationsApi.getAll();
            setReservations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching reservations:', err);
            setError('Failed to load reservations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const statusLabels = {
        pending: 'Pending',
        dibayar: 'Dikonfirmasi',
        batal: 'Dibatalkan',
        selesai: 'Selesai',
    };

    const getStatusLabel = (status) => statusLabels[status] || status;

    const filteredReservations = useMemo(() => {
        let result = [...reservations];

        if (statusFilter !== 'all') {
            result = result.filter(res => res.status === statusFilter);
        }

        if (dateFilter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            result = result.filter(res => res.date === today);
        } else if (dateFilter === 'week') {
            const today = new Date();
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            result = result.filter(res => {
                const resDate = new Date(res.date);
                return resDate >= today && resDate <= weekFromNow;
            });
        } else if (dateFilter === 'custom' && customDate) {
            result = result.filter(res => res.date === customDate);
        }

        result.sort((a, b) => new Date(b.date) - new Date(a.date));

        return result;
    }, [reservations, statusFilter, dateFilter, customDate]);

    const updateStatus = async (id, status) => {
        try {
            setUpdating(id);
            await reservationsApi.updateStatus(id, status);

            setReservations(reservations.map(res =>
                res.id === id ? { ...res, status } : res
            ));

            if (selectedReservation?.id === id) {
                setSelectedReservation(prev => ({ ...prev, status }));
            }
        } catch (err) {
            console.error('Error updating reservation:', err);
            alert('Failed to update reservation. Please try again.');
        } finally {
            setUpdating(null);
        }
    };

    const openWhatsApp = (phone, name, date, time) => {
        const formattedDate = formatDate(date);
        const message = encodeURIComponent(
            `Halo ${name}, kami dari RuangKopi ingin mengkonfirmasi reservasi Anda pada tanggal ${formattedDate} jam ${time}. Terima kasih!`
        );
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.substring(1);
        }
        window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    };

    const openDetailModal = (reservation) => {
        setSelectedReservation(reservation);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedReservation(null);
    };

    const getStatusBadge = (status) => {
        const styles = {
            dibayar: 'bg-green-50 text-green-700 border-green-200',
            pending: 'bg-orange-50 text-orange-700 border-orange-200',
            selesai: 'bg-blue-50 text-blue-700 border-blue-200',
            batal: 'bg-red-50 text-red-700 border-red-200',
        };
        return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const formatShortDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const statusOptions = [
        { value: 'all', label: 'Semua' },
        { value: 'pending', label: 'Pending' },
        { value: 'dibayar', label: 'Dikonfirmasi' },
        { value: 'selesai', label: 'Selesai' },
        { value: 'batal', label: 'Dibatalkan' },
    ];
    const dateOptions = [
        { value: 'all', label: 'Semua Tanggal' },
        { value: 'today', label: 'Hari Ini' },
        { value: 'week', label: 'Minggu Ini' },
        { value: 'custom', label: 'Pilih Tanggal' },
    ];

    const DetailModal = () => {
        if (!selectedReservation) return null;

        const res = selectedReservation;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={closeDetailModal}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
                    onClick={e => e.stopPropagation()}
                >
                    {}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading text-xl font-bold text-[#3E2723]">Detail Reservasi</h3>
                        <button
                            onClick={closeDetailModal}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-[#3E2723] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {res.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-[#3E2723]">{res.name}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Phone size={14} /> {res.phone}
                                </p>
                            </div>
                        </div>

                        {}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Tanggal</p>
                                <p className="font-medium text-[#3E2723] flex items-center gap-2">
                                    <Calendar size={16} /> {formatShortDate(res.date)}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Jam</p>
                                <p className="font-medium text-[#3E2723] flex items-center gap-2">
                                    <Clock size={16} /> {res.time}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Jumlah Tamu</p>
                                <p className="font-medium text-[#3E2723] flex items-center gap-2">
                                    <Users size={16} /> {res.guests} Orang
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Status Saat Ini</p>
                                <Badge variant="outline" className={getStatusBadge(res.status)}>
                                    {getStatusLabel(res.status)}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-[#3E2723] mb-2">Update Status</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[{ value: 'pending', label: 'Pending' }, { value: 'dibayar', label: 'Konfirmasi' }, { value: 'selesai', label: 'Selesai' }, { value: 'batal', label: 'Batalkan' }].map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => updateStatus(res.id, value)}
                                    disabled={updating === res.id || res.status === value}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                                        ${res.status === value
                                            ? 'bg-[#3E2723] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                                        ${updating === res.id ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {updating === res.id ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : res.status === value ? (
                                        <Check size={14} />
                                    ) : null}
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="flex gap-3">
                        <Button
                            className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white"
                            onClick={() => openWhatsApp(res.phone, res.name, res.date, res.time)}
                        >
                            <MessageSquare size={18} className="mr-2" />
                            Hubungi via WhatsApp
                        </Button>
                        <Button variant="outline" onClick={closeDetailModal}>
                            Tutup
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#3E2723]" />
                    <p className="text-muted-foreground">Loading reservations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
                <div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#3E2723] mb-2">Reservations</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Track and manage table bookings.</p>
                </div>
                <Button variant="outline" onClick={fetchReservations} disabled={loading}>
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </Button>
            </motion.div>

            {}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border shadow-sm"
            >
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-[#3E2723]">Filter:</span>
                </div>

                {}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Status:</span>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3E2723]/20"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                {}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Tanggal:</span>
                    <div className="relative">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3E2723]/20"
                        >
                            {dateOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                {}
                {dateFilter === 'custom' && (
                    <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E2723]/20"
                    />
                )}

                {}
                <div className="ml-auto">
                    <Badge variant="outline" className="bg-gray-50">
                        {filteredReservations.length} reservasi
                    </Badge>
                </div>
            </motion.div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[650px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>GUEST</TableHead>
                                    <TableHead>DATE & TIME</TableHead>
                                    <TableHead>PAX</TableHead>
                                    <TableHead>STATUS</TableHead>
                                    <TableHead className="text-right">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReservations.map(res => (
                                    <TableRow
                                        key={res.id}
                                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => openDetailModal(res)}
                                    >
                                        <TableCell>
                                            <div className="font-semibold text-[#3E2723]">{res.name}</div>
                                            <div className="text-xs text-muted-foreground">{res.phone}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={14} className="text-muted-foreground" />
                                                {formatShortDate(res.date)}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <Clock size={14} /> {res.time}
                                            </div>
                                        </TableCell>
                                        <TableCell>{res.guests} Orang</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusBadge(res.status)}>
                                                {getStatusLabel(res.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                {res.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-green-600 hover:text-green-800 hover:bg-green-50"
                                                            title="Konfirmasi"
                                                            onClick={() => updateStatus(res.id, 'dibayar')}
                                                            disabled={updating === res.id}
                                                        >
                                                            {updating === res.id ? (
                                                                <Loader2 size={18} className="animate-spin" />
                                                            ) : (
                                                                <Check size={18} />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            title="Batalkan"
                                                            onClick={() => updateStatus(res.id, 'batal')}
                                                            disabled={updating === res.id}
                                                        >
                                                            <X size={18} />
                                                        </Button>
                                                    </>
                                                )}
                                                {res.status === 'dibayar' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                        title="Selesaikan"
                                                        onClick={() => updateStatus(res.id, 'selesai')}
                                                        disabled={updating === res.id}
                                                    >
                                                        {updating === res.id ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : (
                                                            <Check size={18} />
                                                        )}
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-[#25D366] hover:text-[#128C7E] hover:bg-green-50"
                                                    title="Send WhatsApp"
                                                    onClick={() => openWhatsApp(res.phone, res.name, res.date, res.time)}
                                                >
                                                    <MessageSquare size={18} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredReservations.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            {reservations.length === 0
                                ? 'No reservations found.'
                                : 'No reservations match the current filters.'
                            }
                        </div>
                    )}
                </CardContent>
            </Card>

            {}
            <AnimatePresence>
                {showDetailModal && <DetailModal />}
            </AnimatePresence>
        </div>
    );
};

export default ReservationManagement;
