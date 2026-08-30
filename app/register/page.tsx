import { AuthForm } from "@/components/client";
import { EmoraLogo } from "@/components/emora";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Register(){const user=await getCurrentUser();if(user)redirect(user.role==="admin"?"/admin":"/app");return <main className="auth-page register-page"><section className="auth-story"><EmoraLogo/><div className="auth-art"><span>✦</span><i/><b>Satu langkah kecil<br/>untuk lebih mengenal<br/>cara kamu merespons.</b></div><ul><li>Progres tersimpan otomatis</li><li>Hasil per strategi</li><li>Materi yang mudah dibaca</li></ul></section><section className="auth-panel"><div><span className="section-kicker">MULAI BERSAMA EMORA</span><h1>Buat akunmu</h1><p>Isi data berikut. Tidak perlu terburu-buru.</p><AuthForm register/></div></section></main>}
