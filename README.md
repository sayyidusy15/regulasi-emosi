# Emora

Emora adalah prototipe aplikasi responsif untuk belajar dan mengukur regulasi emosi melalui arsitektur ERQ-30 yang dapat dikonfigurasi. Semua butir instrumen dan aturan skoring masih berupa placeholder sampai versi tervalidasi serta berizin disediakan oleh pemilik riset.

## Menjalankan proyek

Membutuhkan Node.js 22.13 atau lebih baru.

```bash
npm install
npm run dev
npm run build
```

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
