export type Question = { id:number; text:string; strategyId:number };

// TODO: Ganti seluruh placeholder dengan butir ERQ-30 Bahasa Indonesia yang
// telah divalidasi dan berizin dari pemilik riset. UI tidak memuat, menerjemahkan,
// atau menyimpulkan isi instrumen asli.
export const questions: Question[] = Array.from({length:30}, (_, index) => ({
  id:index + 1,
  text:`Item ERQ-30 ${String(index + 1).padStart(2,"0")}`,
  strategyId:(index % 10) + 1,
}));

export const likert = {
  min:1, max:7,
  labels:{1:"Sangat Tidak Setuju",4:"Netral",7:"Sangat Setuju"} as Record<number,string>,
};
