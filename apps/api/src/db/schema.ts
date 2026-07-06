import { pgTable, text, integer, serial, boolean, timestamp } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
});

export const menuItems = pgTable('menu_items', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    price: integer('price').notNull(),
    image: text('image'),
    categoryId: integer('category_id').references(() => categories.id),
    available: boolean('available').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const galleryImages = pgTable('gallery_images', {
    id: serial('id').primaryKey(),
    src: text('src').notNull(),
    category: text('category').notNull(),
    span: text('span'),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    role: text('role').notNull().default('admin'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const meja = pgTable('meja', {
    id: serial('id').primaryKey(),
    nomor_meja: text('nomor_meja').notNull().unique(),
    kapasitas: integer('kapasitas').notNull().default(4),
    status: text('status').notNull().default('tersedia'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reservations = pgTable('reservations', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    mejaId: integer('meja_id').references(() => meja.id),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    date: text('date').notNull(),
    time: text('time').notNull(),
    guests: integer('guests').notNull(),
    status: text('status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const transaksi = pgTable('transaksi', {
    id: serial('id').primaryKey(),
    orderId: text('order_id').notNull().unique(),
    reservasiId: integer('reservasi_id').references(() => reservations.id),
    mejaId: integer('meja_id').references(() => meja.id),
    userId: integer('user_id').references(() => users.id),
    customerName: text('customer_name'),
    tipePesanan: text('tipe_pesanan').notNull().default('dine_in'),
    paymentMethod: text('payment_method').notNull().default('cash'),
    subtotal: integer('subtotal').notNull(),
    tax: integer('tax').notNull().default(0),
    total: integer('total').notNull(),
    amountPaid: integer('amount_paid').notNull(),
    change: integer('change').notNull().default(0),
    status: text('status').notNull().default('completed'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const detailTransaksi = pgTable('detail_transaksi', {
    id: serial('id').primaryKey(),
    transaksiId: integer('transaksi_id').references(() => transaksi.id, { onDelete: 'cascade' }),
    menuId: integer('menu_id').references(() => menuItems.id),
    namaMenu: text('nama_menu').notNull(),
    qty: integer('qty').notNull(),
    harga: integer('harga').notNull(),
    subtotal: integer('subtotal').notNull(),
});

export const paymentGateway = pgTable('payment_gateway', {
    id: serial('id').primaryKey(),
    transaksiId: integer('transaksi_id').references(() => transaksi.id),
    reservasiId: integer('reservasi_id').references(() => reservations.id),
    orderIdMidtrans: text('order_id_midtrans').notNull().unique(),
    metodePembayaran: text('metode_pembayaran'),
    statusPembayaran: text('status_pembayaran').notNull().default('pending'),
    waktuDibayar: timestamp('waktu_dibayar'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const shopSettings = pgTable('shop_settings', {
    id: serial('id').primaryKey(),
    key: text('key').notNull().unique(),
    value: text('value').notNull(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const ideas = pgTable('ideas', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    contact: text('contact'),
    topic: text('topic').notNull(),
    message: text('message').notNull(),
    status: text('status').notNull().default('Baru'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

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
