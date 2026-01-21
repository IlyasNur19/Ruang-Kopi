// ================================
// API Response Types
// ================================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ================================
// Menu Types
// ================================
export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    isAvailable: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type MenuCategory = 'coffee' | 'non-coffee' | 'food' | 'dessert';

export interface CreateMenuItemDto {
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    isAvailable?: boolean;
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> { }

// ================================
// Gallery Types
// ================================
export interface GalleryItem {
    id: number;
    title: string;
    imageUrl: string;
    category: string;
    createdAt?: Date;
}

export type GalleryCategory = 'interior' | 'food' | 'drinks' | 'events';

export interface CreateGalleryItemDto {
    title: string;
    imageUrl: string;
    category: string;
}

// ================================
// Reservation Types
// ================================
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
    id: number;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    notes?: string;
    status: ReservationStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateReservationDto {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    notes?: string;
}

export interface UpdateReservationDto extends Partial<CreateReservationDto> {
    status?: ReservationStatus;
}

// ================================
// Shop Settings Types
// ================================
export interface SocialMedia {
    instagram?: string;
    facebook?: string;
    twitter?: string;
}

export interface ShopSettings {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    openingHours: string;
    socialMedia?: SocialMedia;
    updatedAt?: Date;
}

export interface UpdateShopSettingsDto {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    openingHours?: string;
    socialMedia?: SocialMedia;
}

// ================================
// Auth Types
// ================================
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'staff';
    createdAt?: Date;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: Omit<User, 'createdAt'>;
    token: string;
}

// ================================
// Utility Types
// ================================
export type WithTimestamps<T> = T & {
    createdAt: Date;
    updatedAt: Date;
};
