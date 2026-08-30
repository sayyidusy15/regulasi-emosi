import { AdminResults } from "@/components/admin-client";
import { DashboardShell } from "@/components/emora";

export default function AdminHasil(){return <DashboardShell admin active="/admin/hasil" title="Hasil Pengukuran" description="Bandingkan sepuluh subskala per responden secara bertanggung jawab."><AdminResults/></DashboardShell>}
