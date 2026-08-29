import { AuthForm } from "@/components/client";
import { EmoraLogo } from "@/components/emora";

export default function AdminLogin(){return <main className="auth-page admin-login"><section className="auth-story"><EmoraLogo admin/><div className="auth-art restrained"><span>◎</span><i/><b>Ruang kerja yang rapi<br/>untuk data pengukuran<br/>yang bertanggung jawab.</b></div><p>Akses admin diberikan secara aman oleh pengelola sistem. Tidak tersedia pendaftaran publik.</p></section><section className="auth-panel"><div><span className="section-kicker">AKSES TERBATAS</span><h1>Masuk sebagai Admin</h1><p>Gunakan akun peneliti atau pengelola yang telah terdaftar.</p><AuthForm admin/></div></section></main>}
