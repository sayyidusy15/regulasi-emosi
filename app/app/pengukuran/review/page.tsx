import { AssessmentReview } from "@/components/client";
import { DashboardShell } from "@/components/emora";

export default function ReviewPage() {
  return <DashboardShell active="/app/pengukuran" title="Tinjau Jawaban" description="Periksa kelengkapan sebelum mengirim jawaban secara final."><AssessmentReview/></DashboardShell>;
}
