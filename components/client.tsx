"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Download, Eye, EyeOff, Save, ShieldCheck } from "lucide-react";
import { likert, questions } from "@/data/erq30";
import type { Answers } from "@/lib/scoring";

export function AuthForm({register=false,admin=false}:{register?:boolean;admin?:boolean}){
  const [show,setShow]=useState(false);
  return <form className="auth-form" onSubmit={e=>e.preventDefault()}>
    {register&&<label>Nama lengkap<input placeholder="Nama kamu" autoComplete="name"/></label>}
    <label>Email<input type="email" placeholder={admin?"admin@emora.id":"nama@email.com"} autoComplete="email"/></label>
    <label>Password<span className="password-wrap"><input type={show?"text":"password"} placeholder="Minimal 8 karakter" autoComplete={register?"new-password":"current-password"}/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Sembunyikan password":"Tampilkan password"}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>
    {register&&<label>Konfirmasi password<input type="password" placeholder="Ulangi password" autoComplete="new-password"/></label>}
    {!register&&!admin&&<div className="form-helper"><label className="check-label"><input type="checkbox"/> Ingat saya</label><a href="#">Lupa password?</a></div>}
    <button className={`primary-button ${admin?"admin-button":""}`} type="submit">{register?"Buat Akun":"Masuk"}<ArrowRight size={19}/></button>
    <p className="auth-swap">{register?"Sudah punya akun?":"Belum punya akun?"} <a href={register?"/login":"/register"}>{register?"Masuk":"Daftar"}</a></p>
  </form>
}

export function BiodataForm(){
  const [step,setStep]=useState(1);
  return <div className="form-card"><div className="stepper"><div><span style={{width:`${step*50}%`}}/></div><strong>Langkah {step} dari 2</strong></div>{step===1?<div className="form-grid"><label>Nama lengkap<input defaultValue="Nadia Putri"/></label><label>Usia<input type="number" defaultValue="23"/></label><label>Jenis kelamin<select defaultValue="Perempuan"><option>Perempuan</option><option>Laki-laki</option><option>Memilih tidak menjawab</option></select></label><label>Domisili<input defaultValue="Bandung"/></label></div>:<div className="form-grid"><label>Pendidikan<select defaultValue="S1"><option>SMA / sederajat</option><option>D3</option><option>S1</option><option>S2</option></select></label><label>Pekerjaan<input defaultValue="Mahasiswa"/></label><div className="privacy-note"><ShieldCheck/><p><strong>Datamu kami perlakukan dengan hati-hati.</strong><span>Informasi ini digunakan sesuai kebutuhan pengukuran dan tidak ditampilkan ke pengguna lain.</span></p></div></div>}<div className="form-actions">{step===2&&<button className="secondary-button" onClick={()=>setStep(1)}><ArrowLeft size={18}/>Kembali</button>}<button className="primary-button" onClick={()=>setStep(step===1?2:2)}>{step===1?"Lanjut":"Simpan biodata"}{step===1?<ArrowRight size={18}/>:<Save size={18}/>}</button></div></div>
}

export function Questionnaire(){
  const [index,setIndex]=useState(0); const [answers,setAnswers]=useState<Answers>({}); const [review,setReview]=useState(false); const [sent,setSent]=useState(false);
  useEffect(()=>{try{const saved=localStorage.getItem("emora-answers");if(saved)setAnswers(JSON.parse(saved));}catch{}},[]);
  useEffect(()=>{try{localStorage.setItem("emora-answers",JSON.stringify(answers));}catch{}},[answers]);
  const answered=Object.keys(answers).length; const progress=Math.round((answered/30)*100); const q=questions[index];
  if(sent)return <div className="submitted-state"><CheckCircle2/><h2>Jawabanmu sudah terkirim.</h2><p>Terima kasih sudah meluangkan waktu. Hasil demo kini siap dilihat.</p><a className="primary-button" href="/app/hasil">Lihat hasil<ArrowRight size={18}/></a></div>;
  if(review)return <div className="review-card"><span className="review-check"><Check/></span><h2>{answered===30?"Semua sudah terisi.":`${30-answered} jawaban belum terisi.`}</h2><p><strong>{answered} / 30</strong> jawaban lengkap. Kamu masih bisa memeriksa jawaban sebelum dikirim.</p><div className="review-grid">{questions.map((item,i)=><button key={item.id} className={answers[item.id]?"done":""} onClick={()=>{setIndex(i);setReview(false)}}>{String(item.id).padStart(2,"0")} {answers[item.id]&&<Check size={13}/>}</button>)}</div><div className="form-actions"><button className="secondary-button" onClick={()=>setReview(false)}>Kembali periksa</button><button disabled={answered<30} className="primary-button" onClick={()=>setSent(true)}>Kirim jawaban<ArrowRight size={18}/></button></div></div>;
  return <div className="questionnaire-wrap"><div className="question-top"><div><span>Pertanyaan {String(index+1).padStart(2,"0")} / 30</span><small>Tersimpan otomatis</small></div><div className="question-progress"><i style={{width:`${Math.max(progress,3)}%`}}/></div></div><AnimatePresence mode="wait"><motion.section key={q.id} className="question-card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}><span className="question-number">{String(q.id).padStart(2,"0")}</span><p className="placeholder-note">Placeholder — butir tervalidasi akan disediakan pemilik riset.</p><h2>{q.text}</h2><fieldset><legend>Pilih jawaban yang paling sesuai dengan dirimu.</legend><div className="likert-labels"><span>{likert.startLabel}</span><span>{likert.endLabel}</span></div><div className="likert-scale">{Array.from({length:7},(_,i)=>i+1).map(value=><label key={value} className={answers[q.id]===value?"selected":""}><input type="radio" name={`q-${q.id}`} value={value} checked={answers[q.id]===value} onChange={()=>setAnswers({...answers,[q.id]:value})}/><span>{value}</span></label>)}</div></fieldset></motion.section></AnimatePresence><div className="question-actions"><button className="secondary-button" disabled={index===0} onClick={()=>setIndex(index-1)}><ArrowLeft size={18}/>Sebelumnya</button><button className="text-button" onClick={()=>setReview(true)}>Tinjau jawaban ({answered}/30)</button><button className="primary-button" disabled={!answers[q.id]} onClick={()=>index===29?setReview(true):setIndex(index+1)}>{index===29?"Tinjau":"Berikutnya"}<ArrowRight size={18}/></button></div></div>
}

export function ExportPanel(){
  const [type,setType]=useState("Semua Data"); const [format,setFormat]=useState("CSV");
  const download=()=>{const rows=[["Respondent ID","Status","Tanggal"],["R-1042","Selesai","2026-08-28"],["R-1041","Berlangsung","2026-08-28"]];const blob=new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`emora-${type.toLowerCase().replaceAll(" ","-")}.csv`;a.click();URL.revokeObjectURL(a.href)};
  return <div className="export-panel"><section><h2>Pilih data</h2><div className="option-grid">{["Data Biodata","Jawaban Mentah","Hasil Pengukuran","Semua Data"].map(item=><button onClick={()=>setType(item)} className={type===item?"selected":""} key={item}><span>{type===item&&<Check/>}</span><strong>{item}</strong><small>{item==="Semua Data"?"Seluruh data demo dalam satu berkas":"Data terpilih dari responden"}</small></button>)}</div></section><section><h2>Atur berkas</h2><div className="export-controls"><label>Format<select value={format} onChange={e=>setFormat(e.target.value)}><option>CSV</option><option>XLSX (demo CSV)</option></select></label><label>Dari tanggal<input type="date" defaultValue="2026-08-01"/></label><label>Sampai tanggal<input type="date" defaultValue="2026-08-29"/></label></div></section><div className="export-summary"><p><strong>{type}</strong><span>Format {format} · 1–29 Agustus 2026</span></p><button className="primary-button" onClick={download}><Download size={18}/>Export data</button></div></div>
}

export function SearchFilter(){const [q,setQ]=useState("");const count=useMemo(()=>q?"Hasil tersaring":"6 responden",[q]);return <div className="filter-bar"><input aria-label="Cari responden" placeholder="Cari ID atau nama..." value={q} onChange={e=>setQ(e.target.value)}/><select aria-label="Filter status"><option>Semua status</option><option>Selesai</option><option>Berlangsung</option></select><span>{count}</span></div>}
