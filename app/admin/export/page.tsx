import { ExportPanel } from "@/components/client";
import { DashboardShell } from "@/components/emora";
export default function Export(){return <DashboardShell admin active="/admin/export" title="Export Data" description="Siapkan berkas sesuai kebutuhan analisis tim riset."><ExportPanel/></DashboardShell>}
