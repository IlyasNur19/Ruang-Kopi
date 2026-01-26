# 🚀 Deployment Guide - RuangKopi

Panduan lengkap untuk deploy aplikasi RuangKopi ke production.

---

## Arsitektur Deployment

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │────▶│     Railway     │────▶│    Supabase     │
│   (Frontend)    │     │    (Backend)    │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         │              ┌────────┴────────┐
         │              │   Cloudinary    │
         │              │    (Images)     │
         └──────────────┴─────────────────┘
```

---

## Step 1: Setup Database (Supabase)

1. Buka https://supabase.com → Sign up gratis
2. Create new project
3. Copy **Connection String**:
   - Settings → Database → Connection string → URI
   - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
4. Simpan connection string untuk backend

---

## Step 2: Deploy Backend ke Railway

### 2.1 Buat Project
1. Buka https://railway.app → Sign up dengan GitHub
2. Klik **"New Project"** → **"Deploy from GitHub repo"**
3. Pilih repository RuangKopi
4. Klik **"Add Service"** → Pilih repo lagi jika perlu

### 2.2 Configure Service
1. Klik service → **Settings**:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`

2. Tambah **Environment Variables**:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NODE_ENV=production
   ```

3. Klik **Deploy** → Tunggu selesai
4. Catat domain: `https://your-app.railway.app`

### 2.3 Jalankan Migrasi Database
Di Railway terminal atau local:
```bash
npm run db:push
npm run db:seed
```

---

## Step 3: Deploy Frontend ke Vercel

### 3.1 Buat Project
1. Buka https://vercel.com → Sign up dengan GitHub
2. Klik **"Add New"** → **"Project"**
3. Import repository RuangKopi

### 3.2 Configure Project
1. **Framework Preset**: Vite
2. **Root Directory**: `apps/web`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

5. Tambah **Environment Variables**:
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```
   (Ganti dengan URL Railway dari Step 2)

6. Klik **Deploy**!

---

## Step 4: Konfigurasi CORS (Penting!)

Update file `apps/api/src/index.ts` untuk allow domain Vercel:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

Commit dan push → Railway akan auto-redeploy.

---

## Environment Variables Reference

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL dari Railway |

### Backend (Railway)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret untuk JWT (min 32 char) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NODE_ENV` | Set to `production` |

---

## Custom Domain (Opsional)

### Vercel
1. Project Settings → Domains → Add
2. Add CNAME record di DNS provider

### Railway
1. Service Settings → Networking → Custom Domain
2. Add CNAME record di DNS provider

---

## Troubleshooting

### "Failed to fetch" Error
- Cek CORS configuration di backend
- Pastikan `VITE_API_URL` benar

### Database Connection Error
- Cek `DATABASE_URL` di Railway
- Pastikan IP Railway diallow di Supabase (Settings → Database → Add IP)

### Build Error
- Cek logs di Vercel/Railway Dashboard
- Pastikan semua dependencies terinstall

---

## Estimasi Biaya (Free Tier)

| Service | Free Tier |
|---------|-----------|
| **Vercel** | ✅ Unlimited untuk hobby |
| **Railway** | ✅ $5 credit/bulan |
| **Supabase** | ✅ 500MB database |
| **Cloudinary** | ✅ 25 credits/bulan |

---

*Selamat deploy! ☕*
