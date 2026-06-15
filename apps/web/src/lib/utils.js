import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke format mata uang Rupiah
 * @param {number} amount - Jumlah uang
 * @returns {string} Format Rupiah (contoh: "Rp 50.000")
 */
export function formatCurrency(amount) {
    if (amount == null || isNaN(amount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
}

/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date - Tanggal
 * @param {Object} options - Opsi tambahan untuk Intl.DateTimeFormat
 * @returns {string} Format tanggal Indonesia (contoh: "15 Juni 2026")
 */
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

/**
 * Format tanggal pendek Indonesia
 * @param {string|Date} date - Tanggal
 * @returns {string} Format tanggal pendek (contoh: "15/06/2026")
 */
export function formatDateShort(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(date));
}

/**
 * Format waktu
 * @param {string|Date} date - Waktu
 * @returns {string} Format waktu (contoh: "14:30")
 */
export function formatTime(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

/**
 * Generate order ID untuk transaksi
 * @returns {string} Order ID unik
 */
export function generateOrderId() {
    const now = new Date();
    const dateStr = formatDateShort(now).replace(/\//g, '');
    const timeStr = now.getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${dateStr}-${timeStr}${random}`;
}

/**
 * Hitung PPN 11%
 * @param {number} amount - Jumlah
 * @returns {number} PPN
 */
export function calculateTax(amount) {
    return Math.round(amount * 0.11);
}

/**
 * Debounce helper
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
