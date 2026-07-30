import { portfolioSnapshot } from "@/lib/content/notion-snapshot";

const WROCLAWSKI_BARBER_INTRO =
  "Igor oficjalnie zarejestrowany jako zawodnik prestiżowej federacji HYROX, gdzie startuje w wymagającej kategorii HYROX PRO. Nie skupia się na klasycznej kulturystyce czy typowych zawodach sylwetkowych. Przekuł swoją siłę, muskulaturę i dyscyplinę w sporty wytrzymałościowo-siłowe (cross-trening).";

function publishedSnapshot() {
  return portfolioSnapshot.filter((item) => item.status === "Opublikowany" && item.slug && item.title);
}

function cleanBlocks(item) {
  let blocks = item.blocks || [];

  if (item.slug === "temnuy_s-photo" && !blocks.length) {
    blocks = publishedSnapshot().find((entry) => entry.slug === "temnuy_s")?.blocks || [];
  }

  if (item.slug === "wroclawskibarber") {
    let replaced = false;
    blocks = blocks.map((block) => {
      if (!replaced && block.type === "paragraph" && block.text) {
        replaced = true;
        return { ...block, text: WROCLAWSKI_BARBER_INTRO };
      }
      return block;
    });
  }

  if (item.slug === "pawel_bevz") {
    blocks = blocks.map((block, index) => {
      if (index !== 0 || block.type !== "paragraph" || !/^https:\/\/www\.google\.com\/url/i.test(block.text || "")) return block;
      return {
        ...block,
        text: String(block.text).replace(/^https:\/\/www\.google\.com\/url[^\n]*(?:\n\s*)?/i, "").trim()
      };
    });
  }

  return blocks;
}

function cleanCase(item) {
  return item ? { ...item, blocks: cleanBlocks(item) } : null;
}

export async function getPortfolioCases({ category, limit } = {}) {
  const cases = category
    ? publishedSnapshot().filter((item) => item.categories.includes(category))
    : publishedSnapshot();
  return cases.slice(0, limit || undefined);
}

export async function getPortfolioCase(slug) {
  return cleanCase(publishedSnapshot().find((entry) => entry.slug === slug) || null);
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
