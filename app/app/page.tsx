import { UserDashboardContent } from "@/components/client";
import { DashboardShell } from "@/components/emora";

export default function UserDashboard(){return <DashboardShell active="/app" title="Ruang Kamu" description="Lihat progres pengukuranmu hari ini."><UserDashboardContent/></DashboardShell>}
