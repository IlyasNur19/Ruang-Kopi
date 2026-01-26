import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';

// Controllers
import { authController } from '../controllers/auth.controller.js';
import { categoryController } from '../controllers/category.controller.js';
import { menuController } from '../controllers/menu.controller.js';
import { galleryController } from '../controllers/gallery.controller.js';
import { reservationController } from '../controllers/reservation.controller.js';
import { settingsController } from '../controllers/settings.controller.js';
import { uploadController } from '../controllers/upload.controller.js';
import { ideasController } from '../controllers/ideas.controller.js';

// Middleware
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

// ================================
// Validation Schemas
// ================================

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
});

const updateReservationSchema = z.object({
    status: z.enum(['Pending', 'Confirmed', 'Completed', 'Cancelled']).optional(),
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    guests: z.number().min(1).optional(),
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

// ================================
// Multer Configuration for Upload
// ================================

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

// ================================
// Auth Routes
// ================================

router.post('/auth/login', validate(loginSchema), authController.login);
router.get('/auth/me', authMiddleware, authController.getMe);

// ================================
// Category Routes
// ================================

router.get('/categories', categoryController.getAll);
router.post('/categories', authMiddleware, validate(categorySchema), categoryController.create);
router.delete('/categories/:id', authMiddleware, categoryController.delete);

// ================================
// Menu Routes
// ================================

router.get('/menu', menuController.getAll);
router.get('/menu/:id', menuController.getById);
router.post('/menu', authMiddleware, validate(menuItemSchema), menuController.create);
router.put('/menu/:id', authMiddleware, validate(menuItemSchema.partial()), menuController.update);
router.delete('/menu/:id', authMiddleware, menuController.delete);

// ================================
// Gallery Routes
// ================================

router.get('/gallery', galleryController.getAll);
router.post('/gallery', authMiddleware, validate(galleryImageSchema), galleryController.create);
router.put('/gallery/reorder', authMiddleware, validate(reorderSchema), galleryController.reorder);
router.put('/gallery/:id', authMiddleware, validate(galleryImageSchema.partial()), galleryController.update);
router.delete('/gallery/:id', authMiddleware, galleryController.delete);

// ================================
// Reservation Routes
// ================================

router.get('/reservations', authMiddleware, reservationController.getAll);
router.get('/reservations/:id', authMiddleware, reservationController.getById);
router.post('/reservations', validate(createReservationSchema), reservationController.create);
router.put('/reservations/:id', authMiddleware, validate(updateReservationSchema), reservationController.update);
router.delete('/reservations/:id', authMiddleware, reservationController.delete);

// ================================
// Settings Routes
// ================================

router.get('/settings/status', settingsController.getStatus);
router.put('/settings/status', authMiddleware, validate(statusSchema), settingsController.updateStatus);
router.get('/settings/space-images', settingsController.getSpaceImages);
router.put('/settings/space-images', authMiddleware, validate(spaceImagesSchema), settingsController.updateSpaceImages);
router.get('/settings/hero-image', settingsController.getHeroImage);
router.put('/settings/hero-image', authMiddleware, settingsController.updateHeroImage);

// ================================
// Upload Routes
// ================================

router.post('/upload', authMiddleware, upload.single('image'), uploadController.upload);
router.delete('/upload/:publicId(*)', authMiddleware, uploadController.delete);

// ================================
// Ideas Routes
// ================================

router.get('/ideas', authMiddleware, ideasController.getAll);
router.post('/ideas', validate(createIdeaSchema), ideasController.create);
router.put('/ideas/:id', authMiddleware, validate(updateIdeaSchema), ideasController.update);
router.delete('/ideas/:id', authMiddleware, ideasController.delete);

export default router;
