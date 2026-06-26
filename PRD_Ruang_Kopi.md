# Product Requirements Document (PRD)
**Project Name:** Ruang Kopi
**Version:** 1.0
**Date:** 23 Juni 2026

---

## 1. Pendahuluan
**Ruang Kopi** adalah sebuah sistem manajemen *coffee shop* modern yang dirancang untuk mendigitalisasi operasional kedai kopi. Sistem ini terdiri dari dua bagian utama:
1. **Customer-Facing Web:** Situs interaktif bagi pelanggan untuk melihat menu, melakukan reservasi meja secara online, melihat galeri, dan memberikan masukan (feedback).
2. **Admin Dashboard & POS (Point of Sale):** Sistem internal bagi kasir dan admin untuk mengelola pesanan (kasir), memantau ketersediaan meja secara *real-time*, mengelola menu, serta melihat laporan keuangan.

Tujuan utama dari proyek ini adalah memberikan pengalaman pelanggan yang *seamless* (terutama dalam reservasi dan pembayaran non-tunai) dan menyederhanakan manajemen operasional (kasir dan laporan) bagi pemilik kedai.

---

## 2. Arsitektur & Teknologi (Tech Stack)

Sistem ini dibangun menggunakan arsitektur *Monorepo* (menggabungkan frontend dan backend dalam satu *workspace* jika memungkinkan) dengan pemisahan aplikasi web dan API.

### Frontend (Customer Web & Admin Dashboard)
- **Framework:** React.js dengan Vite
- **Styling:** TailwindCSS
- **State Management:** Zustand (Cart Store, UI Store, Auth Store)
- **Animasi:** Framer Motion
- **UI Components:** Radix UI (Dialog, Tabs, dll) & Lucide React (Icons)
- **Routing:** React Router DOM

### Backend (REST API & Real-time Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time Communication:** Socket.io (untuk update status meja & pesanan secara instan ke layar kasir)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Validasi Data:** Zod

### Integrasi Pihak Ketiga (Third-Party Services)
- **Payment Gateway:** Midtrans (Snap API & Webhooks) untuk pembayaran QRIS, Bank Transfer, Card.
- **Cloud Storage:** Cloudinary (untuk menyimpan gambar menu dan galeri).
- **Development Tool:** Ngrok (untuk *tunneling* webhook Midtrans ke server lokal selama fase *development*).

---

## 3. Fitur Utama (Key Features)

### 3.1. Customer Web (Aplikasi Pelanggan)
- **Landing Page Interaktif:** Menampilkan status kedai (Buka/Tutup/Penuh), *hero image* dinamis, dan informasi lokasi.
- **Menu Digital:** Katalog menu yang dikelompokkan berdasarkan kategori (Kopi, Non-Kopi, Makanan, dll) beserta foto dan harga.
- **Sistem Reservasi Online:**
  - Pelanggan dapat memilih tanggal, waktu, jumlah tamu, dan meja spesifik (opsional).
  - Sistem otomatis mengecek ketersediaan meja pada waktu tersebut.
  - Pelanggan diwajibkan membayar **Uang Muka (DP)** untuk mengonfirmasi reservasi menggunakan integrasi Midtrans Snap (QRIS, VA, dll).
- **Kotak Gagasan (Feedback System):** Form interaktif bagi pelanggan untuk memberikan ulasan atau saran terkait Rasa, Suasana, Pelayanan, atau Ide Baru.
- **Galeri:** Menampilkan foto-foto ruang dan suasana kedai kopi.

### 3.2. Admin Dashboard & POS (Aplikasi Internal)
- **Sistem POS (Kasir):**
  - Pembuatan pesanan untuk *Dine-in* atau *Take-away*.
  - Pemilihan meja untuk pesanan *Dine-in*.
  - **Sistem Checkout terintegrasi Midtrans:** Mendukung pembayaran **Tunai** maupun **QRIS/Card**. Jika QRIS dipilih, popup Midtrans akan muncul di layar POS untuk di-scan oleh pelanggan.
- **Manajemen Meja (*Table Management*) Real-time:**
  - Peta visual meja (Misal: Meja 1, Meja 2, dll).
  - Status meja (*Available*, *Busy*, *Reserved*) yang ter-update otomatis menggunakan *Socket.io* saat ada reservasi masuk atau kasir membuat pesanan.
- **Manajemen Reservasi:** Daftar reservasi masuk, konfirmasi pembayaran DP, dan penyesuaian status reservasi.
- **Laporan Keuangan & Dashboard:**
  - Statistik pendapatan harian/bulanan.
  - Grafik komposisi jenis pesanan (*Dine-in* vs *Online*/*Take-away*).
  - Riwayat transaksi terbaru.
- **Manajemen Konten (CMS):**
  - **Menu & Kategori:** Tambah, edit, dan hapus menu (upload gambar otomatis ke Cloudinary).
  - **Galeri:** Mengelola urutan dan foto galeri publik.
  - **Pengaturan Kedai:** Mengubah status operasional (Buka/Penuh/Tutup) dan mengatur foto *hero*.
  - **Kotak Gagasan:** Membaca dan menindaklanjuti *feedback* dari pelanggan.

---

## 4. Struktur Database (Entity Relationship)

Sistem menggunakan PostgreSQL dengan tabel-tabel utama sebagai berikut:

1. **`users`**: Data admin/kasir (Autentikasi).
2. **`categories`**: Kategori menu.
3. **`menuItems`**: Daftar produk, harga, dan relasi ke `categories`.
4. **`galleryImages`**: Data gambar galeri dan pengurutannya.
5. **`meja`**: Daftar meja fisik di kedai beserta kapasitas dan statusnya.
6. **`reservations`**: Data reservasi pelanggan, tanggal, tamu, dan relasi ke `meja`.
7. **`transaksi`**: Data pesanan kasir (POS) maupun pesanan yang berasal dari reservasi, mencakup subtotal, pajak (PPN 11%), total, dan tipe pembayaran.
8. **`detailTransaksi`**: Rincian menu (items) yang dibeli dalam sebuah `transaksi`.
9. **`paymentGateway`**: Data tracking integrasi Midtrans (`orderIdMidtrans`, status settlement) yang terelasi ke `transaksi` atau `reservations`.
10. **`ideas`**: Menyimpan masukan dari *Kotak Gagasan*.
11. **`shopSettings`**: Menyimpan konfigurasi global (status toko, URL gambar hero).

---

## 5. Flow Pembayaran Midtrans (Payment Flow)

Sistem ini mendukung dua jalur (*flow*) pembayaran menggunakan Midtrans Snap:

### A. Flow Reservasi Online (DP)
1. Pelanggan mengisi form reservasi di web.
2. Web memanggil endpoint `/api/reservations` (status `pending`).
3. Web memanggil `/api/payment/snap-token` dengan `reservationId`.
4. Midtrans mengeluarkan *Snap Token*. Web menampilkan popup Midtrans.
5. Pelanggan membayar menggunakan e-Wallet/VA/Card.
6. Midtrans Webhook (ke `/api/payment/webhook`) mengonfirmasi `settlement`.
7. Backend mengubah status reservasi menjadi `dibayar` dan mengunci meja terkait (`status = 'direservasi'`).

### B. Flow POS / Kasir (QRIS)
1. Kasir memasukkan item pesanan dan menekan tombol *Konfirmasi* dengan metode QRIS.
2. POS memanggil `/api/transaksi` (membuat transaksi berstatus `pending`).
3. POS memanggil `/api/payment/snap-token` dengan `transaksiId` (mengirim data total belanja + PPN 11% sebagai item terpisah).
4. Layar kasir memunculkan popup QRIS Midtrans. Pelanggan men-scan QR di layar kasir.
5. Midtrans Webhook mengonfirmasi `settlement`.
6. Backend mengubah status transaksi menjadi `completed`.
7. Backend mengirimkan *event* Socket.io (`emitNewTransaction`) sehingga layar kasir ter-refresh secara *real-time* dan mencatat transaksi sebagai berhasil.

---

## 6. Deployment & Environment (Rencana)
- **Database:** PostgreSQL (bisa menggunakan Neon.tech, Supabase, atau self-hosted).
- **Backend:** Node.js VPS / Railway / Render.
- **Frontend:** Vercel / Netlify / Cloudflare Pages.
- **Images:** Cloudinary.
- **Development:** URL Midtrans Webhook di-tunnel menggunakan **Ngrok** agar Midtrans Sandbox dapat mengirim POST request ke server `localhost` komputer developer.

---
*Dokumen ini merupakan ringkasan fungsionalitas sistem berjalan dan dapat dijadikan acuan untuk pengembangan lebih lanjut atau penyusunan manual book.*
