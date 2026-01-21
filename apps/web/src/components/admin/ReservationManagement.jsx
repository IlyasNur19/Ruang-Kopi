import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Clock, MessageSquare, Loader2, RefreshCw } from 'lucide-react';
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

    const updateStatus = async (id, status) => {
        try {
            setUpdating(id);
            await reservationsApi.updateStatus(id, status);

            // Update local state
            setReservations(reservations.map(res =>
                res.id === id ? { ...res, status } : res
            ));
        } catch (err) {
            console.error('Error updating reservation:', err);
            alert('Failed to update reservation. Please try again.');
        } finally {
            setUpdating(null);
        }
    };

    const handleConfirm = (id) => updateStatus(id, 'Confirmed');
    const handleCancel = (id) => updateStatus(id, 'Cancelled');
    const handleComplete = (id) => updateStatus(id, 'Completed');

    const openWhatsApp = (phone, name, date, time) => {
        const message = encodeURIComponent(
            `Halo ${name}, kami dari RuangKopi ingin mengkonfirmasi reservasi Anda pada tanggal ${date} jam ${time}. Terima kasih!`
        );
        // Clean phone number and ensure it starts with country code
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.substring(1);
        }
        window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    };

    const getStatusBadge = (status) => {
        const styles = {
            Confirmed: 'bg-green-50 text-green-700 border-green-200',
            Pending: 'bg-orange-50 text-orange-700 border-orange-200',
            Completed: 'bg-blue-50 text-blue-700 border-blue-200',
            Cancelled: 'bg-red-50 text-red-700 border-red-200',
        };
        return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('id-ID', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateStr;
        }
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
                                {reservations.map(res => (
                                    <TableRow key={res.id}>
                                        <TableCell>
                                            <div className="font-semibold text-[#3E2723]">{res.name}</div>
                                            <div className="text-xs text-muted-foreground">{res.phone}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={14} className="text-muted-foreground" />
                                                {formatDate(res.date)}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <Clock size={14} /> {res.time}
                                            </div>
                                        </TableCell>
                                        <TableCell>{res.guests} Orang</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusBadge(res.status)}>
                                                {res.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {res.status === 'Pending' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-green-600 hover:text-green-800 hover:bg-green-50"
                                                            title="Confirm"
                                                            onClick={() => handleConfirm(res.id)}
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
                                                            title="Cancel"
                                                            onClick={() => handleCancel(res.id)}
                                                            disabled={updating === res.id}
                                                        >
                                                            <X size={18} />
                                                        </Button>
                                                    </>
                                                )}
                                                {res.status === 'Confirmed' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                        title="Mark as Completed"
                                                        onClick={() => handleComplete(res.id)}
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

                    {reservations.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No reservations found.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ReservationManagement;
