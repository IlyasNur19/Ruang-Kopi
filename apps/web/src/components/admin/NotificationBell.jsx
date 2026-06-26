import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Bell,
    BellOff,
    ShoppingCart,
    Calendar,
    Lightbulb,
    Check,
    Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import useNotificationStore from '../../stores/notificationStore';
import {
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from '../ui/toast';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '../ui/dropdown-menu';

const TOAST_LIMIT = 5;
const TOAST_DISMISS_MS = 5000;

let toastCounter = 0;
function genToastId() {
    toastCounter = (toastCounter + 1) % Number.MAX_SAFE_INTEGER;
    return `notif-toast-${toastCounter}`;
}

/**
 * Maps a notification type to the corresponding admin sidebar tab.
 */
const TAB_MAP = {
    transaction: 'dashboard',
    reservation: 'reservations',
    idea: 'ideas',
};

/**
 * Icon and color config for each notification type.
 */
const TYPE_CONFIG = {
    transaction: {
        icon: ShoppingCart,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-100',
        toastVariant: 'success',
    },
    reservation: {
        icon: Calendar,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        toastVariant: 'default',
    },
    idea: {
        icon: Lightbulb,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-100',
        toastVariant: 'default',
    },
};

const NotificationBell = ({ onNavigate }) => {
    const notifications = useNotificationStore((s) => s.notifications);
    const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
    const markAsRead = useNotificationStore((s) => s.markAsRead);
    const clearAll = useNotificationStore((s) => s.clearAll);

    // Simple inline toast state (avoids importing the broken use-toast.js hook)
    const [toasts, setToasts] = useState([]);
    const toastTimeouts = useRef(new Map());

    const dismissToast = useCallback((toastId) => {
        setToasts((prev) => prev.map((t) => (t.id === toastId ? { ...t, open: false } : t)));
        // Remove from DOM after animation
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== toastId));
        }, 300);
        // Clear the auto-dismiss timer
        if (toastTimeouts.current.has(toastId)) {
            clearTimeout(toastTimeouts.current.get(toastId));
            toastTimeouts.current.delete(toastId);
        }
    }, []);

    const addToast = useCallback(({ title, description, variant }) => {
        const id = genToastId();

        setToasts((prev) => {
            const next = [{ id, title, description, variant, open: true }, ...prev];
            return next.slice(0, TOAST_LIMIT);
        });

        // Auto-dismiss after timeout
        const timeout = setTimeout(() => {
            dismissToast(id);
        }, TOAST_DISMISS_MS);
        toastTimeouts.current.set(id, timeout);
    }, [dismissToast]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            toastTimeouts.current.forEach((timeout) => clearTimeout(timeout));
        };
    }, []);

    // Track which notification IDs have already been toasted
    const toastedRef = useRef(new Set());

    // Fire toast for new unread notifications
    useEffect(() => {
        const unreadNotifications = notifications.filter((n) => !n.read && !toastedRef.current.has(n.id));

        unreadNotifications.forEach((n) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.idea;

            addToast({
                title: n.title,
                description: n.message,
                variant: config.toastVariant,
            });

            toastedRef.current.add(n.id);
        });

        // Clean up old IDs from the ref that are no longer in notifications
        const currentIds = new Set(notifications.map((n) => n.id));
        for (const id of toastedRef.current) {
            if (!currentIds.has(id)) {
                toastedRef.current.delete(id);
            }
        }
    }, [notifications, addToast]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleItemClick = (notification) => {
        markAsRead(notification.id);
        const tab = TAB_MAP[notification.type] || 'dashboard';
        onNavigate?.(tab);
    };

    const handleMarkAllRead = (e) => {
        e.preventDefault();
        markAllAsRead();
    };

    const handleClearAll = (e) => {
        e.preventDefault();
        clearAll();
    };

    const formatTime = (isoString) => {
        try {
            return formatDistanceToNow(new Date(isoString), {
                addSuffix: true,
                locale: id,
            });
        } catch {
            return 'baru saja';
        }
    };

    return (
        <>
            {/* Toast notifications rendered in a local viewport */}
            <ToastViewport>
                {toasts.map((t) => (
                    <Toast key={t.id} variant={t.variant}>
                        <div className="flex-1">
                            {t.title && <ToastTitle>{t.title}</ToastTitle>}
                            {t.description && (
                                <ToastDescription>{t.description}</ToastDescription>
                            )}
                        </div>
                        <ToastClose onClick={() => dismissToast(t.id)} />
                    </Toast>
                ))}
            </ToastViewport>

            {/* Bell Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-background px-1">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-80 max-h-[420px] flex flex-col"
                >
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <DropdownMenuLabel className="text-sm font-semibold p-0">
                            Notifikasi
                        </DropdownMenuLabel>
                        {unreadCount > 0 && (
                            <span className="text-xs text-muted-foreground">
                                {unreadCount} belum dibaca
                            </span>
                        )}
                    </div>

                    <DropdownMenuSeparator />

                    {/* Notification list */}
                    <div className="overflow-y-auto max-h-[300px]">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 px-4 text-muted-foreground">
                                <BellOff size={32} className="mb-2 opacity-40" />
                                <p className="text-sm">Belum ada notifikasi</p>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.idea;
                                const Icon = config.icon;

                                return (
                                    <DropdownMenuItem
                                        key={n.id}
                                        onClick={() => handleItemClick(n)}
                                        className={`flex items-start gap-3 px-2 py-3 cursor-pointer ${!n.read ? 'bg-muted/40' : ''}`}
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-full ${config.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                                        >
                                            <Icon size={16} className={config.iconColor} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-medium truncate">
                                                    {n.title}
                                                </p>
                                                {!n.read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                                                {formatTime(n.createdAt)}
                                            </p>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            <div className="flex items-center justify-between px-1 py-1">
                                <DropdownMenuItem
                                    onClick={handleMarkAllRead}
                                    className="text-xs cursor-pointer flex items-center gap-1.5 flex-1"
                                >
                                    <Check size={14} />
                                    <span>Tandai semua dibaca</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleClearAll}
                                    className="text-xs cursor-pointer flex items-center gap-1.5 text-red-500 hover:text-red-600"
                                >
                                    <Trash2 size={14} />
                                    <span>Hapus semua</span>
                                </DropdownMenuItem>
                            </div>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default NotificationBell;
