import { getPortfolioCase, getPortfolioCases, getSimilarCases } from "@/lib/notion/portfolio";
import { htmlResponse, renderPortfolioCasePage } from "@/lib/dynamic-pages";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const cases = await getPortfolioCases();
  const params = cases.map((item) => ({ slug: item.slug }));

  if (cases.some((item) => item.slug === "temnuy_s-photo")) {
    params.push({ slug: "temnuy-s-photo" });
  }

  return params;
}

export async function GET(_request, { params }) {
  const item = await getPortfolioCase(params.slug);

  if (!item) {
    return htmlResponse(
      `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>Portfolio</title></head><body><main style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#FAF7F1;color:#171512;font-family:Arial,sans-serif;text-align:center;padding:24px;"><div><h1>Nie znaleziono projektu</h1><p>Sprawd&#378; slug w Notion albo konfiguracj&#281; API.</p><p><a href="/portfolio">Wr&oacute;&#263; do Portfolio</a></p></div></main></body></html>`,
      404
    );
  }

  const similar = await getSimilarCases(item);
  return htmlResponse(renderPortfolioCasePage(item, similar));
}
