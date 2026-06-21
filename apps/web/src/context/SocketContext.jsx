import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import useTableStore from '../stores/tableStore';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function SocketProvider({ children }) {
    const [isConnected, setIsConnected] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const socketRef = useRef(null);
    const updateTableStatus = useTableStore((s) => s.updateTableStatus);
    const setTables = useTableStore((s) => s.setTables);

    const connect = useCallback(() => {
        const token = localStorage.getItem('ruangkopi_token');

        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
            timeout: 20000,
        });

        socket.on('connect', () => {
            console.log('[Socket] Connected:', socket.id);
            setIsConnected(true);
            setIsReconnecting(false);
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
            setIsConnected(false);
            if (reason === 'io server disconnect' || reason === 'transport close') {
                setIsReconnecting(true);
            }
        });

        socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error.message);
            setIsReconnecting(true);
        });

        socket.on('reconnect_attempt', () => {
            setIsReconnecting(true);
        });

        socket.on('reconnect', () => {
            console.log('[Socket] Reconnected');
            setIsReconnecting(false);
            setIsConnected(true);
        });

        // ========== Application Events ==========

        // Table status updated by another client or server
        socket.on('table:update', (data) => {
            const { tableId, status } = data;
            if (tableId && status) {
                updateTableStatus(tableId, status);
            }
        });

        // All tables status (initial load or full refresh)
        socket.on('tables:refresh', (tables) => {
            if (Array.isArray(tables)) {
                setTables(tables);
            }
        });

        // New reservation created online
        socket.on('new:reservation', (reservation) => {
            console.log('[Socket] New reservation:', reservation);
            // Admin can listen for this to update dashboard
        });

        // Payment confirmed via webhook
        socket.on('payment:confirmed', (data) => {
            console.log('[Socket] Payment confirmed:', data);
            if (data.tableId) {
                updateTableStatus(data.tableId, 'direservasi');
            }
        });

        socketRef.current = socket;

        return socket;
    }, [updateTableStatus, setTables]);

    useEffect(() => {
        const socket = connect();

        return () => {
            if (socket) {
                socket.disconnect();
            }
            socketRef.current = null;
        };
    }, [connect]);

    /**
     * Emit event: kasir occupies a table for walk-in
     */
    const occupyTable = useCallback((tableId) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('table:occupy', { tableId });
            updateTableStatus(tableId, 'terisi');
        }
    }, [updateTableStatus]);

    /**
     * Emit event: kasir releases a table (walk-in done/cancelled)
     */
    const releaseTable = useCallback((tableId) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('table:release', { tableId });
            updateTableStatus(tableId, 'tersedia');
        }
    }, [updateTableStatus]);

    const value = {
        socket: socketRef.current,
        isConnected,
        isReconnecting,
        occupyTable,
        releaseTable,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}

export default SocketContext;
