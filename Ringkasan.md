# 🏠 RuangKopi - Website Coffee Shop Premium & Estetik

## Deskripsi Umum

**RuangKopi** adalah sebuah **Digital Storefront** (etalase digital) untuk coffee shop premium dengan desain estetik. Aplikasi ini dibangun menggunakan arsitektur **monorepo** dengan 2 aplikasi utama:

| Komponen | Teknologi |
|----------|-----------|
| **Frontend (Web)** | React + Vite + TailwindCSS |
| **Backend (API)** | Node.js + Express.js + Drizzle ORM |
| **Database** | PostgreSQL |
| **Monorepo** | Turborepo |
| **Image Storage** | Cloudinary |

---

## 📱 Fitur Utama (Sisi Pengunjung)

### 1. 🏡 Landing Page / Homepage (`/`)
- Hero section dengan animasi premium
- Storytelling tentang asal-usul kopi
- Preview galeri dan promo aktif
- Widget ketersediaan tempat

### 2. 📖 Menu Digital Dinamis (`/menu`)
- Daftar menu dengan kategori: Kopi, Non-Kopi, Makanan, Manual Brew
- Filter interaktif berdasarkan kategori
- Harga dan ketersediaan produk
- Gambar berkualitas tinggi

### 3. 📷 Galeri Foto "Instagrammable" (`/gallery`)
- Grid foto berkualitas tinggi
- Menampilkan sudut-sudut estetik kedai
- Layout masonry yang dinamis

### 4. 📅 Reservasi WhatsApp Pintar (`/reservation`)
- Formulir reservasi lengkap:
  - Nama
  - Nomor Telepon
  - Tanggal
  - Jam
  - Jumlah Orang
- Auto-generate pesan WhatsApp untuk booking
- Integrasi langsung ke WhatsApp bisnis

### 5. 📍 Lokasi & Jam Buka (`/location`)
- Embed Google Maps interaktif
- Status "Buka/Tutup" yang sinkron dengan jam operasional
- Alamat lengkap dan petunjuk arah

### 6. 💡 Kotak Gagasan (`/kotak-gagasan`)
- Fitur feedback/saran dari pengunjung
- Topik yang tersedia:
  - Soal Rasa
  - Suasana Ruang
  - Pelayanan
  - Ide Baru
- Formulir anonim atau dengan kontak

---

## 🔧 Fitur Admin Dashboard (`/admin`)

### Akses Admin
- Login melalui `/admin/login`
- Autentikasi berbasis JWT
- Protected routes untuk keamanan

### Panel Management

#### 1. 📊 Dashboard Overview
- Ringkasan statistik kedai
- Jumlah reservasi pending
- Status ketersediaan tempat (Hijau/Kuning/Merah)
- Quick actions

#### 2. 🍽️ Menu Management
- CRUD (Create, Read, Update, Delete) menu items
- Upload gambar via Cloudinary
- Kategori management
- Toggle ketersediaan item

#### 3. 🖼️ Gallery Management
- Kelola foto galeri
- Upload dengan drag-and-drop
- Atur urutan tampilan
- Hapus foto yang tidak diperlukan

#### 4. 📆 Reservation Management
- Lihat daftar reservasi
- Update status reservasi:
  - Pending → Confirmed → Completed → Cancelled
- Filter berdasarkan tanggal dan status

#### 5. 💬 Ideas Management (Kotak Gagasan)
- Kelola feedback dari pengunjung
- Update status:
  - Baru → Dibaca → Diproses → Selesai
- Lihat detail feedback

#### 6. 🏞️ Space Images Management
- Kelola gambar-gambar space/ruangan
- Update foto suasana kedai

---

## 🗄️ Struktur Database

| Tabel | Deskripsi | Kolom Utama |
|-------|-----------|-------------|
| `categories` | Kategori menu | id, name, slug |
| `menu_items` | Item menu | id, name, description, price, image, categoryId, available |
| `gallery_images` | Foto galeri | id, src, category, span, order |
| `reservations` | Data booking | id, name, phone, date, time, guests, status |
| `users` | Akun admin | id, email, password, name, role |
| `shop_settings` | Pengaturan toko | id, key, value |
| `ideas` | Feedback pengunjung | id, name, contact, topic, message, status |

---

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `GET` | `/api/health` | Health check API |
| `GET` | `/api/menu` | Ambil daftar menu |
| `GET` | `/api/categories` | Ambil kategori menu |
| `GET` | `/api/gallery` | Ambil foto galeri |
| `GET` | `/api/settings/status` | Cek status ketersediaan |
| `POST` | `/api/reservations` | Buat reservasi baru |
| `POST` | `/api/ideas` | Kirim feedback |

### Admin Endpoints (Protected)

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `POST` | `/api/auth/login` | Login admin |
| `POST` | `/api/upload` | Upload gambar ke Cloudinary |
| `POST/PUT/DELETE` | `/api/menu/*` | CRUD menu |
| `POST/PUT/DELETE` | `/api/gallery/*` | CRUD galeri |
| `PUT` | `/api/reservations/:id` | Update status reservasi |
| `PUT` | `/api/ideas/:id` | Update status ideas |

---

## 🎨 Spesifikasi Desain

### Warna & Tema
- **Vibe:** Minimalis, warna hangat/earthy
- **Palette:** Cokelat kopi, krem, charcoal
- **Mode:** Support dark mode

### Tipografi
- **Heading:** Font Serif (elegant)
- **Body:** Font Sans-serif (readable)

### Responsiveness
- **Mobile-first design**
- Optimized untuk semua ukuran layar
- Touch-friendly interface

### Animasi & Efek
- Scroll-reveal dengan Framer Motion
- Glassmorphism effects
- Smooth gradients
- Micro-animations pada interaksi

### UI Components
- HeroUI library
- TailwindCSS styling
- Custom components

---

## 📁 Struktur Folder

```
RuangKopi/
├── apps/
│   ├── api/                    # Backend Express.js
│   │   ├── src/
│   │   │   ├── db/             # Database schema & connection
│   │   │   │   ├── index.ts    # Database connection
│   │   │   │   └── schema.ts   # Drizzle schema definitions
│   │   │   ├── middleware/     # Middleware
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── validate.middleware.ts
│   │   │   ├── routes/         # API routes
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── category.routes.ts
│   │   │   │   ├── gallery.routes.ts
│   │   │   │   ├── ideas.routes.ts
│   │   │   │   ├── menu.routes.ts
│   │   │   │   ├── reservation.routes.ts
│   │   │   │   ├── settings.routes.ts
│   │   │   │   └── upload.routes.ts
│   │   │   ├── utils/          # Utilities
│   │   │   └── index.ts        # Entry point
│   │   ├── .env                # Environment variables
│   │   └── package.json
│   │
│   └── web/                    # Frontend React
│       ├── src/
│       │   ├── components/     # UI components
│       │   │   ├── admin/      # Admin dashboard components
│       │   │   │   ├── DashboardOverview.jsx
│       │   │   │   ├── GalleryManagement.jsx
│       │   │   │   ├── IdeasManagement.jsx
│       │   │   │   ├── MenuManagement.jsx
│       │   │   │   ├── ReservationManagement.jsx
│       │   │   │   └── SpaceImagesManagement.jsx
│       │   │   ├── ui/         # Reusable UI components
│       │   │   ├── Footer.jsx
│       │   │   ├── Gallery.jsx
│       │   │   ├── Hero.jsx
│       │   │   ├── Location.jsx
│       │   │   ├── Menu.jsx
│       │   │   ├── Navbar.jsx
│       │   │   ├── PromoSection.jsx
│       │   │   ├── ProtectedRoute.jsx
│       │   │   ├── Reservation.jsx
│       │   │   └── Story.jsx
│       │   ├── context/        # React contexts
│       │   │   └── AuthContext.jsx
│       │   ├── hooks/          # Custom hooks
│       │   │   └── useApi.js
│       │   ├── pages/          # Route pages
│       │   │   ├── Admin.jsx
│       │   │   ├── AdminLogin.jsx
│       │   │   ├── GalleryPage.jsx
│       │   │   ├── Home.jsx
│       │   │   ├── KotakGagasanPage.jsx
│       │   │   ├── LocationPage.jsx
│       │   │   ├── MenuPage.jsx
│       │   │   ├── ReservationPage.jsx
│       │   │   └── StoryPage.jsx
│       │   ├── services/       # API service
│       │   ├── App.jsx         # Main app component
│       │   ├── main.jsx        # Entry point
│       │   └── index.css       # Global styles
│       ├── index.html
│       └── package.json
│
├── packages/                   # Shared packages
├── turbo.json                  # Turborepo config
├── package.json                # Root package.json
└── README.md
```

---

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js v18+
- PostgreSQL database
- Cloudinary account (untuk upload gambar)

### Environment Variables

#### Backend (`apps/api/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ruangkopi
JWT_SECRET=your-jwt-secret
PORT=3001
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Commands

```bash
# Install dependencies
npm install

# Run development (both frontend & backend)
npm run dev

# Run frontend only
npm run dev --filter=web

# Run backend only
npm run dev --filter=api

# Build for production
npm run build

# Push database schema
cd apps/api && npx drizzle-kit push
```

---

## 🔐 Autentikasi

- Menggunakan **JWT (JSON Web Token)**
- Token disimpan di localStorage
- Protected routes menggunakan `ProtectedRoute` component
- Middleware validasi di backend

---

## 📦 Dependencies Utama

### Frontend
- React 18
- React Router DOM
- TailwindCSS
- Framer Motion
- HeroUI
- Axios

### Backend
- Express.js
- Drizzle ORM
- PostgreSQL (pg)
- JSON Web Token (jsonwebtoken)
- Bcrypt
- Cloudinary
- Zod (validation)
- CORS

---

## 🎯 Alur Aplikasi

### A. Alur Pengunjung

```
1. Discovery    → Landing Page (Storytelling + Promo)
       ↓
2. Exploration  → Galeri (lihat suasana) + Menu (filter kategori)
       ↓
3. Decision     → Cek Widget Ketersediaan Tempat
       ↓
4. Action       → Isi Form Reservasi → WhatsApp Otomatis
```

### B. Alur Admin

```
1. Login        → /admin/login (email + password)
       ↓
2. Dashboard    → Overview statistik + status kapasitas
       ↓
3. Management   → CRUD Menu, Galeri, Reservasi, Ideas
```

---

## ✨ Highlights

- ☕ **Premium Design** - Tampilan estetik dan modern
- 📱 **Mobile-First** - Responsive di semua device
- ⚡ **Fast Performance** - Vite + React optimized
- 🔒 **Secure** - JWT authentication + protected routes
- ☁️ **Cloud Storage** - Cloudinary untuk gambar
- 📊 **Full Admin Panel** - Kelola semua aspek bisnis
- 💬 **WhatsApp Integration** - Reservasi langsung via WA

---

*Dokumentasi ini dibuat untuk memberikan gambaran lengkap tentang aplikasi RuangKopi.*
