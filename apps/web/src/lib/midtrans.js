const SNAP_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';
const SNAP_PRODUCTION_URL = 'https://app.midtrans.com/snap/snap.js';

let snapLoaded = false;
let snapLoadPromise = null;

export function loadSnapScript() {

    if (snapLoadPromise) return snapLoadPromise;

    if (typeof window !== 'undefined' && window.snap) {
        snapLoaded = true;
        snapLoadPromise = Promise.resolve();
        return snapLoadPromise;
    }

    snapLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const isProduction = import.meta.env.VITE_MIDTRANS_ENV === 'production';
        script.src = isProduction ? SNAP_PRODUCTION_URL : SNAP_SANDBOX_URL;
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
        script.async = true;

        script.onload = () => {
            snapLoaded = true;
            resolve();
        };

        script.onerror = () => {
            snapLoadPromise = null;
            reject(new Error('Gagal memuat Midtrans Snap. Silakan coba lagi.'));
        };

        document.head.appendChild(script);
    });

    return snapLoadPromise;
}

export function isSnapReady() {
    return snapLoaded && typeof window !== 'undefined' && window.snap;
}

export function openSnapPopup(snapToken, callbacks = {}) {
    const {
        onSuccess = () => {},
        onPending = () => {},
        onError = () => {},
        onClose = () => {},
    } = callbacks;

    if (!isSnapReady()) {
        onError(new Error('Midtrans Snap belum siap. Silakan muat ulang halaman.'));
        return;
    }

    window.snap.pay(snapToken, {
        onSuccess: function (result) {
            console.log('[Midtrans] Payment success:', result);
            onSuccess(result);
        },
        onPending: function (result) {
            console.log('[Midtrans] Payment pending:', result);
            onPending(result);
        },
        onError: function (result) {
            console.error('[Midtrans] Payment error:', result);
            onError(result);
        },
        onClose: function () {
            console.log('[Midtrans] Popup closed');
            onClose();
        },
    });
}

export default {
    loadSnapScript,
    isSnapReady,
    openSnapPopup,
};
