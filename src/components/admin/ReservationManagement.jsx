import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Clock, MessageSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const ReservationManagement = () => {
    // Mock data for reservations
    const reservations = [
        { id: 1, name: 'Budi Santoso', date: '2026-05-20', time: '19:00', guests: 2, status: 'Pending', phone: '08123456789' },
        { id: 2, name: 'Siti Aminah', date: '2026-05-21', time: '13:00', guests: 4, status: 'Confirmed', phone: '08198765432' },
        { id: 3, name: 'John Doe', date: '2026-05-22', time: '20:00', guests: 6, status: 'Completed', phone: '08122334455' },
    ];

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="font-heading text-3xl font-bold text-[#3E2723] mb-2">Reservations</h1>
                <p className="text-muted-foreground">Track and manage table bookings.</p>
            </motion.div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <Table>
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
                                            <Calendar size={14} className="text-muted-foreground" /> {res.date}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                            <Clock size={14} /> {res.time}
                                        </div>
                                    </TableCell>
                                    <TableCell>{res.guests} Orang</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${res.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                            ${res.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                                            ${res.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                        `}>
                                            {res.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800 hover:bg-green-50" title="Confirm">
                                                <Check size={18} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" title="Cancel">
                                                <X size={18} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-[#25D366] hover:text-[#128C7E] hover:bg-green-50" title="WhatsApp">
                                                <MessageSquare size={18} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReservationManagement;
