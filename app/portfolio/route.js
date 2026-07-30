import { categoriesFromCases, getPortfolioCases } from "@/lib/notion/portfolio";
import { htmlResponse, renderPortfolioPage } from "@/lib/dynamic-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const cases = await getPortfolioCases();
  const categories = categoriesFromCases(cases);
  return htmlResponse(renderPortfolioPage(cases, categories, true));
}
