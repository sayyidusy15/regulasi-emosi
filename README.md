# Emora

Emora adalah aplikasi responsif untuk belajar dan mengukur regulasi emosi menggunakan ERQ-30. Aplikasi memakai Next.js di Vercel sebagai frontend/server layer, Google Apps Script sebagai API, dan Google Sheets sebagai database utama.

## Menjalankan proyek

Membutuhkan Node.js 20.9 atau lebih baru. Versi yang direkomendasikan tersedia di `.nvmrc`.

```bash
npm install
npm run dev
npm test
npm run build
```

## Deploy ke Vercel

Proyek ini menggunakan Next.js App Router standar dan tidak lagi bergantung pada Vinext, Wrangler, Cloudflare Worker, D1, R2, atau OpenAI Sites.

1. Push repository ke GitHub, GitLab, atau Bitbucket.
2. Pilih **Add New Project** di Vercel lalu impor repository.
3. Pastikan Framework Preset terdeteksi sebagai **Next.js**.
4. Biarkan Build Command `npm run build` dan Output Directory sebagai bawaan Next.js.
5. Tambahkan environment variable server-only:

   - `APPS_SCRIPT_API_URL` — URL deployment Web App Google Apps Script yang berakhiran `/exec`
   - `APPS_SCRIPT_API_SECRET` — nilai yang sama dengan `APP_SECRET` pada Script Properties

6. Deploy.

Opsional: isi `NEXT_PUBLIC_SITE_URL` dengan domain produksi lengkap, misalnya `https://emora.example.com`, agar metadata sosial selalu menggunakan domain utama. Tanpa variabel ini, Emora otomatis memakai URL deployment Vercel.

## Struktur

- `app/` — seluruh route publik, pengguna, dan admin
- `components/` — shell, navigasi, form interaktif, tabel, dan komponen Emora
- `apps-script/` — API Google Apps Script, schema repair, seed ERQ-30, dan panduan setup
- `data/` — konten editorial dan label skala; butir asesmen tidak diambil dari file statis
- `lib/scoring.ts` — aturan skoring sepuluh subskala ERQ-30
- `tests/` — tes mapping, rentang, validasi, dan kesetaraan scoring frontend/backend
- `public/` — ilustrasi, logo SVG, favicon, dan kartu sosial

## Route utama

- Publik: `/`, `/regulasi-emosi`, `/erq-30`, `/materi`, `/materi/[slug]`, `/login`, `/register`
- Pengguna: `/app`, `/app/biodata`, `/app/pengukuran`, `/app/pengukuran/review`, `/app/hasil`
- Admin: `/admin/login`, `/admin`, `/admin/pengguna`, `/admin/pengguna/[id]`, `/admin/instrumen`, `/admin/jawaban`, `/admin/hasil`, `/admin/export`

## Catatan implementasi

- Auth menggunakan token Apps Script dalam cookie `HttpOnly`; identitas role ditandatangani untuk rendering dan proteksi server-side tanpa flicker.
- Jawaban aktif diautosave ke Google Sheets. `sessionStorage` hanya menjadi cadangan sementara sampai penyimpanan server berhasil.
- Butir ERQ-30 dibaca dari sheet `Questions`; jalankan `setupDatabase()` atau `repairDatabase()` dan `reseedErq30Questions()` sesuai panduan [Apps Script](./apps-script/README.md).
- Hasil adalah sepuluh skor subskala terpisah (3–21), bukan skor total atau diagnosis klinis.
