import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';

import { authController } from '../controllers/auth.controller.js';
import { categoryController } from '../controllers/category.controller.js';
import { menuController } from '../controllers/menu.controller.js';
import { galleryController } from '../controllers/gallery.controller.js';
import { reservationController } from '../controllers/reservation.controller.js';
import { settingsController } from '../controllers/settings.controller.js';
import { uploadController } from '../controllers/upload.controller.js';
import { ideasController } from '../controllers/ideas.controller.js';
import { mejaController } from '../controllers/meja.controller.js';
import { transaksiController } from '../controllers/transaksi.controller.js';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { paymentController } from '../controllers/payment.controller.js';

import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

const loginSchema = z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required'),
});

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
});

const menuItemSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    image: z.string().url().optional().nullable(),
    categoryId: z.number().optional().nullable(),
    available: z.boolean().optional(),
});

const galleryImageSchema = z.object({
    src: z.string().url('Valid URL is required'),
    category: z.string().min(1, 'Category is required'),
    span: z.string().optional().nullable(),
    order: z.number().optional(),
});

const reorderSchema = z.object({
    images: z.array(z.object({
        id: z.number(),
        order: z.number(),
    })),
});

const createReservationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    guests: z.number().min(1, 'At least 1 guest required'),
    mejaId: z.number().optional().nullable(),
});

const updateReservationSchema = z.object({
    status: z.enum(['pending', 'dibayar', 'batal', 'selesai']).optional(),
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    guests: z.number().min(1).optional(),
    mejaId: z.number().optional().nullable(),
});

const statusSchema = z.object({
    status: z.enum(['available', 'busy', 'full']),
});

const spaceImagesSchema = z.object({
    images: z.array(z.object({
        src: z.string().url(),
        title: z.string().min(1),
        caption: z.string().optional(),
    })),
});

const createIdeaSchema = z.object({
    name: z.string().min(1, 'Nama harus diisi'),
    contact: z.string().optional(),
    topic: z.enum(['Soal Rasa', 'Suasana Ruang', 'Pelayanan', 'Ide Baru']),
    message: z.string().min(1, 'Pesan harus diisi'),
});

const updateIdeaSchema = z.object({
    status: z.enum(['Baru', 'Dibaca', 'Diproses', 'Selesai']).optional(),
});

const createMejaSchema = z.object({
    nomor_meja: z.string().min(1, 'Nomor meja harus diisi'),
    kapasitas: z.number().min(1, 'Kapasitas minimal 1').optional(),
    status: z.enum(['tersedia', 'direservasi', 'terisi']).optional(),
});

const updateMejaSchema = z.object({
    nomor_meja: z.string().min(1).optional(),
    kapasitas: z.number().min(1).optional(),
    status: z.enum(['tersedia', 'direservasi', 'terisi']).optional(),
});

const createTransaksiSchema = z.object({
    items: z.array(z.object({
        menuId: z.number(),
        name: z.string(),
        qty: z.number().min(1),
        price: z.number(),
        subtotal: z.number(),
    })),
    total: z.number(),
    tableId: z
        .union([z.number(), z.string()])
        .transform((val) => (val === '' || val === null || val === undefined ? null : Number(val)))
        .nullable()
        .optional(),
    reservationId: z.number().optional().nullable(),
    customerName: z.string().optional().nullable(),
    orderType: z.enum(['online', 'dine_in', 'take_away']),
    paymentMethod: z.enum(['cash', 'qris']),
    amountPaid: z.number(),
    change: z.number(),
});

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!') as any, false);
        }
    },
});

router.post('/auth/login', validate(loginSchema), authController.login);
router.get('/auth/me', authMiddleware, authController.getMe);

router.get('/categories', categoryController.getAll);
router.post('/categories', authMiddleware, validate(categorySchema), categoryController.create);
router.delete('/categories/:id', authMiddleware, categoryController.delete);

router.get('/menu', menuController.getAll);
router.get('/menu/:id', menuController.getById);
router.post('/menu', authMiddleware, validate(menuItemSchema), menuController.create);
router.put('/menu/:id', authMiddleware, validate(menuItemSchema.partial()), menuController.update);
router.delete('/menu/:id', authMiddleware, menuController.delete);

router.get('/gallery', galleryController.getAll);
router.post('/gallery', authMiddleware, validate(galleryImageSchema), galleryController.create);
router.put('/gallery/reorder', authMiddleware, validate(reorderSchema), galleryController.reorder);
router.put('/gallery/:id', authMiddleware, validate(galleryImageSchema.partial()), galleryController.update);
router.delete('/gallery/:id', authMiddleware, galleryController.delete);

router.get('/reservations/available-tables', reservationController.getAvailableTables);
router.get('/reservations', authMiddleware, reservationController.getAll);
router.get('/reservations/:id', authMiddleware, reservationController.getById);
router.post('/reservations', validate(createReservationSchema), reservationController.create);
router.put('/reservations/:id', authMiddleware, validate(updateReservationSchema), reservationController.update);
router.delete('/reservations/:id', authMiddleware, reservationController.delete);

router.get('/settings/status', settingsController.getStatus);
router.put('/settings/status', authMiddleware, validate(statusSchema), settingsController.updateStatus);
router.get('/settings/space-images', settingsController.getSpaceImages);
router.put('/settings/space-images', authMiddleware, validate(spaceImagesSchema), settingsController.updateSpaceImages);
router.get('/settings/hero-image', settingsController.getHeroImage);
router.put('/settings/hero-image', authMiddleware, settingsController.updateHeroImage);

router.post('/upload', authMiddleware, upload.single('image'), uploadController.upload);
router.delete('/upload/:publicId(*)', authMiddleware, uploadController.delete);

router.get('/ideas', authMiddleware, ideasController.getAll);
router.post('/ideas', validate(createIdeaSchema), ideasController.create);
router.put('/ideas/:id', authMiddleware, validate(updateIdeaSchema), ideasController.update);
router.delete('/ideas/:id', authMiddleware, ideasController.delete);

router.get('/meja', mejaController.getAll);
router.get('/meja/status', mejaController.getStatus);
router.get('/meja/:id', mejaController.getById);
router.post('/meja', authMiddleware, validate(createMejaSchema), mejaController.create);
router.put('/meja/:id', authMiddleware, validate(updateMejaSchema), mejaController.update);
router.delete('/meja/:id', authMiddleware, mejaController.delete);

router.get('/transaksi', authMiddleware, transaksiController.getAll);
router.get('/transaksi/recent', authMiddleware, transaksiController.getRecent);
router.get('/transaksi/summary', authMiddleware, transaksiController.getSummary);
router.get('/transaksi/:id', authMiddleware, transaksiController.getById);
router.post('/transaksi', authMiddleware, validate(createTransaksiSchema), transaksiController.create);
router.put('/transaksi/:id/cancel', authMiddleware, transaksiController.cancel);

router.get('/dashboard/stats', authMiddleware, dashboardController.getStats);
router.get('/dashboard/revenue-daily', authMiddleware, dashboardController.getRevenueDaily);
router.get('/dashboard/revenue-by-type', authMiddleware, dashboardController.getRevenueByType);
router.get('/dashboard/recent-transactions', authMiddleware, dashboardController.getRecentTransactions);
router.get('/dashboard/popular-menus', dashboardController.getPopularMenus);

const createPaymentSchema = z.object({
    reservationId: z.number().optional().nullable(),
    transaksiId: z.number().optional().nullable(),
    amount: z.number().positive('Amount must be positive'),
    customerName: z.string().min(1, 'Customer name is required').optional(),
    customerEmail: z.string().email('Valid email is required').optional(),
    customerPhone: z.string().optional(),
    items: z.array(z.object({
        id: z.union([z.string(), z.number()]).optional(),
        menuId: z.number().optional(),
        price: z.number(),
        quantity: z.number().optional(),
        qty: z.number().optional(),
        name: z.string(),
    })).optional(),
});

router.post('/payment/snap-token', validate(createPaymentSchema), paymentController.createSnapToken);
router.post('/payment/webhook', paymentController.webhook);
router.get('/payment/status/:orderId', paymentController.getStatus);

router.get('/payment/by-reservation/:reservationId', authMiddleware, paymentController.getByReservation);
router.get('/payment/all', authMiddleware, paymentController.getAll);

export default router;
