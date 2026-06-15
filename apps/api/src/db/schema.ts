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

// Users table (for admin authentication)
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    role: text('role').notNull().default('admin'), // admin, kasir, pelanggan
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Meja (Tables) table
export const meja = pgTable('meja', {
    id: serial('id').primaryKey(),
    nomor_meja: text('nomor_meja').notNull().unique(),
    kapasitas: integer('kapasitas').notNull().default(4),
    status: text('status').notNull().default('tersedia'), // tersedia, direservasi, terisi
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Reservations table — updated per PRD ERD: links to users and meja
export const reservations = pgTable('reservations', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),      // FK -> users (nullable, for guest checkout)
    mejaId: integer('meja_id').references(() => meja.id),        // FK -> meja (selected table)
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    date: text('date').notNull(),                                 // ISO date string (YYYY-MM-DD)
    time: text('time').notNull(),                                 // Time string (HH:MM)
    guests: integer('guests').notNull(),
    status: text('status').notNull().default('pending'),          // pending, dibayar, batal, selesai
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Transaksi (Transactions) table — updated per PRD ERD: links to reservations
export const transaksi = pgTable('transaksi', {
    id: serial('id').primaryKey(),
    orderId: text('order_id').notNull().unique(),
    reservasiId: integer('reservasi_id').references(() => reservations.id), // FK -> reservations (nullable, for online orders)
    mejaId: integer('meja_id').references(() => meja.id),                    // FK -> meja
    userId: integer('user_id').references(() => users.id),                   // FK -> users (kasir who processed)
    customerName: text('customer_name'),
    tipePesanan: text('tipe_pesanan').notNull().default('dine_in'),          // online | dine_in | take_away
    paymentMethod: text('payment_method').notNull().default('cash'),         // cash | qris
    subtotal: integer('subtotal').notNull(),
    tax: integer('tax').notNull().default(0),
    total: integer('total').notNull(),
    amountPaid: integer('amount_paid').notNull(),
    change: integer('change').notNull().default(0),
    status: text('status').notNull().default('completed'),                   // completed | cancelled
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Detail Transaksi (Transaction Items) table
export const detailTransaksi = pgTable('detail_transaksi', {
    id: serial('id').primaryKey(),
    transaksiId: integer('transaksi_id').references(() => transaksi.id, { onDelete: 'cascade' }),
    menuId: integer('menu_id').references(() => menuItems.id),
    namaMenu: text('nama_menu').notNull(),
    qty: integer('qty').notNull(),
    harga: integer('harga').notNull(),
    subtotal: integer('subtotal').notNull(),
});

// Payment Gateway table — per PRD ERD: tracks Midtrans payment status
export const paymentGateway = pgTable('payment_gateway', {
    id: serial('id').primaryKey(),
    transaksiId: integer('transaksi_id').references(() => transaksi.id),
    reservasiId: integer('reservasi_id').references(() => reservations.id),
    orderIdMidtrans: text('order_id_midtrans').notNull().unique(),   // Unique order ID sent to Midtrans
    metodePembayaran: text('metode_pembayaran'),                      // e.g., qris, bank_transfer, cstore
    statusPembayaran: text('status_pembayaran').notNull().default('pending'), // pending, settlement, expire, cancel
    waktuDibayar: timestamp('waktu_dibayar'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Shop settings table
export const shopSettings = pgTable('shop_settings', {
    id: serial('id').primaryKey(),
    key: text('key').notNull().unique(),
    value: text('value').notNull(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Ideas/Feedback table (Kotak Gagasan)
export const ideas = pgTable('ideas', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    contact: text('contact'), // Email or Instagram (optional)
    topic: text('topic').notNull(), // Soal Rasa, Suasana Ruang, Pelayanan, Ide Baru
    message: text('message').notNull(),
    status: text('status').notNull().default('Baru'), // Baru, Dibaca, Diproses, Selesai
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Type exports for use in the application
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type NewGalleryImage = typeof galleryImages.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Meja = typeof meja.$inferSelect;
export type NewMeja = typeof meja.$inferInsert;

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;

export type Transaksi = typeof transaksi.$inferSelect;
export type NewTransaksi = typeof transaksi.$inferInsert;

export type DetailTransaksi = typeof detailTransaksi.$inferSelect;
export type NewDetailTransaksi = typeof detailTransaksi.$inferInsert;

export type PaymentGateway = typeof paymentGateway.$inferSelect;
export type NewPaymentGateway = typeof paymentGateway.$inferInsert;

export type ShopSetting = typeof shopSettings.$inferSelect;
export type NewShopSetting = typeof shopSettings.$inferInsert;

export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;
