import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, HeartHandshake, LockKeyhole, Rocket, ScanHeart, Sprout } from "lucide-react";
import { Footer, PublicNavbar } from "@/components/emora";
import { materials, strategies } from "@/data/emora";

const miniStrategies = [
  ["01", "Refleksi positif", "coral"], ["02", "Fokus hal positif", "yellow"],
  ["03", "Penerimaan", "mint"], ["04", "Memikirkan hal lain", "sky"],
  ["05", "Dukungan sosial", "lavender"],
] as const;

export default function Home() {
  return (
    <main className="site-shell">
      <PublicNavbar active="home" />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span>◆</span> Kenali. Pahami. Kelola.</div>
          <h1 id="hero-title">Kenali Cara Kamu<br />Mengelola <span>Emosi</span></h1>
          <p>Emora membantu kamu memahami strategi regulasi emosi melalui ERQ-30 dengan cara yang lebih mudah, nyaman, dan menyenangkan.</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/register"><Rocket size={19} /> Mulai Pengukuran <ArrowRight size={20} /></Link>
            <Link className="secondary-button" href="/#regulasi"><BookOpen size={19} /> Pelajari Dulu <ArrowRight size={20} /></Link>
          </div>
          <div className="trust-row" aria-label="Keunggulan Emora">
            <div><span className="trust-icon mint"><LockKeyhole size={17} /></span><p><strong>Aman &amp; Rahasia</strong><small>Datamu terlindungi</small></p></div>
            <div><span className="trust-icon yellow">↗</span><p><strong>Hasil Terstruktur</strong><small>Mudah dipahami</small></p></div>
            <div><span className="trust-icon lavender">◎</span><p><strong>Berbasis Instrumen</strong><small>ERQ-30 terkonfigurasi</small></p></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Ilustrasi seseorang menggunakan Emora">
          <div className="strategy-note">10 strategi regulasi emosi <span>⌁</span></div>
          <div className="strategy-strip">
            {miniStrategies.map(([number,label,color]) => <div className={`mini-strategy ${color}`} key={number}><b>{number}</b><span>{label}</span></div>)}
          </div>
          <Image src="/images/emora-hero.png" alt="Perempuan muda bersantai sambil menggunakan tablet" width={1536} height={1024} priority />
          <div className="result-preview">
            <div><strong>Ringkasan hasilmu</strong><span>Contoh</span></div>
            <div className="score-row"><b>78</b><div><i style={{width:"78%"}} /><small>Refleksi positif</small></div></div>
            <div className="score-row"><b>72</b><div><i style={{width:"72%"}} /><small>Dukungan sosial</small></div></div>
          </div>
          <span className="face face-one">⌣</span><span className="face face-two">⌣</span>
        </div>
      </section>

      <section className="editorial-section" id="regulasi">
        <div className="emotion-art" aria-hidden="true"><span className="blob-face">•‿•</span><i/><b>emosi datang<br/>dan bergerak</b></div>
        <div className="editorial-copy"><span className="section-kicker">MENGENAL EMOSI</span><h2>Emosi Itu Wajar.<br/>Cara Kita Mengelolanya yang Berbeda.</h2><p>Regulasi emosi bukan soal menghapus perasaan. Ini adalah cara kita mengenali apa yang terasa, memberi ruang, lalu memilih respons yang sesuai dengan keadaan.</p><div className="concept-line"><div><b>01</b><strong>Memahami</strong><span>menyadari apa yang sedang terjadi</span></div><div><b>02</b><strong>Mengelola</strong><span>memberi diri ruang untuk merespons</span></div><div><b>03</b><strong>Merespons</strong><span>memilih langkah yang terasa tepat</span></div></div></div>
      </section>

      <section className="erq-section" id="erq30">
        <div className="erq-copy"><span className="section-kicker">TENTANG PENGUKURAN</span><h2>Kenalan dengan <span>ERQ-30</span></h2><p>Pengukuran disajikan satu per satu agar kamu bisa menjawab dengan tenang. Tidak ada jawaban yang “paling benar”—pilih yang paling sesuai dengan dirimu.</p><div className="erq-stats"><div><b>30</b><span>Pertanyaan</span></div><div><b>10</b><span>Strategi</span></div><div><b>±</b><span>Beberapa menit</span></div></div><Link className="secondary-button" href="/app/pengukuran">Pelajari cara pengukurannya <ArrowRight size={18}/></Link></div>
        <div className="paper-visual"><span className="paper-clip"/><div className="paper-head"><ClipboardCheck/><p><strong>Pengukuran ERQ-30</strong><small>Contoh tampilan</small></p></div><div className="paper-progress"><i/></div><h3>Item ERQ-30 08</h3><div className="paper-scale">{[1,2,3,4,5,6,7].map(x=><span key={x}>{x}</span>)}</div><p className="paper-note">Butir tervalidasi akan disediakan pemilik riset.</p></div>
      </section>

      <section className="strategies-section"><div className="section-heading"><span className="section-kicker">POLA YANG BISA MUNCUL</span><h2>10 Cara Saat Kita<br/>Mengelola Emosi</h2><p>Setiap strategi ditampilkan sebagai dimensi terpisah, tanpa label baik atau buruk.</p></div><div className="strategy-grid">{strategies.map((s)=><article className={`strategy-card ${s.color}`} key={s.id}><span className="strategy-no">{String(s.id).padStart(2,"0")}</span><div className="strategy-symbol">{s.id%3===0?"◎":s.id%2===0?"↗":"✦"}</div><h3>{s.name}</h3><p>{s.short}</p></article>)}</div></section>

      <section className="journey-section"><div className="section-heading centered"><span className="section-kicker">CARA KERJA</span><h2>Cuma Beberapa Langkah untuk<br/>Mengenal Pola Emosimu.</h2></div><div className="journey-line">{[["01","Buat akun","Simpan progresmu dengan aman."],["02","Lengkapi biodata","Beri konteks secukupnya."],["03","Isi ERQ-30","Jawab satu per satu dengan tenang."],["04","Lihat hasil","Baca tiap dimensi tanpa diagnosis."]].map(([n,t,c],i)=><div className="journey-step" key={n}><span>{i===0?<HeartHandshake/>:i===1?<ScanHeart/>:i===2?<ClipboardCheck/>:<Sprout/>}</span><b>{n}</b><h3>{t}</h3><p>{c}</p></div>)}</div></section>

      <section className="result-section"><div className="demo-chart"><header><p><strong>Gambaran strategimu</strong><span>Data contoh</span></p><b>10 dimensi</b></header>{strategies.slice(0,5).map(s=><div className="demo-bar" key={s.id}><span>{s.name}</span><i><b style={{width:`${s.score}%`}}/></i><strong>{s.score}</strong></div>)}</div><div className="result-copy"><span className="section-kicker">PREVIEW HASIL</span><h2>Bukan Sekadar Angka.</h2><p>Setelah selesai, kamu dapat melihat gambaran strategi regulasi emosi yang muncul dari jawabanmu. Nilai disajikan per dimensi, tanpa diagnosis dan tanpa kategori klinis yang dibuat-buat.</p><div className="neutral-note"><span>i</span><p><strong>Ditampilkan secara netral</strong><small>Nilai di samping hanya data contoh untuk demonstrasi desain.</small></p></div><Link className="secondary-button" href="/app/hasil">Lihat cara membaca hasil <ArrowRight size={18}/></Link></div></section>

      <section className="learning-section"><div className="section-heading"><span className="section-kicker">BELAJAR BERSAMA EMORA</span><h2>Pelajari Emosi dengan<br/>Cara yang Lebih Ringan.</h2></div><div className="poster-grid">{materials.slice(0,3).map((m,i)=><Link className={`article-poster ${m.color}`} href={`/materi/${m.slug}`} key={m.slug}><span>{m.category} · {m.read}</span><div className="poster-doodle">{i===0?"⌁":i===1?"◎":"↗"}</div><h3>{m.title}</h3><p>{m.intro}</p><b>Baca materi <ArrowRight size={16}/></b></Link>)}</div><Link className="text-link" href="/materi">Lihat semua materi <ArrowRight size={17}/></Link></section>

      <section className="final-cta"><div><span>Yuk, mulai dari rasa ingin tahu.</span><h2>Siap Mengenal Cara Kamu<br/>Mengelola Emosi?</h2><p>Luangkan beberapa menit untuk mengenal pola regulasi emosimu melalui ERQ-30.</p><Link className="primary-button" href="/register"><Rocket size={19}/>Mulai Pengukuran<ArrowRight size={18}/></Link></div><div className="cta-art"><span>⌣</span><i/><b>kenali<br/>dirimu</b></div></section>
      <Footer />
    </main>
  );
}
