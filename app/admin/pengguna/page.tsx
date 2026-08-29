import { UsersTable } from "@/components/admin";
import { DashboardShell } from "@/components/emora";
export default function Pengguna(){return <DashboardShell admin active="/admin/pengguna" title="Data Pengguna" description="Kelola biodata dan status pengukuran responden."><UsersTable/></DashboardShell>}
