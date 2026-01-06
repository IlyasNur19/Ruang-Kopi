**Role:** Bertindaklah sebagai Senior Full-stack Developer dan UI/UX Designer.

**Project:** Website Coffee Shop Premium & Estetik (Digital Storefront).

### **1. FITUR UTAMA (CORE FEATURES)**

Website harus mencakup fitur-fitur spesifik berikut:

* **Storytelling (Kisah di Balik Biji Kopi):** Bagian khusus untuk narasi asal-usul kopi dengan layout yang elegan.
* **Menu Digital Dinamis:** Daftar menu dengan kategori (Kopi, Non-Kopi, Makanan, Manual Brew) beserta fitur filter interaktif.
* **Galeri Foto "Instagrammable":** Grid foto berkualitas tinggi untuk menampilkan sudut-sudut estetik kedai.
* **Cek Ketersediaan Tempat (Live):** Indikator visual sederhana (Hijau: Tersedia, Kuning: Hampir Penuh, Merah: Penuh) yang statusnya bisa diubah oleh admin.
* **Reservasi WhatsApp Pintar:** Formulir (Nama, Tanggal, Jam, Jumlah Orang) yang secara otomatis membuat format pesan dan mengarahkan user ke WhatsApp.
* **Highlight Promo & Event:** Bagian khusus untuk menampilkan "Promo Hari Ini" atau jadwal acara musik.
* **Integrasi Lokasi & Jam Buka:** Embed Google Maps dan status "Buka/Tutup" yang sinkron dengan jam operasional.
* **Admin Dashboard (Tampilan Frontend):** Halaman/route khusus (misal: `/admin`) untuk mengontrol status ketersediaan tempat dan mengelola menu/galeri.

---

### **2. ALUR APLIKASI (APP FLOW)**

Tolong buatkan struktur komponen yang mengikuti alur berikut:

**A. Alur Pengunjung:**

1. **Discovery:** User masuk ke Landing Page, melihat Storytelling dan Promo yang sedang aktif.
2. **Exploration:** User melihat Galeri untuk melihat suasana tempat dan membuka Menu menggunakan filter kategori.
3. **Decision:** User mengecek widget "Ketersediaan Tempat" untuk melihat apakah kedai sedang penuh.
4. **Action:** User mengisi "Form Reservasi" yang kemudian akan membuka link WhatsApp dengan teks booking otomatis.

**B. Alur Admin:**

1. **Dashboard:** Halaman sederhana tempat admin bisa mengubah status kapasitas (Tersedia/Penuh) secara real-time.
2. **Management:** Admin dapat menambah atau mengubah konten menu dan foto galeri.

---

### **3. SPESIFIKASI DESAIN & ARSITEKTUR**

* **Vibe Desain:** Minimalis, menggunakan warna hangat/earthy (Cokelat kopi, krem, charcoal) dengan tipografi yang elegan (Serif untuk judul, Sans-serif untuk isi teks).
* **Responsive:** Harus mobile-first (tampilan HP harus sangat rapi).
* **Struktur Kode:** Gunakan prinsip **Clean Architecture**. Pisahkan komponen UI (presentational) dengan logika (hooks/services).
* **Interaktivitas:** Tambahkan animasi halus (scroll-reveal) menggunakan Framer Motion pada setiap bagian website.

---

### **4. INSTRUKSI TEKNIS**

"Bangun layout frontend untuk semua bagian ini. Untuk Form Reservasi, buatkan fungsi handler yang menyusun link WhatsApp: `https://wa.me/{nomor}?text={pesan_otomatis}`. Untuk status ketersediaan tempat, gunakan state sederhana yang nantinya mudah dihubungkan ke database."
