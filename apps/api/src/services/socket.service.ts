import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { eq, asc } from 'drizzle-orm';
import { verifyToken } from '../utils/jwt.js';
import { db } from '../db/index.js';
import { meja } from '../db/schema.js';

let io: Server | null = null;

export function initSocketServer(httpServer: HttpServer): Server {
    io = new Server(httpServer, {
        cors: {
            origin: [
                'https://ruang-kopi-web.vercel.app',
                'https://www.ruangkopi.site',
                'https://ruangkopi.site',
                'http://localhost:5173',
                'http://localhost:3000',
            ],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });

    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            socket.data.authenticated = false;
            return next();
        }

        const payload = verifyToken(token);
        if (!payload) {
            socket.data.authenticated = false;
            return next();
        }

        socket.data.authenticated = true;
        socket.data.userId = payload.userId;
        socket.data.role = payload.role;
        next();
    });

    io.on('connection', async (socket: Socket) => {
        console.log(`[Socket.io] Client connected: ${socket.id} (auth: ${socket.data.authenticated})`);

        try {
            const allTables = await db.select().from(meja).orderBy(asc(meja.nomor_meja));
            socket.emit('tables:refresh', allTables);
        } catch (error) {
            console.error('[Socket.io] Error fetching tables for new connection:', error);
        }

        if (socket.data.authenticated) {
            socket.join('pos-room');
        }

        socket.on('table:occupy', async (data: { tableId: number }) => {
            if (!socket.data.authenticated) {
                socket.emit('error', { message: 'Authentication required' });
                return;
            }

            try {
                const { tableId } = data;

                await db.update(meja).set({ status: 'terisi' }).where(eq(meja.id, tableId));

                const [updatedTable] = await db.select().from(meja).where(eq(meja.id, tableId));

                io?.to('pos-room').emit('table:update', {
                    tableId,
                    status: 'terisi',
                    table: updatedTable,
                });
            } catch (error) {
                console.error('[Socket.io] Error occupying table:', error);
                socket.emit('error', { message: 'Failed to occupy table' });
            }
        });

        socket.on('table:release', async (data: { tableId: number }) => {
            if (!socket.data.authenticated) {
                socket.emit('error', { message: 'Authentication required' });
                return;
            }

            try {
                const { tableId } = data;

                await db.update(meja).set({ status: 'tersedia' }).where(eq(meja.id, tableId));

                const [updatedTable] = await db.select().from(meja).where(eq(meja.id, tableId));

                io?.to('pos-room').emit('table:update', {
                    tableId,
                    status: 'tersedia',
                    table: updatedTable,
                });
            } catch (error) {
                console.error('[Socket.io] Error releasing table:', error);
                socket.emit('error', { message: 'Failed to release table' });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`[Socket.io] Client disconnected: ${socket.id} (reason: ${reason})`);
        });
    });

    console.log('[Socket.io] Server initialized');
    return io;
}

export function getIO(): Server | null {
    return io;
}

export async function emitTableUpdate(tableId: number, status: string) {
    if (!io) return;
    const [updatedTable] = await db.select().from(meja).where(eq(meja.id, tableId));
    io.to('pos-room').emit('table:update', { tableId, status, table: updatedTable });
}

export async function emitTablesRefresh() {
    if (!io) return;
    try {
        const allTables = await db.select().from(meja).orderBy(asc(meja.nomor_meja));
        io.to('pos-room').emit('tables:refresh', allTables);
    } catch (error) {
        console.error('[Socket.io] Error refreshing tables:', error);
    }
}

export function emitNewReservation(reservation: any) {
    io?.to('pos-room').emit('new:reservation', reservation);
}

export function emitPaymentConfirmed(data: { tableId?: number; reservationId?: number; orderId: string }) {
    io?.to('pos-room').emit('payment:confirmed', data);
}

export function emitNewTransaction(transaction: any) {
    io?.to('pos-room').emit('new-transaction', transaction);
}

export function emitNewIdea(idea: any) {
    io?.to('pos-room').emit('new:idea', idea);
}
