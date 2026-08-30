import { UserDashboardContent } from "@/components/client";
import { DashboardShell } from "@/components/emora";
import { requirePageUser } from "@/lib/session";

export default async function UserDashboard(){const user=await requirePageUser("user");return <DashboardShell active="/app" title={`Halo, ${user.name.split(" ")[0]} 👋`} description="Yuk lihat progres pengukuranmu."><UserDashboardContent/></DashboardShell>}
