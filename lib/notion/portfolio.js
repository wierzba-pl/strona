import { portfolioSnapshot } from "@/lib/content/notion-snapshot";

function publishedSnapshot() {
  return portfolioSnapshot.filter((item) => item.status === "Opublikowany" && item.slug && item.title);
}

export async function getPortfolioCases({ category, limit } = {}) {
  const cases = category
    ? publishedSnapshot().filter((item) => item.categories.includes(category))
    : publishedSnapshot();
  return cases.slice(0, limit || undefined);
}

export async function getPortfolioCase(slug) {
  return publishedSnapshot().find((entry) => entry.slug === slug) || null;
}

export async function getSimilarCases(currentCase, limit = 3) {
  const firstCategory = currentCase?.categories?.[0];
  if (!firstCategory) return [];
  const cases = await getPortfolioCases({ category: firstCategory, limit: 8 });
  return cases.filter((item) => item.slug !== currentCase.slug).slice(0, limit);
}

export function categoriesFromCases(cases) {
  return Array.from(new Set(cases.flatMap((item) => item.categories))).sort();
}
