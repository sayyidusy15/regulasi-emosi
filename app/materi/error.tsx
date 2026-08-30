"use client";

export default function MaterialsError({reset}:{reset:()=>void}) {
  return <main className="site-shell"><div className="submitted-state" style={{margin:"12vh auto"}}><h2>Materi belum dapat dimuat.</h2><p>Koneksi ke sumber materi sedang bermasalah. Coba lagi sebentar.</p><button className="primary-button" onClick={reset}>Coba lagi</button></div></main>;
}
