"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Download, Eye, EyeOff, ExternalLink, LogOut, Save, ShieldCheck } from "lucide-react";
import { likert } from "@/data/erq30";
import type { Answers } from "@/lib/scoring";
import type { ErqResult } from "@/lib/apps-script";

type ApiEnvelope<T> = { ok: true; data: T } | { ok: false; error: string };
async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const result = await response.json() as ApiEnvelope<T>;
  if (!response.ok || !result.ok) throw new Error(result.ok ? "Permintaan gagal." : result.error);
  return result.data;
}

export function AuthForm({register=false,admin=false}:{register?:boolean;admin?:boolean}){
  const [show,setShow]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setBusy(true); setError("");
    const form=new FormData(event.currentTarget); const password=String(form.get("password")||"");
    if(register&&password!==String(form.get("confirmation")||"")){setError("Konfirmasi password belum sama.");setBusy(false);return}
    try{await api(register?"/api/auth/register":"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.get("name"),email:form.get("email"),password,admin})});window.location.assign(admin?"/admin":"/app")}
    catch(reason){setError(reason instanceof Error?reason.message:"Tidak dapat masuk.");setBusy(false)}
  }
  return <form className="auth-form" onSubmit={submit}>
    {register&&<label>Nama lengkap<input name="name" placeholder="Nama kamu" autoComplete="name" required/></label>}
    <label>Email<input name="email" type="email" placeholder={admin?"admin@emora.id":"nama@email.com"} autoComplete="email" required/></label>
    <label>Password<span className="password-wrap"><input name="password" type={show?"text":"password"} placeholder="Minimal 8 karakter" minLength={8} autoComplete={register?"new-password":"current-password"} required/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Sembunyikan password":"Tampilkan password"}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>
    {register&&<label>Konfirmasi password<input name="confirmation" type="password" placeholder="Ulangi password" minLength={8} autoComplete="new-password" required/></label>}
    {!register&&!admin&&<div className="form-helper"><label className="check-label"><input type="checkbox"/> Ingat saya</label></div>}
    {error&&<p className="form-message error" role="alert">{error}</p>}
    <button className={`primary-button ${admin?"admin-button":""}`} type="submit" disabled={busy}>{busy?"Memproses...":register?"Buat Akun":"Masuk"}<ArrowRight size={19}/></button>
    {!admin&&<p className="auth-swap">{register?"Sudah punya akun?":"Belum punya akun?"} <a href={register?"/login":"/register"}>{register?"Masuk":"Daftar"}</a></p>}
  </form>
}

type Biodata = {nama:string;usia:string;jenis_kelamin:string;pendidikan:string;pekerjaan:string;domisili:string};
const emptyBiodata:Biodata={nama:"",usia:"",jenis_kelamin:"",pendidikan:"",pekerjaan:"",domisili:""};
export function BiodataForm(){
  const [step,setStep]=useState(1); const [data,setData]=useState(emptyBiodata); const [busy,setBusy]=useState(false); const [message,setMessage]=useState("");
  useEffect(()=>{api<{user:{name:string};biodata:Partial<Biodata>|null}>("/api/biodata").then(result=>setData({...emptyBiodata,nama:result.user.name,...(result.biodata||{})})).catch(reason=>setMessage(reason.message))},[]);
  const field=(key:keyof Biodata,value:string)=>setData(current=>({...current,[key]:value}));
  async function save(){setBusy(true);setMessage("");try{await api("/api/biodata",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});setMessage("Biodata berhasil disimpan.")}catch(reason){setMessage(reason instanceof Error?reason.message:"Biodata gagal disimpan.")}finally{setBusy(false)}}
  return <div className="form-card"><div className="stepper"><div><span style={{width:`${step*50}%`}}/></div><strong>Langkah {step} dari 2</strong></div>{step===1?<div className="form-grid"><label>Nama lengkap<input value={data.nama} onChange={e=>field("nama",e.target.value)}/></label><label>Usia<input type="number" min="12" max="120" value={data.usia} onChange={e=>field("usia",e.target.value)}/></label><label>Jenis kelamin<select value={data.jenis_kelamin} onChange={e=>field("jenis_kelamin",e.target.value)}><option value="">Pilih</option><option>Perempuan</option><option>Laki-laki</option><option>Memilih tidak menjawab</option></select></label><label>Domisili<input value={data.domisili} onChange={e=>field("domisili",e.target.value)}/></label></div>:<div className="form-grid"><label>Pendidikan<select value={data.pendidikan} onChange={e=>field("pendidikan",e.target.value)}><option value="">Pilih</option><option>SMA / sederajat</option><option>D3</option><option>S1</option><option>S2</option><option>S3</option><option>Lainnya</option></select></label><label>Pekerjaan<input value={data.pekerjaan} onChange={e=>field("pekerjaan",e.target.value)}/></label><div className="privacy-note"><ShieldCheck/><p><strong>Datamu kami perlakukan dengan hati-hati.</strong><span>Informasi ini digunakan sesuai kebutuhan pengukuran dan tidak ditampilkan ke pengguna lain.</span></p></div></div>}{message&&<p className={`form-message ${message.includes("berhasil")?"success":"error"}`} role="status">{message}</p>}<div className="form-actions">{step===2&&<button className="secondary-button" onClick={()=>setStep(1)}><ArrowLeft size={18}/>Kembali</button>}<button className="primary-button" disabled={busy} onClick={()=>step===1?setStep(2):save()}>{busy?"Menyimpan...":step===1?"Lanjut":"Simpan biodata"}{step===1?<ArrowRight size={18}/>:<Save size={18}/>}</button></div></div>
}

type ApiQuestion={id:string;question_number:number;question_text_en:string;question_text_id:string;strategy:string;scale_min:number;scale_max:number;translation_status:string};
type StartAssessment={assessment:{id:string;status:string};answers:Record<string,number>;questions:ApiQuestion[]};
const serializeAnswers=(answers:Answers)=>Object.fromEntries(Object.entries(answers).map(([key,value])=>[`Q${String(key).padStart(2,"0")}`,value]));
export function Questionnaire(){
  const [index,setIndex]=useState(0); const [answers,setAnswers]=useState<Answers>({}); const [questions,setQuestions]=useState<ApiQuestion[]>([]); const [assessmentId,setAssessmentId]=useState("");
  const [review,setReview]=useState(false); const [sent,setSent]=useState(false); const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const [saveState,setSaveState]=useState("Tersimpan otomatis");
  useEffect(()=>{api<StartAssessment>("/api/assessment/start",{method:"POST"}).then(result=>{setAssessmentId(result.assessment.id);setQuestions(result.questions);setAnswers(Object.fromEntries(Object.entries(result.answers).map(([key,value])=>[Number(key.slice(1)),value])));if(result.assessment.status==="completed")setSent(true)}).catch(reason=>setError(reason.message)).finally(()=>setLoading(false))},[]);
  useEffect(()=>{if(!assessmentId||loading||sent)return;const timer=window.setTimeout(()=>{setSaveState("Menyimpan...");api("/api/assessment/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({assessmentId,answers:serializeAnswers(answers)})}).then(()=>setSaveState("Tersimpan otomatis")).catch(()=>setSaveState("Gagal menyimpan — coba pilih kembali"))},600);return()=>window.clearTimeout(timer)},[answers,assessmentId,loading,sent]);
  const answered=Object.keys(answers).length; const progress=Math.round((answered/30)*100); const q=questions[index];
  async function submit(){setError("");try{await api("/api/assessment/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({assessmentId,answers:serializeAnswers(answers)})});setSent(true)}catch(reason){setError(reason instanceof Error?reason.message:"Jawaban gagal dikirim.")}}
  if(loading)return <div className="submitted-state"><p>Menyiapkan instrumen…</p></div>;
  if(error&&!assessmentId)return <div className="submitted-state"><h2>Pengukuran belum dapat dibuka.</h2><p>{error}</p></div>;
  if(sent)return <div className="submitted-state"><CheckCircle2/><h2>Jawabanmu sudah terkirim.</h2><p>Hasil sepuluh subskala ERQ-30 kini siap dilihat.</p><a className="primary-button" href="/app/hasil">Lihat hasil<ArrowRight size={18}/></a></div>;
  if(questions.length!==30)return <div className="submitted-state"><ShieldCheck/><h2>Instrumen belum siap digunakan.</h2><p>Admin perlu mengisi 30 butir ERQ-30 yang telah disetujui di sheet Questions, lalu mengaktifkannya. Emora tidak membuat atau menerjemahkan redaksi instrumen sendiri.</p></div>;
  if(review)return <div className="review-card"><span className="review-check"><Check/></span><h2>{answered===30?"Semua sudah terisi.":`${30-answered} jawaban belum terisi.`}</h2><p><strong>{answered} / 30</strong> jawaban lengkap. Kamu masih bisa memeriksa jawaban sebelum dikirim.</p><div className="review-grid">{questions.map((item,i)=><button key={item.id} className={answers[item.question_number]?"done":""} onClick={()=>{setIndex(i);setReview(false)}}>{String(item.question_number).padStart(2,"0")} {answers[item.question_number]&&<Check size={13}/>}</button>)}</div>{error&&<p className="form-message error">{error}</p>}<div className="form-actions"><button className="secondary-button" onClick={()=>setReview(false)}>Kembali periksa</button><button disabled={answered<30} className="primary-button" onClick={submit}>Kirim jawaban<ArrowRight size={18}/></button></div></div>;
  return <div className="questionnaire-wrap"><div className="question-top"><div><span>Pertanyaan {String(index+1).padStart(2,"0")} / 30</span><small>{saveState}</small></div><div className="question-progress"><i style={{width:`${Math.max(progress,3)}%`}}/></div></div><AnimatePresence mode="wait"><motion.section key={q.id} className="question-card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}><span className="question-number">{String(q.question_number).padStart(2,"0")}</span><h2 lang="id">{q.question_text_id||q.question_text_en}</h2>{q.question_text_id&&<details className="original-question"><summary>Lihat versi asli</summary><p lang="en">{q.question_text_en}</p></details>}<fieldset><legend>Pilih jawaban yang paling sesuai dengan dirimu.</legend><div className="likert-labels"><span>1 — {likert.labels[1]}</span><span>4 — {likert.labels[4]}</span><span>7 — {likert.labels[7]}</span></div><div className="likert-scale">{Array.from({length:7},(_,i)=>i+1).map(value=><label key={value} className={answers[q.question_number]===value?"selected":""}><input type="radio" name={`q-${q.question_number}`} value={value} checked={answers[q.question_number]===value} onChange={()=>setAnswers(current=>({...current,[q.question_number]:value}))}/><span>{value}</span></label>)}</div></fieldset></motion.section></AnimatePresence><div className="question-actions"><button className="secondary-button" disabled={index===0} onClick={()=>setIndex(index-1)}><ArrowLeft size={18}/>Sebelumnya</button><button className="text-button" onClick={()=>setReview(true)}>Tinjau jawaban ({answered}/30)</button><button className="primary-button" disabled={!answers[q.question_number]} onClick={()=>index===29?setReview(true):setIndex(index+1)}>{index===29?"Tinjau":"Berikutnya"}<ArrowRight size={18}/></button></div></div>
}

const categoryLabel={high:"Tinggi",average:"Rata-rata",low:"Rendah"};
export function ResultView(){
  const [result,setResult]=useState<ErqResult|null|undefined>(undefined); const [error,setError]=useState("");
  useEffect(()=>{api<ErqResult|null>("/api/result").then(setResult).catch(reason=>setError(reason.message))},[]);
  if(error)return <div className="empty-state"><div><h3>Hasil belum dapat dimuat.</h3><p>{error}</p></div></div>;
  if(result===undefined)return <div className="empty-state"><div><h3>Memuat hasil…</h3></div></div>;
  if(!result)return <div className="empty-state"><div><h3>Belum ada hasil pengukuran.</h3><p>Selesaikan 30 pertanyaan untuk melihat gambaran sepuluh subskala.</p></div></div>;
  return <div className="results-page"><div className="demo-banner"><ShieldCheck/><p><strong>Hasil per subskala, bukan skor keseluruhan.</strong><span>Setiap skor adalah jumlah tiga butir dan berada pada rentang 3–21.</span></p></div><section className="result-overview"><div className="result-ring"><div><b>10</b><span>subskala</span></div></div><div><span className="section-kicker">RINGKASAN</span><h2>Setiap strategi dibaca secara terpisah.</h2><p>Kategori menunjukkan posisi relatif terhadap sampel normatif, bukan diagnosis dan bukan penilaian baik atau buruk.</p></div></section><section className="all-results"><header><div><span className="section-kicker">RINCIAN STRATEGI</span><h2>Skor ERQ-30</h2></div></header>{result.strategies.map((strategy,index)=><article key={strategy.key}><span className={`result-index ${["coral","yellow","mint","sky","lavender"][index%5]}`}>{String(index+1).padStart(2,"0")}</span><div><h3>{strategy.label}</h3><p>Mean {strategy.mean.toFixed(2)} · SD {strategy.sd.toFixed(2)} · {categoryLabel[strategy.category]}</p><i><b style={{width:`${((strategy.score-3)/18)*100}%`}}/></i></div><strong>{strategy.score}<small>/21</small></strong></article>)}</section><div className="neutral-note norm-note"><span>i</span><p><strong>Sumber norma</strong><small>Kategori menggunakan sampel normatif orang dewasa komunitas umum Amerika Serikat dari dokumentasi resmi ERQ-30. Ini bukan norma populasi Indonesia.</small></p></div></div>
}

export function ExportPanel(){
  const [type,setType]=useState("combined"); const [sheetUrl,setSheetUrl]=useState("");
  useEffect(()=>{api<{spreadsheetUrl:string}>("/api/admin/dashboard").then(data=>setSheetUrl(data.spreadsheetUrl)).catch(()=>{})},[]);
  const labels:Record<string,string>={biodata:"Data Biodata",responses:"Jawaban Mentah",results:"Hasil ERQ-30",combined:"Dataset Gabungan"};
  return <div className="export-panel"><section><h2>Pilih data</h2><div className="option-grid">{Object.entries(labels).map(([key,label])=><button onClick={()=>setType(key)} className={type===key?"selected":""} key={key}><span>{type===key&&<Check/>}</span><strong>{label}</strong><small>{key==="combined"?"Biodata, Q01–Q30, dan sepuluh hasil dalam satu CSV":"Data langsung dari Google Sheets"}</small></button>)}</div></section><section><h2>Format berkas</h2><div className="export-controls"><label>Format<select value="CSV" disabled><option>CSV</option></select></label></div></section><div className="export-summary"><p><strong>{labels[type]}</strong><span>CSV siap dianalisis di Excel, SPSS, R, atau Python</span></p><div className="export-actions">{sheetUrl&&<a className="secondary-button" href={sheetUrl} target="_blank" rel="noreferrer">Buka di Google Sheets <ExternalLink size={17}/></a>}<a className="primary-button" href={`/api/admin/export?kind=${type}`}><Download size={18}/>Export CSV</a></div></div></div>
}

type ProfileData={user:{name:string;email:string;role:string};biodata:Partial<Biodata>|null;assessment:{id:string;status:string}|null};
export function UserDashboardContent(){
  const [profile,setProfile]=useState<ProfileData>(); const [error,setError]=useState("");
  useEffect(()=>{api<ProfileData>("/api/profile").then(setProfile).catch(reason=>setError(reason.message))},[]);
  if(!profile)return <div className="empty-state"><div><h3>{error?"Data belum dapat dimuat.":"Menyiapkan ruangmu…"}</h3>{error&&<p>{error}</p>}</div></div>;
  const completed=profile.assessment?.status==="completed"; const inProgress=profile.assessment?.status==="in_progress";
  return <div className="dashboard-grid"><section className="assessment-card"><div><span className={`status-badge ${completed?"done":inProgress?"ongoing":"idle"}`}>{completed?"Selesai":inProgress?"Sedang dikerjakan":"Belum mulai"}</span><h2>Pengukuran ERQ-30</h2><p>30 pertanyaan · progres tersimpan otomatis ke Google Sheets</p></div><Link className="primary-button" href={completed?"/app/hasil":"/app/pengukuran"}>{completed?"Lihat hasil":inProgress?"Lanjutkan pengukuran":"Mulai pengukuran"}<ArrowRight size={18}/></Link><span className="card-doodle">⌁</span></section><section className="profile-progress"><header><h2>Biodata</h2><span>{profile.biodata?"Lengkap":"Belum lengkap"}</span></header><p>{profile.biodata?"Informasi penelitianmu sudah tersimpan.":"Lengkapi informasi yang dibutuhkan penelitian."}</p><Link href="/app/biodata">{profile.biodata?"Perbarui biodata":"Lengkapi biodata"} <ArrowRight size={16}/></Link></section><section className="material-pick"><span className="material-icon"><BookOpen/></span><div><small>MATERI EMORA</small><h2>Memahami emosi tanpa menghakimi diri.</h2><p>Baca materi yang diterbitkan pengelola riset.</p><Link href="/materi">Lihat materi <ArrowRight size={16}/></Link></div></section><section className="calm-note"><CheckCircle2/><p><strong>Tidak perlu sempurna.</strong><span>Jawab sesuai keadaanmu—tidak ada jawaban benar atau salah.</span></p></section></div>
}

export function SessionProfile({admin=false}:{admin?:boolean}){
  const [user,setUser]=useState<{name:string;email:string}>();
  useEffect(()=>{api<ProfileData>("/api/profile").then(data=>setUser(data.user)).catch(()=>{})},[]);
  async function logout(){try{await api("/api/auth/logout",{method:"POST"})}finally{window.location.assign(admin?"/admin/login":"/login")}}
  const name=user?.name||(admin?"Admin Riset":"Pengguna Emora"); const initials=name.split(" ").map(word=>word[0]).join("").slice(0,2).toUpperCase();
  return <div className="sidebar-profile"><span>{initials}</span><p><strong>{name}</strong><small>{user?.email||"Sesi aktif"}</small></p><button type="button" onClick={logout} aria-label="Keluar"><LogOut size={18}/></button></div>
}

export function SearchFilter(){const [q,setQ]=useState("");const count=useMemo(()=>q?"Hasil tersaring":"Semua responden",[q]);return <div className="filter-bar"><input aria-label="Cari responden" placeholder="Cari ID atau nama..." value={q} onChange={e=>setQ(e.target.value)}/><select aria-label="Filter status"><option>Semua status</option><option>Selesai</option><option>Berlangsung</option></select><span>{count}</span></div>}
