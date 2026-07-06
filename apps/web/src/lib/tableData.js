const STORAGE_KEY = 'ruangkopi_meja_local';

const SEED_TABLES = [
    { id: '1', nomor_meja: '1', kapasitas: 2, status: 'tersedia' },
    { id: '2', nomor_meja: '2', kapasitas: 2, status: 'tersedia' },
    { id: '3', nomor_meja: '3', kapasitas: 4, status: 'tersedia' },
    { id: '4', nomor_meja: '4', kapasitas: 4, status: 'direservasi' },
    { id: '5', nomor_meja: '5', kapasitas: 6, status: 'terisi' },
    { id: '6', nomor_meja: '6', kapasitas: 6, status: 'tersedia' },
];

export function getLocalTables() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch {  }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TABLES));
    return SEED_TABLES;
}

export function saveLocalTables(tables) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
}

export async function fetchTablesWithFallback(apiFetch) {
    try {
        const data = await apiFetch();
        const list = Array.isArray(data) ? data : data?.data || [];
        if (list.length > 0) {
            return { tables: list, usingLocal: false };
        }
        throw new Error('Empty response');
    } catch (err) {
        console.info('[TableData] API unavailable, using local storage:', err.message);
        return { tables: getLocalTables(), usingLocal: true };
    }
}
