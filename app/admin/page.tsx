import { AdminDashboard } from "@/components/admin-client";
import { DashboardShell } from "@/components/emora";

export default function Admin(){return <DashboardShell admin active="/admin" title="Ringkasan Pengukuran" description="Pantau aktivitas responden tanpa kehilangan konteks."><AdminDashboard/></DashboardShell>}
