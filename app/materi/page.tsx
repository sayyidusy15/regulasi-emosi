import Link from "next/link";
import { ArrowRight, BookHeart, Brain, Route, ShieldCheck } from "lucide-react";
import { Footer, PublicNavbar } from "@/components/emora";
import { getPublishedMaterials } from "@/lib/materials";

export const dynamic="force-dynamic";
const icons=[BookHeart,Brain,Route,ShieldCheck];
const colors=["coral","lavender","mint","yellow"];

export default async function Materi(){
  const materials=await getPublishedMaterials();
  return <main className="site-shell inner-public"><PublicNavbar active="materi"/><header className="material-hero"><span className="section-kicker">PUSTAKA EMORA</span><h1>Pelajari Emosi dengan<br/><span>Rasa Ingin Tahu.</span></h1><p>Penjelasan ringan dan bertanggung jawab untuk menemani kamu memahami proses emosi—tanpa menggurui.</p><div className="material-hero-art"><span>⌁</span><i/><b>bacanya<br/>pelan-pelan</b></div></header><section className="material-list"><div className="material-filter"><button className="active">Materi diterbitkan</button></div>{materials.length?<div className="material-grid">{materials.map((material,index)=>{const Icon=icons[index%icons.length];return <Link className={`material-card ${colors[index%colors.length]}`} href={`/materi/${material.slug}`} key={material.id}><header><span>{String(index+1).padStart(2,"0")}</span><b>Materi</b></header><div className="poster-doodle"><Icon/></div><h2>{material.title}</h2><p>{material.summary}</p><footer><span>Dikelola melalui Google Sheets</span><b>Baca <ArrowRight size={16}/></b></footer></Link>})}</div>:<div className="empty-state"><div><h3>Belum ada materi diterbitkan.</h3><p>Silakan kembali lagi setelah pengelola menerbitkan materi dari Google Sheets.</p></div></div>}</section><Footer/></main>
}
