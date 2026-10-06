import { getPortfolioCases } from "@/lib/notion/portfolio";
import { getReferenceHtml, linkPortfolioCtas } from "@/lib/reference-html";

export const dynamic = "force-static";

export async function GET() {
  const cases = await getPortfolioCases();
  const html = linkPortfolioCtas(getReferenceHtml("main", "Ewa Wierzba Portfolio.dc.html"), cases);

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
