import {
  databaseIds,
  dateStart,
  getBlocks,
  multiSelectNames,
  notionConfigured,
  queryAll,
  richText,
  selectName,
  title,
  url
} from "@/lib/notion/client";
import { portfolioSnapshot } from "@/lib/content/notion-snapshot";

const PUBLISHED = "Opublikowany";
const PROP_TITLE = "Tytu\u0142";
const PROP_VIDEO = "Wideo (link)";
const PROP_COVER = "Ok\u0142adka (link)";

export function mapPortfolioPage(page) {
  const props = page.properties || {};
  return {
    id: page.id,
    title: title(props[PROP_TITLE]),
    slug: richText(props["Slug"]),
    client: richText(props["Klient"]),
    categories: multiSelectNames(props["Kategoria"]),
    videoUrl: url(props[PROP_VIDEO]),
    coverUrl: url(props[PROP_COVER]),
    status: selectName(props["Status"]),
    realizedAt: dateStart(props["Data realizacji"])
  };
}

export async function getPortfolioCases({ category, limit } = {}) {
  if (!notionConfigured("portfolio")) {
    const cases = category
      ? portfolioSnapshot.filter((item) => item.categories.includes(category))
      : portfolioSnapshot;
    return cases.slice(0, limit || undefined);
  }

  try {
    const filters = [{ property: "Status", select: { equals: PUBLISHED } }];

    if (category) {
      filters.push({ property: "Kategoria", multi_select: { contains: category } });
    }

    const pages = await queryAll(databaseIds.portfolio, {
      filter: filters.length === 1 ? filters[0] : { and: filters },
      sorts: [{ property: "Data realizacji", direction: "descending" }]
    });

    return pages
      .map(mapPortfolioPage)
      .filter((item) => item.slug && item.title)
      .slice(0, limit || undefined);
  } catch (error) {
    console.error("Failed to load Portfolio from Notion", error);
    const cases = category
      ? portfolioSnapshot.filter((item) => item.categories.includes(category))
      : portfolioSnapshot;
    return cases.slice(0, limit || undefined);
  }
}

export async function getPortfolioCase(slug) {
  if (!notionConfigured("portfolio")) {
    const item = portfolioSnapshot.find((entry) => entry.slug === slug);
    if (!item) return null;
    return {
      ...item,
      blocks: [
        { id: `${item.id}-intro`, type: "paragraph", text: `${item.title} - projekt z bazy Portfolio w Notion.` },
        { id: `${item.id}-zadanie`, type: "heading_2", text: "Zadanie" },
        { id: `${item.id}-zadanie-p`, type: "paragraph", text: "Opis zadania zostanie pobrany z tre\u015bci strony Notion po skonfigurowaniu NOTION_API_KEY." },
        { id: `${item.id}-koncepcja`, type: "heading_2", text: "Koncepcja" },
        { id: `${item.id}-koncepcja-p`, type: "paragraph", text: "Koncepcja jest gotowa do renderowania z blok\u00f3w Notion." },
        { id: `${item.id}-realizacja`, type: "heading_2", text: "Realizacja" },
        { id: `${item.id}-realizacja-p`, type: "paragraph", text: "Realizacja zostanie uzupe\u0142niona z Notion API." },
        { id: `${item.id}-services`, type: "heading_2", text: "U\u017cyte us\u0142ugi" },
        { id: `${item.id}-service-1`, type: "to_do", text: "Shooting", checked: true },
        { id: `${item.id}-result`, type: "heading_2", text: "Rezultat" },
        { id: `${item.id}-result-p`, type: "paragraph", text: "Rezultat zostanie wy\u015bwietlony z tre\u015bci strony w Notion." }
      ]
    };
  }

  let pages = [];
  try {
    pages = await queryAll(databaseIds.portfolio, {
      filter: {
        and: [
          { property: "Status", select: { equals: PUBLISHED } },
          { property: "Slug", rich_text: { equals: slug } }
        ]
      }
    });
  } catch (error) {
    console.error("Failed to load Portfolio case from Notion", error);
    const item = portfolioSnapshot.find((entry) => entry.slug === slug);
    return item ? { ...item, blocks: [] } : null;
  }

  const page = pages[0];
  if (!page) return null;

  const item = mapPortfolioPage(page);
  let blocks = [];
  try {
    blocks = await getBlocks(page.id);
  } catch (error) {
    console.error("Failed to load Portfolio blocks from Notion", error);
  }
  return { ...item, blocks };
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
