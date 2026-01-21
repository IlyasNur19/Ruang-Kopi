// API Service for RuangKopi Frontend
const API_BASE_URL = 'http://localhost:3001/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('ruangkopi_token');

// Helper for API requests
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

    // Handle non-JSON responses
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

// ================================
// Auth API
// ================================
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

// ================================
// Menu API
// ================================
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

// ================================
// Categories API
// ================================
export const categoriesApi = {
    getAll: async () => {
        return apiRequest('/categories');
    },
};

// ================================
// Reservations API
// ================================
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
};

// ================================
// Gallery API
// ================================
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
};

// ================================
// Settings API
// ================================
export const settingsApi = {
    getStatus: async () => {
        return apiRequest('/settings/status');
    },
};

// ================================
// Upload API (Cloudinary)
// ================================
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

export default {
    auth: authApi,
    menu: menuApi,
    categories: categoriesApi,
    reservations: reservationsApi,
    gallery: galleryApi,
    settings: settingsApi,
    upload: uploadApi,
};
