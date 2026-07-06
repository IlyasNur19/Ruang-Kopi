import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
    if (amount == null || isNaN(amount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
}

export function formatDateId(date, options = {}) {
    if (!date) return '';
    const defaultOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
    };
    return new Intl.DateTimeFormat('id-ID', defaultOptions).format(new Date(date));
}

export function formatDateShort(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(date));
}

export function formatTime(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export function generateOrderId() {
    const now = new Date();
    const dateStr = formatDateShort(now).replace(/\//g, '');
    const timeStr = now.getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${dateStr}-${timeStr}${random}`;
}

export function calculateTax(amount) {
    return Math.round(amount * 0.11);
}

export function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
