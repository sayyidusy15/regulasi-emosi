# Emora

Emora adalah prototipe aplikasi responsif untuk belajar dan mengukur regulasi emosi melalui arsitektur ERQ-30 yang dapat dikonfigurasi. Semua butir instrumen dan aturan skoring masih berupa placeholder sampai versi tervalidasi serta berizin disediakan oleh pemilik riset.

## Menjalankan proyek

Membutuhkan Node.js 20.9 atau lebih baru. Versi yang direkomendasikan tersedia di `.nvmrc`.

```bash
npm install
npm run dev
npm run build
```

## Deploy ke Vercel

Proyek ini menggunakan Next.js App Router standar dan tidak lagi bergantung pada Vinext, Wrangler, Cloudflare Worker, D1, R2, atau OpenAI Sites.

1. Push repository ke GitHub, GitLab, atau Bitbucket.
2. Pilih **Add New Project** di Vercel lalu impor repository.
3. Pastikan Framework Preset terdeteksi sebagai **Next.js**.
4. Biarkan Build Command `npm run build` dan Output Directory sebagai bawaan Next.js.
5. Deploy.

Opsional: isi `NEXT_PUBLIC_SITE_URL` dengan domain produksi lengkap, misalnya `https://emora.example.com`, agar metadata sosial selalu menggunakan domain utama. Tanpa variabel ini, Emora otomatis memakai URL deployment Vercel.

## Struktur

- `app/` — seluruh route publik, pengguna, dan admin
- `components/` — shell, navigasi, form interaktif, tabel, dan komponen Emora
- `data/` — strategi, materi, data demo, serta placeholder 30 butir
- `lib/scoring.ts` — titik integrasi aturan skoring resmi
- `public/` — ilustrasi, logo SVG, favicon, dan kartu sosial

## Route utama

- Publik: `/`, `/materi`, `/materi/[slug]`, `/login`, `/register`
- Pengguna: `/app`, `/app/biodata`, `/app/pengukuran`, `/app/hasil`
- Admin: `/admin/login`, `/admin`, `/admin/pengguna`, `/admin/instrumen`, `/admin/jawaban`, `/admin/hasil`, `/admin/export`

## Catatan implementasi

- Progres jawaban demo tersimpan di `localStorage` pada perangkat.
- Auth dan otorisasi masih berupa lapisan presentasi; struktur role `user` dan `admin` siap dihubungkan ke backend.
- Data hasil diberi penanda demo dan tidak memuat diagnosis, cut-off, norma, reverse scoring, atau interpretasi klinis buatan.
