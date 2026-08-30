import { AdminUserDetail } from "@/components/admin-client";
import { DashboardShell } from "@/components/emora";

export default async function UserDetailPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  return <DashboardShell admin active="/admin/pengguna" title="Detail Pengguna" description="Biodata, riwayat assessment, dan hasil responden."><AdminUserDetail userId={id}/></DashboardShell>;
}
