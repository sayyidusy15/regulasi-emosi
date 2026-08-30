# Menyiapkan Database Emora di Google Sheets

Panduan ini ditulis untuk pemilik riset yang tidak terbiasa dengan pemrograman. Proses ini hanya perlu dilakukan sekali saat pertama kali menyiapkan Emora.

## Yang akan dibuat otomatis

Fungsi `setupDatabase()` akan membuat tujuh worksheet berikut beserta seluruh judul kolomnya:

1. `Users`
2. `Biodata`
3. `Questions`
4. `Assessments`
5. `Responses`
6. `Results`
7. `Materials`

Sheet `Questions` akan langsung mendapat 30 item Q01–Q30. Kolom `question_text_en` berisi redaksi Inggris persis dari PDF resmi Preece & Gross (2026). Kolom `question_text_id` berisi terjemahan proyek dan selalu ditandai `draft_translation`, bukan versi Indonesia yang tervalidasi. Seluruh item memakai skala 1–7 dan langsung aktif.

## Langkah setup

### 1. Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com).
2. Klik **Blank spreadsheet** atau **Spreadsheet kosong**.
3. Ubah namanya, misalnya menjadi **Database Emora**.
4. Salin ID spreadsheet dari alamat browser. Contoh alamat:

   `https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOp/edit`

   ID spreadsheet-nya adalah bagian di antara `/d/` dan `/edit`, yaitu `1AbCdEfGhIjKlMnOp`.

### 2. Buka Google Apps Script

1. Dari spreadsheet, pilih menu **Extensions → Apps Script**.
2. Hapus isi awal file `Code.gs`.
3. Buka file `apps-script/Code.gs` dari proyek Emora.
4. Salin seluruh isinya ke editor Apps Script.
5. Klik ikon **Save**.

### 3. Atur Script Properties

1. Di Apps Script, klik **Project Settings** atau ikon roda gigi di sebelah kiri.
2. Cari bagian **Script Properties**.
3. Klik **Add script property**.
4. Tambahkan properti berikut:

   - Property: `SPREADSHEET_ID`
   - Value: ID spreadsheet dari langkah pertama
5. Tambahkan satu properti lagi:

   - Property: `APP_SECRET`
   - Value: teks acak rahasia dengan panjang minimal 32 karakter

Untuk membuat `APP_SECRET`, buka Terminal lalu jalankan salah satu perintah berikut:

```bash
openssl rand -hex 32
```

Salin hasilnya tanpa spasi. Jangan membagikan nilai ini dan jangan menaruhnya dalam screenshot atau dokumen publik.

### 4. Buat database otomatis

1. Kembali ke halaman editor Apps Script.
2. Pada daftar fungsi di bagian atas, pilih `setupDatabase`.
3. Klik **Run**.
4. Google akan meminta izin. Pilih akun pemilik spreadsheet, tinjau izin, lalu klik **Allow**.
5. Kembali ke spreadsheet. Tujuh worksheet beserta header-nya seharusnya sudah tersedia.

Jika fungsi dijalankan lagi, `repairDatabase()` akan menormalkan header dan menambahkan kolom wajib sambil mempertahankan data peserta yang sudah ada. Sheet `Questions` kemudian diisi ulang dengan tepat 30 item ERQ-30.

### 5. Periksa instrumen ERQ-30

Tidak ada pengisian manual yang diperlukan. Setelah `setupDatabase()` selesai:

1. Buka worksheet `Questions`.
2. Pastikan terdapat tepat 30 item, Q01 sampai Q30.
3. Pastikan `translation_status` berisi `draft_translation` dan `is_active` berisi `TRUE`.
4. Teks Inggris adalah sumber resmi. Teks Indonesia adalah terjemahan proyek untuk ditinjau dan tidak boleh disebut versi Indonesia tervalidasi.

Jika worksheet `Questions` sudah ada dari versi Emora sebelumnya, salin kode Apps Script terbaru lalu jalankan `reseedErq30Questions()` satu kali. Fungsi tersebut mengganti isi sheet `Questions` dengan tepat Q01–Q30 dan tidak mengubah Users, Biodata, Assessments, Responses, Results, atau Materials.

`seedErq30Questions()` aman dijalankan berulang kali karena memperbarui item berdasarkan ID tanpa membuat duplikasi.

Dokumentasi resmi menyatakan bahwa penerjemahan, adaptasi, atau modifikasi ERQ-30 memerlukan izin tambahan dari pemegang hak cipta. Dapatkan izin tersebut sebelum menggunakan terjemahan proyek dalam pelaksanaan riset.

### 6. Deploy sebagai Web App

1. Di Apps Script, klik **Deploy → New deployment**.
2. Klik ikon roda gigi, lalu pilih **Web app**.
3. Isi deskripsi, misalnya **Emora API v1**.
4. Pada **Execute as**, pilih **Me**.
5. Pada **Who has access**, pilih **Anyone**.
6. Klik **Deploy** dan setujui izin bila diminta.
7. Salin **Web app URL** yang berakhiran `/exec`.

Walaupun akses Web App disetel ke Anyone, setiap permintaan tetap harus membawa `APP_SECRET`, dan website hanya mengirimkannya dari server Next.js.

### 7. Hubungkan ke Vercel

1. Buka proyek Emora di Vercel.
2. Pilih **Settings → Environment Variables**.
3. Tambahkan:

   - `APPS_SCRIPT_API_URL` = Web app URL dari langkah sebelumnya
   - `APPS_SCRIPT_API_SECRET` = nilai yang sama dengan `APP_SECRET`
4. Aktifkan untuk Production, Preview, dan Development bila diperlukan.
5. Simpan, lalu lakukan **Redeploy** pada website.

Nama variabel tidak boleh diawali `NEXT_PUBLIC_` karena kedua nilai tersebut hanya boleh tersedia di server.

## Membuat akun administrator

Admin tidak dapat mendaftar melalui halaman publik.

1. Daftarkan akun biasa melalui halaman pendaftaran Emora.
2. Buka worksheet `Users`.
3. Cari baris akun tersebut.
4. Ubah nilai kolom `role` dari `user` menjadi `admin`.
5. Gunakan email dan password akun itu pada halaman login admin.

## Mengelola materi

Materi pada worksheet `Materials` akan muncul di website bila kolom `status` bernilai `published`. Gunakan `draft` untuk menyimpan materi yang belum ingin ditampilkan. `slug` harus unik, memakai huruf kecil dan tanda hubung, misalnya `memahami-penerimaan`.

## Membuka dan mengekspor data

Dashboard admin menyediakan:

- Data biodata
- Jawaban mentah Q01–Q30
- Sepuluh hasil subskala ERQ-30
- Dataset gabungan
- Tombol **Buka di Google Sheets**

Ekspor aplikasi menggunakan CSV yang dapat dibuka dengan Excel, SPSS, R, Python, atau Google Sheets. File asli juga dapat diunduh sebagai XLSX langsung dari menu **File → Download → Microsoft Excel** di Google Sheets.

## Catatan keamanan penting

Implementasi autentikasi ini menggunakan salted HMAC-SHA-256, session token acak, cookie `HttpOnly`, masa berlaku sesi, pembatasan peran, serta secret server-to-server. Ini ditujukan untuk prototipe akademik atau riset berskala kecil.

Jika Emora digunakan untuk skala besar, data sangat sensitif, atau penggunaan publik jangka panjang, autentikasi ini harus diganti dengan layanan identitas production-grade dan ditinjau oleh tenaga keamanan aplikasi. Batasi akses spreadsheet hanya kepada anggota tim riset yang benar-benar memerlukannya.

## Memperbarui Apps Script

Setelah mengubah kode Apps Script:

1. Klik **Deploy → Manage deployments**.
2. Pilih deployment aktif dan klik **Edit**.
3. Pilih **New version**.
4. Klik **Deploy**.

Web app URL biasanya tetap sama sehingga variabel Vercel tidak perlu diubah.
