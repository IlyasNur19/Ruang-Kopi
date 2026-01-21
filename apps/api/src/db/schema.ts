import { pgTable, text, integer, serial, boolean, timestamp } from 'drizzle-orm/pg-core';

// Categories table
export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
});

// Menu items table
export const menuItems = pgTable('menu_items', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    price: integer('price').notNull(), // Price in smallest currency unit (e.g., cents/rupiah)
    image: text('image'),
    categoryId: integer('category_id').references(() => categories.id),
    available: boolean('available').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Gallery images table
export const galleryImages = pgTable('gallery_images', {
    id: serial('id').primaryKey(),
    src: text('src').notNull(),
    category: text('category').notNull(),
    span: text('span'), // CSS class for grid span (e.g., 'row-span-2', 'col-span-2')
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Reservations table
export const reservations = pgTable('reservations', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    date: text('date').notNull(), // ISO date string (YYYY-MM-DD)
    time: text('time').notNull(), // Time string (HH:MM)
    guests: integer('guests').notNull(),
    status: text('status').notNull().default('Pending'), // Pending, Confirmed, Completed, Cancelled
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Users table (for admin authentication)
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    role: text('role').notNull().default('admin'), // admin, staff
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Shop settings table
export const shopSettings = pgTable('shop_settings', {
    id: serial('id').primaryKey(),
    key: text('key').notNull().unique(),
    value: text('value').notNull(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Type exports for use in the application
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type NewGalleryImage = typeof galleryImages.$inferInsert;

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ShopSetting = typeof shopSettings.$inferSelect;
export type NewShopSetting = typeof shopSettings.$inferInsert;
