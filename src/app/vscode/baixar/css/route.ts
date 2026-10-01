import { buildVsJson } from "@/content/vscode";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildVsJson("css"), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="css.json"',
    },
  });
}
