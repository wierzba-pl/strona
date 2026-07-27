import {
  databaseIds,
  dateStart,
  fileUrl,
  getBlocks,
  multiSelectNames,
  notionConfigured,
  queryAll,
  richText,
  selectName,
  title
} from "@/lib/notion/client";

const PUBLISHED = "Opublikowany";
const PROP_TITLE = "Tytu\u0142";
const PROP_COVER = "Ok\u0142adka";

export function mapBlogPage(page) {
  const props = page.properties || {};
  return {
    id: page.id,
    title: title(props[PROP_TITLE]),
    slug: richText(props["Slug"]),
    status: selectName(props["Status"]),
    categories: multiSelectNames(props["Kategoria"]),
    coverUrl: fileUrl(props[PROP_COVER]?.files?.[0]),
    excerpt: richText(props["Excerpt"]),
    publishedAt: dateStart(props["Data publikacji"])
  };
}

export async function getBlogPosts({ limit } = {}) {
  if (!notionConfigured("blog")) return [];

  let pages = [];
  try {
    pages = await queryAll(databaseIds.blog, {
      filter: { property: "Status", select: { equals: PUBLISHED } },
      sorts: [{ property: "Data publikacji", direction: "descending" }]
    });
  } catch (error) {
    console.error("Failed to load Blog from Notion", error);
    return [];
  }

  return pages
    .map(mapBlogPage)
    .filter((post) => post.slug && post.title)
    .slice(0, limit || undefined);
}

export async function getBlogPost(slug) {
  if (!notionConfigured("blog")) return null;

  let pages = [];
  try {
    pages = await queryAll(databaseIds.blog, {
      filter: {
        and: [
          { property: "Status", select: { equals: PUBLISHED } },
          { property: "Slug", rich_text: { equals: slug } }
        ]
      }
    });
  } catch (error) {
    console.error("Failed to load Blog post from Notion", error);
    return null;
  }

  const page = pages[0];
  if (!page) return null;

  const post = mapBlogPage(page);
  let blocks = [];
  try {
    blocks = await getBlocks(page.id);
  } catch (error) {
    console.error("Failed to load Blog blocks from Notion", error);
  }
  return { ...post, blocks };
}
