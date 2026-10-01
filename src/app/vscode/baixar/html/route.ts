import { buildVsJson } from "@/content/vscode";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildVsJson("html"), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="html.json"',
    },
  });
}
