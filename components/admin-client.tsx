"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Clock3, ExternalLink, Info, LockKeyhole, UsersRound } from "lucide-react";
import { AdminPageNote, StatusBadge } from "@/components/admin";

type Envelope<T>={ok:true;data:T}|{ok:false;error:string};
function useAdminData<T>(url:string){
  const [data,setData]=useState<T>(); const [error,setError]=useState("");
  useEffect(()=>{fetch(url).then(async response=>{const body=await response.json() as Envelope<T>;if(!response.ok||!body.ok)throw new Error(body.ok?"Permintaan gagal.":body.error);setData(body.data)}).catch(reason=>setError(reason.message))},[url]);
  return {data,error};
}
function LoadState({error}:{error:string}){return <div className="empty-state"><div><h3>{error?"Data belum dapat dimuat.":"Memuat data…"}</h3>{error&&<p>{error}</p>}</div></div>}
const statusLabel:Record<string,string>={completed:"Selesai",in_progress:"Berlangsung",not_started:"Belum mulai"};

type AdminUser={id:string;name:string;email:string;nama?:string;usia?:string;jenis_kelamin?:string;assessment_status:string;updated_at:string};
type DashboardData={totalUsers:number;completed:number;inProgress:number;notStarted:number;spreadsheetUrl:string;recent:AdminUser[]};
export function AdminDashboard(){
  const {data,error}=useAdminData<DashboardData>("/api/admin/dashboard"); if(!data)return <LoadState error={error}/>;
  const total=Math.max(data.totalUsers,1); const completion=Math.round((data.completed/total)*100);
  return <div className="admin-overview"><section className="metric-strip">{[["Total pengguna",String(data.totalUsers),"Responden terdaftar",UsersRound],["Sudah mengisi",String(data.completed),`${completion}% dari pengguna`,ArrowUpRight],["Belum selesai",String(data.inProgress),"Assessment berlangsung",Clock3],["Belum mulai",String(data.notStarted),"Belum ada assessment",ArrowDownRight]].map(([label,value,note,Icon])=><article key={label as string}><span><Icon/></span><p><small>{label as string}</small><strong>{value as string}</strong><b>{note as string}</b></p></article>)}</section><section className="admin-chart"><header><div><h2>Sumber data penelitian</h2><p>Data tersimpan langsung di spreadsheet pemilik riset.</p></div></header><div className="sheet-callout"><p><strong>Google Sheets aktif</strong><span>Periksa, koreksi, atau unduh data dari sumber utama.</span></p><a className="secondary-button" href={data.spreadsheetUrl} target="_blank" rel="noreferrer">Buka Google Sheets <ExternalLink size={17}/></a></div></section><section className="status-breakdown"><header><h2>Status responden</h2><span>Total {data.totalUsers}</span></header><div className="donut"><div><strong>{completion}%</strong><span>Selesai</span></div></div><ul><li><i className="done"/>Selesai <b>{data.completed}</b></li><li><i className="ongoing"/>Berlangsung <b>{data.inProgress}</b></li><li><i className="idle"/>Belum mulai <b>{data.notStarted}</b></li></ul></section><section className="recent-table"><header><h2>Aktivitas terbaru</h2><a href="/admin/pengguna">Lihat semua →</a></header>{data.recent.map(user=><div key={user.id}><span>{user.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</span><p><strong>{user.name}</strong><small>{user.id} · {user.updated_at?new Date(user.updated_at).toLocaleDateString("id-ID"):"Belum mulai"}</small></p><b>{statusLabel[user.assessment_status]}</b></div>)}</section></div>
}

export function AdminUsersTable(){
  const {data,error}=useAdminData<AdminUser[]>("/api/admin/users"); if(!data)return <LoadState error={error}/>;
  return <div className="table-card"><div className="filter-bar"><span>{data.length} responden</span></div><div className="table-scroll"><table><thead><tr><th>ID</th><th>Nama</th><th>Email</th><th>Usia</th><th>Jenis kelamin</th><th>Status</th><th>Aktivitas terakhir</th></tr></thead><tbody>{data.map(user=><tr key={user.id}><td><strong>{user.id}</strong></td><td>{user.nama||user.name}</td><td>{user.email}</td><td>{user.usia||"—"}</td><td>{user.jenis_kelamin||"—"}</td><td><StatusBadge status={statusLabel[user.assessment_status]}/></td><td>{user.updated_at?new Date(user.updated_at).toLocaleString("id-ID"):"—"}</td></tr>)}</tbody></table></div></div>
}

type ResponseRow=Record<string,string|number> & {assessment_id:string;user_id:string;updated_at:string};
export function AdminResponses(){
  const {data,error}=useAdminData<ResponseRow[]>("/api/admin/responses"); if(!data)return <LoadState error={error}/>;
  const questions=Array.from({length:30},(_,i)=>`Q${String(i+1).padStart(2,"0")}`);
  return <><AdminPageNote>Setiap baris adalah satu assessment. Kolom Q01–Q30 disimpan berdampingan agar mudah diperiksa dan dianalisis.</AdminPageNote><div className="table-card raw-table"><div className="filter-bar"><span>{data.length} assessment · 30 kolom jawaban</span></div><div className="table-scroll"><table><thead><tr><th>Respondent ID</th><th>Assessment</th>{questions.map(q=><th key={q}>{q}</th>)}<th>Diperbarui</th></tr></thead><tbody>{data.map(row=><tr key={row.assessment_id}><td><strong>{row.user_id}</strong></td><td>{row.assessment_id}</td>{questions.map(q=><td key={q}>{row[q]||"—"}</td>)}<td>{row.updated_at?new Date(row.updated_at).toLocaleString("id-ID"):"—"}</td></tr>)}</tbody></table></div></div></>
}

type AdminResult={assessmentId:string;userId:string;calculatedAt:string;strategies:Array<{key:string;label:string;score:number;category:string}>};
export function AdminResults(){
  const {data,error}=useAdminData<AdminResult[]>("/api/admin/results"); if(!data)return <LoadState error={error}/>;
  const labels=data[0]?.strategies||[];
  return <><div className="demo-banner"><Info/><p><strong>Skor resmi per subskala.</strong><span>Masing-masing adalah jumlah tiga butir dengan rentang 3–21; tidak ada skor total.</span></p></div><div className="table-card raw-table"><div className="filter-bar"><span>{data.length} hasil</span></div><div className="table-scroll"><table><thead><tr><th>Respondent ID</th><th>Assessment</th>{labels.map(s=><th key={s.key}>{s.label}</th>)}<th>Dihitung</th></tr></thead><tbody>{data.map(result=><tr key={result.assessmentId}><td><strong>{result.userId}</strong></td><td>{result.assessmentId}</td>{result.strategies.map(strategy=><td key={strategy.key}>{strategy.score} · {strategy.category}</td>)}<td>{new Date(result.calculatedAt).toLocaleString("id-ID")}</td></tr>)}</tbody></table></div></div></>
}

type InstrumentRow={id:string;question_number:number;question_text:string;strategy:string;scale_min:number;scale_max:number;is_active:boolean|string};
export function AdminInstrument(){
  const {data,error}=useAdminData<InstrumentRow[]>("/api/admin/instrument"); if(!data)return <LoadState error={error}/>;
  const active=data.filter(item=>item.is_active===true||String(item.is_active).toLowerCase()==="true").length;
  return <><AdminPageNote>Isi redaksi hanya dari dokumen ERQ-30 yang disetujui. Jangan menerjemahkan atau mengarang butir langsung dari dashboard.</AdminPageNote><div className="instrument-summary"><div><strong>{data.length}</strong><span>Slot item</span></div><div><strong>{active}</strong><span>Item aktif</span></div></div><div className="table-card instrument-table"><div className="filter-bar"><span>{active===30?"Instrumen siap digunakan":"Lengkapi dan aktifkan tepat 30 item"}</span></div><div className="table-scroll"><table><thead><tr><th>Nomor</th><th>Item</th><th>Strategi</th><th>Skala</th><th>Status</th></tr></thead><tbody>{data.map(question=>{const active=question.is_active===true||String(question.is_active).toLowerCase()==="true";return <tr key={question.id}><td><strong>Q{String(question.question_number).padStart(2,"0")}</strong></td><td>{question.question_text||"Belum diisi dari instrumen resmi"}</td><td>{question.strategy}</td><td>{question.scale_min}–{question.scale_max}</td><td><span className="locked"><LockKeyhole/>{active?"Aktif":"Nonaktif"}</span></td></tr>})}</tbody></table></div></div></>
}
