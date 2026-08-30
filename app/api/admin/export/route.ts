import { appsScriptRequest } from "@/lib/apps-script";
import { apiError, sessionToken } from "@/lib/api-route";

function csvCell(value: unknown) {
  const text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  try {
    const kind = new URL(request.url).searchParams.get("kind") || "combined";
    const result = await appsScriptRequest<{rows:Record<string,unknown>[];spreadsheetUrl:string}>("exportData", { token: await sessionToken(), kind });
    const headers = Array.from(new Set(result.rows.flatMap(row => Object.keys(row))));
    const csv = [headers.map(csvCell).join(","), ...result.rows.map(row => headers.map(header => csvCell(row[header])).join(","))].join("\n");
    return new Response(`\uFEFF${csv}`, { headers: { "Content-Type": "text/csv;charset=utf-8", "Content-Disposition": `attachment; filename="emora-${kind}.csv"` } });
  } catch (error) { return apiError(error); }
}
