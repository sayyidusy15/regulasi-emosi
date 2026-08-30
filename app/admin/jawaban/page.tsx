import { AdminResponses } from "@/components/admin-client";
import { DashboardShell } from "@/components/emora";

export default function Jawaban(){return <DashboardShell admin active="/admin/jawaban" title="Jawaban Mentah" description="Telusuri respons Q01–Q30 dari Google Sheets."><AdminResponses/></DashboardShell>}
