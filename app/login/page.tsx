import { AuthForm } from "@/components/client";
import { EmoraLogo } from "@/components/emora";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Login({searchParams}:{searchParams:Promise<{next?:string}>}){const user=await getCurrentUser();if(user)redirect(user.role==="admin"?"/admin":"/app");const {next=""}=await searchParams;return <main className="auth-page"><section className="auth-story"><EmoraLogo/><div className="auth-art"><span>⌣</span><i/><b>Pelan-pelan,<br/>kamu tidak harus<br/>memahami semuanya<br/>sekaligus.</b></div><p>Masuk untuk melanjutkan pengukuran dan melihat materi yang sudah kamu simpan.</p></section><section className="auth-panel"><div><span className="section-kicker">SELAMAT DATANG LAGI</span><h1>Masuk ke Emora</h1><p>Lanjutkan perjalanan mengenal pola emosimu.</p><AuthForm nextPath={next}/></div></section></main>}
