import { ArrowRight, MoreHorizontal } from "lucide-react";
import { SearchFilter } from "./client";
import { users } from "@/data/emora";

export function StatusBadge({status}:{status:string}){return <span className={`status-badge ${status==="Selesai"?"done":status==="Berlangsung"?"ongoing":"idle"}`}>{status}</span>}
export function UsersTable(){return <div className="table-card"><SearchFilter/><div className="table-scroll"><table><thead><tr><th>ID</th><th>Nama</th><th>Usia</th><th>Jenis kelamin</th><th>Status</th><th>Tanggal mengisi</th><th>Aksi</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><strong>{u.id}</strong></td><td>{u.name}</td><td>{u.age}</td><td>{u.gender}</td><td><StatusBadge status={u.status}/></td><td>{u.date}</td><td><button aria-label={`Aksi ${u.name}`}><MoreHorizontal/></button></td></tr>)}</tbody></table></div><footer><span>Menampilkan 1–6 dari 24</span><div><button disabled>←</button><button>1</button><button>2</button><button>3</button><button>→</button></div></footer></div>}
export function AdminPageNote({children}:{children:React.ReactNode}){return <div className="admin-note"><span>i</span><p>{children}</p></div>}
