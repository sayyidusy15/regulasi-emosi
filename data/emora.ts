export const strategies = [
  { id: 1, name: "Refleksi positif", short: "Menemukan makna yang membantu dari sebuah pengalaman.", color: "coral", score: 78 },
  { id: 2, name: "Fokus pada hal positif", short: "Mengalihkan fokus pada hal yang terasa lebih baik.", color: "yellow", score: 66 },
  { id: 3, name: "Penerimaan", short: "Memberi ruang bagi keadaan yang sedang terjadi.", color: "mint", score: 74 },
  { id: 4, name: "Memikirkan hal lain", short: "Mengambil jeda dengan memindahkan perhatian sejenak.", color: "sky", score: 58 },
  { id: 5, name: "Dukungan sosial", short: "Mencari rasa terhubung dan bantuan dari orang lain.", color: "lavender", score: 72 },
  { id: 6, name: "Meninjau kembali", short: "Melihat situasi dari sudut pandang yang berbeda.", color: "sky", score: 63 },
  { id: 7, name: "Berpikir positif", short: "Mengingat kemungkinan baik yang masih tersedia.", color: "coral", score: 69 },
  { id: 8, name: "Relaksasi", short: "Menenangkan tubuh untuk membantu menjernihkan respons.", color: "yellow", score: 64 },
  { id: 9, name: "Perencanaan", short: "Menyusun langkah konkret untuk menghadapi keadaan.", color: "mint", score: 81 },
  { id: 10, name: "Pengalihan perhatian", short: "Mengatur perhatian agar emosi terasa lebih terkelola.", color: "lavender", score: 61 },
] as const;

export const materials = [
  { slug: "apa-itu-regulasi-emosi", title: "Apa Itu Regulasi Emosi?", category: "Dasar", read: "5 menit", intro: "Mengenal proses yang membantu kita memahami, merasakan, dan merespons emosi.", color: "coral" },
  { slug: "respons-emosi-berbeda", title: "Mengapa Respons Emosi Setiap Orang Berbeda?", category: "Wawasan", read: "7 menit", intro: "Pengalaman, konteks, dan kebiasaan membuat respons kita tidak selalu sama.", color: "lavender" },
  { slug: "strategi-regulasi-emosi", title: "Mengenal Strategi Regulasi Emosi", category: "Strategi", read: "8 menit", intro: "Satu situasi bisa dihadapi dengan banyak cara. Mari mengenalnya tanpa menghakimi.", color: "mint" },
  { slug: "tentang-erq-30", title: "Tentang Pengukuran ERQ-30", category: "Instrumen", read: "6 menit", intro: "Cara Emora menyajikan proses pengukuran dengan nyaman dan bertanggung jawab.", color: "yellow" },
] as const;

export const users = [
  { id: "R-1042", name: "Nadia Putri", age: 23, gender: "Perempuan", status: "Selesai", date: "28 Agu 2026" },
  { id: "R-1041", name: "Raka Aditya", age: 27, gender: "Laki-laki", status: "Berlangsung", date: "28 Agu 2026" },
  { id: "R-1040", name: "Aulia Rahman", age: 21, gender: "Laki-laki", status: "Selesai", date: "27 Agu 2026" },
  { id: "R-1039", name: "Siska Amelia", age: 25, gender: "Perempuan", status: "Belum mulai", date: "27 Agu 2026" },
  { id: "R-1038", name: "Dimas Arya", age: 30, gender: "Laki-laki", status: "Selesai", date: "26 Agu 2026" },
  { id: "R-1037", name: "Maya Lestari", age: 24, gender: "Perempuan", status: "Selesai", date: "25 Agu 2026" },
] as const;
