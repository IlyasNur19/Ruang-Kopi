const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthToken = () => localStorage.getItem('ruangkopi_token');

const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        return null;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Something went wrong');
    }

    return data;
};

export const authApi = {
    login: async (email, password) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    getMe: async () => {
        return apiRequest('/auth/me');
    },
};

export const menuApi = {
    getAll: async () => {
        return apiRequest('/menu');
    },

    getById: async (id) => {
        return apiRequest(`/menu/${id}`);
    },

    create: async (data) => {
        return apiRequest('/menu', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id, data) => {
        return apiRequest(`/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id) => {
        return apiRequest(`/menu/${id}`, {
            method: 'DELETE',
        });
    },
};

export const categoriesApi = {
    getAll: async () => {
        return apiRequest('/categories');
    },
};

export const reservationsApi = {
    getAll: async () => {
        return apiRequest('/reservations');
    },

    getById: async (id) => {
        return apiRequest(`/reservations/${id}`);
    },

    create: async (data) => {
        return apiRequest('/reservations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateStatus: async (id, status) => {
        return apiRequest(`/reservations/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    delete: async (id) => {
        return apiRequest(`/reservations/${id}`, {
            method: 'DELETE',
        });
    },

    getAvailableTables: async (date, time) => {
        return apiRequest(`/reservations/available-tables?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
    },
};

export const galleryApi = {
    getAll: async () => {
        return apiRequest('/gallery');
    },

    create: async (data) => {
        return apiRequest('/gallery', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id, data) => {
        return apiRequest(`/gallery/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id) => {
        return apiRequest(`/gallery/${id}`, {
            method: 'DELETE',
        });
    },

    reorder: async (images) => {
        return apiRequest('/gallery/reorder', {
            method: 'PUT',
            body: JSON.stringify({ images }),
        });
    },
};

export const settingsApi = {
    getStatus: async () => {
        return apiRequest('/settings/status');
    },

    updateStatus: async (status) => {
        return apiRequest('/settings/status', {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    getSpaceImages: async () => {
        return apiRequest('/settings/space-images');
    },

    updateSpaceImages: async (images) => {
        return apiRequest('/settings/space-images', {
            method: 'PUT',
            body: JSON.stringify({ images }),
        });
    },

    getHeroImage: async () => {
        return apiRequest('/settings/hero-image');
    },

    updateHeroImage: async (heroImage) => {
        return apiRequest('/settings/hero-image', {
            method: 'PUT',
            body: JSON.stringify({ heroImage }),
        });
    },
};

export const uploadApi = {
    upload: async (file) => {
        const token = getAuthToken();
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        return data;
    },

    delete: async (publicId) => {
        return apiRequest(`/upload/${encodeURIComponent(publicId)}`, {
            method: 'DELETE',
        });
    },
};

export const ideasApi = {
    getAll: async () => {
        return apiRequest('/ideas');
    },

    create: async (data) => {
        return apiRequest('/ideas', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateStatus: async (id, status) => {
        return apiRequest(`/ideas/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    delete: async (id) => {
        return apiRequest(`/ideas/${id}`, {
            method: 'DELETE',
        });
    },
};

export const mejaApi = {
    getAll: async () => {
        return apiRequest('/meja');
    },

    getById: async (id) => {
        return apiRequest(`/meja/${id}`);
    },

    create: async (data) => {
        return apiRequest('/meja', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id, data) => {
        return apiRequest(`/meja/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id) => {
        return apiRequest(`/meja/${id}`, {
            method: 'DELETE',
        });
    },

    getStatus: async (params) => {
        const query = params ? `?${new URLSearchParams(params)}` : '';
        return apiRequest(`/meja/status${query}`);
    },
};

export const transaksiApi = {
    getAll: async (params) => {
        const query = params ? `?${new URLSearchParams(params)}` : '';
        return apiRequest(`/transaksi${query}`);
    },

    getById: async (id) => {
        return apiRequest(`/transaksi/${id}`);
    },

    create: async (data) => {
        return apiRequest('/transaksi', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getSummary: async (params) => {
        const query = params ? `?${new URLSearchParams(params)}` : '';
        return apiRequest(`/transaksi/summary${query}`);
    },

    getRecent: async (limit = 10) => {
        return apiRequest(`/transaksi/recent?limit=${limit}`);
    },
};

export const paymentApi = {
    getSnapToken: async (data) => {
        return apiRequest('/payment/snap-token', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getStatus: async (orderId) => {
        return apiRequest(`/payment/status/${orderId}`);
    },

    handleNotification: async (data) => {
        return apiRequest('/payment/notification', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

export const dashboardApi = {
    getStats: async () => {
        return apiRequest('/dashboard/stats');
    },

    getRevenueDaily: async (params) => {
        const query = params ? `?${new URLSearchParams(params)}` : '';
        return apiRequest(`/dashboard/revenue-daily${query}`);
    },

    getRevenueByType: async (params) => {
        const query = params ? `?${new URLSearchParams(params)}` : '';
        return apiRequest(`/dashboard/revenue-by-type${query}`);
    },

    getRecentTransactions: async (limit = 10) => {
        return apiRequest(`/dashboard/recent-transactions?limit=${limit}`);
    },
};

export default {
    auth: authApi,
    menu: menuApi,
    categories: categoriesApi,
    reservations: reservationsApi,
    gallery: galleryApi,
    settings: settingsApi,
    upload: uploadApi,
    ideas: ideasApi,
    meja: mejaApi,
    transaksi: transaksiApi,
    payment: paymentApi,
    dashboard: dashboardApi,
};
