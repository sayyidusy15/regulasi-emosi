import { Questionnaire } from "@/components/client";
import { DashboardShell } from "@/components/emora";

export default function Pengukuran(){return <DashboardShell active="/app/pengukuran" title="Pengukuran ERQ-30" description="Pilih jawaban yang paling menggambarkan dirimu."><Questionnaire/></DashboardShell>}
