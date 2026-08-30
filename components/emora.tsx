import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, FileBarChart, Home, LayoutDashboard, Menu, Sparkles, UserRound, UsersRound } from "lucide-react";
import { SessionProfile } from "@/components/client";

export function EmoraLogo({admin=false}:{admin?:boolean}) {
  return <Link href={admin?"/admin":"/"} className="brand" aria-label={admin?"Emora Admin":"Emora, beranda"}>
    <span className="brand-mark" aria-hidden="true"><span className="heart-left"/><span className="heart-right"/><span className="smile"/></span>
    <span>Emora{admin&&<small>Admin</small>}</span>
  </Link>;
}

export function PublicNavbar({active=""}:{active?:string}) {
  return <header className="public-nav">
    <EmoraLogo />
    <nav aria-label="Navigasi utama">
      <Link className={active==="home"?"active":""} href="/">Beranda</Link>
      <Link className={active==="regulasi"?"active":""} href="/#regulasi">Regulasi Emosi</Link>
      <Link className={active==="erq"?"active":""} href="/#erq30">ERQ-30</Link>
      <Link className={active==="materi"?"active":""} href="/materi">Materi</Link>
    </nav>
    <div className="nav-actions"><Link className="login-link" href="/login">Masuk</Link><Link className="nav-cta" href="/register">Mulai Pengukuran <Sparkles size={16}/></Link></div>
    <details className="mobile-menu"><summary aria-label="Buka menu"><Menu/></summary><div><Link href="/">Beranda</Link><Link href="/#regulasi">Regulasi Emosi</Link><Link href="/#erq30">ERQ-30</Link><Link href="/materi">Materi</Link><Link href="/login">Masuk</Link></div></details>
  </header>;
}

export function Footer(){return <footer className="footer"><div><EmoraLogo/><p>Ruang hangat untuk mengenal cara kita mengelola emosi.</p></div><div className="footer-links"><Link href="/">Beranda</Link><Link href="/#regulasi">Regulasi Emosi</Link><Link href="/#erq30">ERQ-30</Link><Link href="/materi">Materi</Link><Link href="/login">Masuk</Link></div><p className="disclaimer">Emora digunakan untuk tujuan edukasi dan pengukuran, bukan diagnosis klinis.</p></footer>}

const userLinks = [
  ["/app", "Ringkasan", LayoutDashboard], ["/app/pengukuran", "Pengukuran", ClipboardList],
  ["/app/hasil", "Hasil", FileBarChart], ["/materi", "Materi", BookOpen], ["/app/biodata", "Biodata", UserRound],
] as const;
const adminLinks = [
  ["/admin", "Ringkasan", Home], ["/admin/pengguna", "Pengguna", UsersRound],
  ["/admin/instrumen", "Instrumen", ClipboardList], ["/admin/jawaban", "Jawaban mentah", FileBarChart],
  ["/admin/hasil", "Hasil", LayoutDashboard], ["/admin/export", "Export data", ArrowRight],
] as const;

export function DashboardShell({children,active,admin=false,title,description}:{children:React.ReactNode;active:string;admin?:boolean;title:string;description?:string}){
  const links=admin?adminLinks:userLinks;
  return <div className={`dashboard-shell ${admin?"admin-mode":""}`}>
    <aside className="sidebar"><EmoraLogo admin={admin}/><nav>{links.map(([href,label,Icon])=><Link key={href} className={active===href?"active":""} href={href}><Icon size={19}/>{label}</Link>)}</nav><SessionProfile admin={admin}/></aside>
    <main className="dashboard-main"><header className="dashboard-header"><div><small>{admin?"RUANG PENELITI":"RUANG KAMU"}</small><h1>{title}</h1>{description&&<p>{description}</p>}</div></header>{children}</main>
    <nav className="bottom-nav">{links.slice(0,5).map(([href,label,Icon])=><Link key={href} className={active===href?"active":""} href={href}><Icon size={20}/><span>{label.split(" ")[0]}</span></Link>)}</nav>
  </div>
}

export function PageIntro({eyebrow,title,copy}:{eyebrow:string;title:string;copy:string}){return <div className="page-intro"><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>}

export function EmptyState({title="Belum ada pengukuran.",copy="Mulai pengukuran untuk melihat gambaran strategi regulasi emosimu."}:{title?:string;copy?:string}){return <div className="empty-state"><span className="empty-face">⌣</span><div><h3>{title}</h3><p>{copy}</p></div></div>}
