# POS Dashboard Overview — Rencana Implementasi

Saat ini halaman POS (`/pos`) hanya memiliki 3 view: **Menu**, **Peta Meja**, dan **Reservasi**. Kasir tidak punya visibilitas sama sekali terhadap performa harian (pendapatan, jumlah transaksi, dsb). Rencana ini menambahkan tab **"Dashboard"** sebagai view pertama saat kasir membuka POS.

## Fokus Utama
Membuat layout dashboard khusus POS yang berbeda dari Admin Dashboard. Dashboard POS fokus pada informasi **real-time** dan **hari ini**, karena kasir membutuhkan data operasional, bukan data analitik panjang.

Semua API endpoint yang dibutuhkan sudah tersedia:
- `/dashboard/stats`
- `/dashboard/revenue-daily`
- `/transaksi/summary`
- `/meja/status`
- `/transaksi/recent`

Ini adalah murni penambahan frontend.

## Mockup / Wireframe
```text
┌─────────────────────────────────────────────────────────────────┐
│  SIDEBAR │  📊 Dashboard POS — Hari Ini                        │
│          │                                                       │
│  ■ Dashboard │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐│
│  ○ Menu      │  │ Pendapatan│ │ Transaksi│ │Rata-rata │ │ Meja ││
│  ○ Peta Meja │  │ Hari Ini │ │ Hari Ini │ │ /Trx     │ │Status││
│  ○ Reservasi │  │ Rp 2.4jt │ │   34     │ │ Rp 70rb  │ │ 8/12 ││
│              │  └──────────┘ └──────────┘ └──────────┘ └──────┘│
│              │                                                   │
│              │  ┌─────────────────────┐  ┌─────────────────────┐│
│              │  │                     │  │                     ││
│              │  │  Pendapatan 7 Hari  │  │  Metode Pembayaran  ││
│              │  │  (Area Chart)       │  │  (Donut Chart)      ││
│              │  │                     │  │  Cash vs QRIS       ││
│              │  └─────────────────────┘  └─────────────────────┘│
│              │                                                   │
│              │  ┌───────────────────────────────────────────────┐│
│              │  │  Transaksi Terakhir (5 Terakhir)             ││
│              │  │  #ORD-001 | Dine In | Rp 85.000 | 14:32     ││
│              │  │  #ORD-002 | Take Away | Rp 45.000 | 14:15   ││
│              │  │  ...                                         ││
│              │  └───────────────────────────────────────────────┘│
│  ─────────── │                                                   │
│  👤 Kasir    │  ┌──────────────────┐  ┌────────────────────────┐│
│  Logout      │  │  Quick Actions   │  │  Reservasi Hari Ini   ││
│              │  │  [+ Pesanan Baru]│  │  3 upcoming            ││
│              │  │  [📋 Peta Meja] │  │  ...                   ││
│              │  └──────────────────┘  └────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Daftar Perubahan (Proposed Changes)

1. **`uiStore.js`**
   - Ubah default `posActiveView` dari `'menu'` → `'dashboard'`.
   - Ini membuat dashboard menjadi halaman pertama saat kasir buka POS.

2. **`POSSidebar.jsx`**
   - Tambahkan item navigasi baru **"Dashboard"** di posisi paling atas dengan icon `LayoutDashboard`.

3. **`POSLayout.jsx`**
   - Tambahkan conditional rendering untuk `activeView === 'dashboard'`.
   - Import dan render komponen `POSDashboard` baru.

4. **`POSDashboard.jsx` (Komponen Baru)**
   - Komponen utama dashboard POS.
   - Menampilkan 4 *Stat Cards* (Pendapatan Hari Ini, Transaksi Hari Ini, Rata-rata per Transaksi, Status Meja).
   - Menampilkan 2 *Charts* menggunakan Recharts (Area chart untuk 7 hari terakhir, Donut chart untuk metode pembayaran).
   - Tabel *Transaksi Terakhir* (5 item terbaru).
   - Bagian *Bottom Row* untuk Quick Actions (Pesanan Baru, Peta Meja) dan daftar Reservasi Hari Ini.

## Pertanyaan Terbuka / Opsional
1. **Auto-refresh interval**: Apakah data dashboard perlu me-refresh otomatis setiap X detik?
2. **Peak Hours Chart**: Apakah perlu grafik distribusi transaksi per jam hari ini? (Ini akan membutuhkan endpoint baru).
3. **Daily Target**: Perlukah indikator target pendapatan harian?

## Rekomendasi Fitur Tambahan (Next Phase)
Berdasarkan *best practices* sistem kasir, berikut adalah beberapa fitur yang dapat ditambahkan pada fase pengembangan selanjutnya untuk memaksimalkan operasional POS:

1. **Integrasi Pre-Order Reservasi (Prioritas Tinggi)**
   - **Tombol "Pelanggan Tiba"**: Kasir dapat mengubah status meja menjadi "Terisi" dan mengirim tiket pesanan ke dapur saat pelanggan yang melakukan reservasi tiba.
   - **Merge Bill**: Kasir dapat menambahkan pesanan baru ke dalam tagihan meja reservasi yang sudah ada tanpa membuat transaksi terpisah.

2. **Order Queue / Antrean Pesanan Aktif (Prioritas Tinggi)**
   - Tab khusus untuk memantau pesanan yang sedang diproses (terutama untuk *Take Away*), sehingga kasir tahu pesanan mana yang belum diambil pelanggan.

3. **Kitchen Display System (KDS) / Tampilan Dapur**
   - Layar khusus untuk dapur yang menampilkan pesanan masuk secara *real-time*.
   - Fitur "Selesai Dimasak" yang akan memberi notifikasi ke layar kasir.

4. **Manajemen Shift Kasir (Buka/Tutup Kasir)**
   - Pelacakan saldo awal tunai dan pencocokan dengan transaksi *cash* harian untuk mencegah selisih dan kecurangan.

5. **Split Bill (Pisah Tagihan)**
   - Fitur untuk memecah total tagihan satu meja menjadi beberapa pembayaran terpisah (berguna untuk rombongan).
