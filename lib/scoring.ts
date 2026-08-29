export type Answers = Record<number, number>;

// TODO: Masukkan aturan skoring resmi ERQ-30 dari pemilik riset, termasuk
// pemetaan butir dan aturan pembalikan bila memang ditentukan secara resmi.
// Fungsi demo ini tidak dipakai untuk interpretasi ilmiah atau klinis.
export function getDemoCompletion(answers: Answers) {
  return Object.keys(answers).length;
}
