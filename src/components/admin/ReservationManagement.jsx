import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Clock, MessageSquare } from 'lucide-react';

const ReservationManagement = () => {
    // Mock data for reservations
    const reservations = [
        { id: 1, name: 'Budi Santoso', date: '2026-05-20', time: '19:00', guests: 2, status: 'Pending', phone: '08123456789' },
        { id: 2, name: 'Siti Aminah', date: '2026-05-21', time: '13:00', guests: 4, status: 'Confirmed', phone: '08198765432' },
        { id: 3, name: 'John Doe', date: '2026-05-22', time: '20:00', guests: 6, status: 'Completed', phone: '08122334455' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return '#4CAF50';
            case 'Pending': return '#FF9800';
            case 'Completed': return '#2196F3';
            default: return '#999';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'Confirmed': return '#E8F5E9';
            case 'Pending': return '#FFF3E0';
            case 'Completed': return '#E3F2FD';
            default: return '#f5f5f5';
        }
    };

    return (
        <div className="reservation-management">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="content-header"
            >
                <h1>Reservations</h1>
                <p>Track and manage table bookings.</p>
            </motion.div>

            <div className="dashboard-card">
                <table className="menu-table">
                    <thead>
                        <tr>
                            <th>GUEST</th>
                            <th>DATE & TIME</th>
                            <th>PAX</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(res => (
                            <tr key={res.id}>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#3E2723' }}>{res.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{res.phone}</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} /> {res.date}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', color: '#888', fontSize: '0.8rem' }}>
                                        <Clock size={14} /> {res.time}
                                    </div>
                                </td>
                                <td>{res.guests} Orang</td>
                                <td>
                                    <span className="badge" style={{ backgroundColor: getStatusBg(res.status), color: getStatusColor(res.status) }}>
                                        {res.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions">
                                        <button className="btn-icon" style={{ color: '#4CAF50' }} title="Confirm"><Check size={18} /></button>
                                        <button className="btn-icon" style={{ color: '#EF5350' }} title="Cancel"><X size={18} /></button>
                                        <button className="btn-icon" style={{ color: '#25D366' }} title="WhatsApp"><MessageSquare size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservationManagement;
