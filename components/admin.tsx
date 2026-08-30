export function StatusBadge({status}:{status:string}){return <span className={`status-badge ${status==="Selesai"?"done":status==="Berlangsung"?"ongoing":"idle"}`}>{status}</span>}
export function AdminPageNote({children}:{children:React.ReactNode}){return <div className="admin-note"><span>i</span><p>{children}</p></div>}
