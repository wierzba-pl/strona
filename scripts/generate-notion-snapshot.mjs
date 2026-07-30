import fs from "node:fs";
import path from "node:path";
import { Client } from "@notionhq/client";

const envPath = path.join(process.cwd(), ".env.local");

function loadEnv() {
  if (!fs.existsSync(envPath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );
}

const env = { ...loadEnv(), ...process.env };
const notion = new Client({ auth: env.NOTION_API_KEY });

const databaseIds = {
  calendar: env.NOTION_CALENDAR_DATABASE_ID || "c80c9f2d4d7a4639813670baed4e0953",
  portfolio: env.NOTION_PORTFOLIO_DATABASE_ID || "ead9596a4f9847faab259f255cd64373"
};

function title(prop) {
  return prop?.title?.map((item) => item.plain_text).join("")?.trim() || "";
}

function richText(prop) {
  return prop?.rich_text?.map((item) => item.plain_text).join("")?.trim() || "";
}

function richTextWithLinks(rich_text = []) {
  return rich_text
    .map((item) => item.href || item.plain_text || "")
    .join("\n")
    .trim();
}

function selectName(prop) {
  return prop?.select?.name || "";
}

function multiSelectNames(prop) {
  return prop?.multi_select?.map((item) => item.name) || [];
}

function dateStart(prop) {
  return prop?.date?.start || "";
}

function url(prop) {
  return prop?.url || "";
}

function fileUrl(file) {
  if (!file) return "";
  if (file.type === "external") return file.external?.url || "";
  return file.file?.url || "";
}

function firstFileUrl(prop) {
  return fileUrl(prop?.files?.[0]);
}

function publicStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "zarezerwowane" || normalized === "reserved") return "reserved";
  if (normalized === "closed" || normalized === "niedostępne" || normalized === "zajęte") return "closed";
  return "free";
}

async function queryAll(database_id, query = {}) {
  const results = [];
  let start_cursor;

  do {
    const response = await notion.databases.query({
      database_id,
      start_cursor,
      page_size: 100,
      ...query
    });
    results.push(...response.results);
    start_cursor = response.has_more ? response.next_cursor : undefined;
  } while (start_cursor);

  return results;
}

async function getBlocks(pageId) {
  const results = [];
  let start_cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor,
      page_size: 100
    });
    results.push(...response.results);
    start_cursor = response.has_more ? response.next_cursor : undefined;
  } while (start_cursor);

  return results.map(normalizeBlock).filter(Boolean);
}

function normalizeBlock(block) {
  const data = block[block.type];
  if (!data) return null;

  if (block.type === "image") {
    return {
      id: block.id,
      type: "image",
      url: fileUrl(data),
      caption: richTextWithLinks(data.caption)
    };
  }

  if (block.type === "video") {
    return {
      id: block.id,
      type: "paragraph",
      text: fileUrl(data)
    };
  }

  if (block.type === "bookmark" || block.type === "embed" || block.type === "file") {
    return {
      id: block.id,
      type: "paragraph",
      text: data.url || fileUrl(data)
    };
  }

  if (block.type === "to_do") {
    return {
      id: block.id,
      type: "to_do",
      text: richTextWithLinks(data.rich_text),
      checked: Boolean(data.checked)
    };
  }

  if (data.rich_text) {
    return {
      id: block.id,
      type: block.type,
      text: richTextWithLinks(data.rich_text)
    };
  }

  return null;
}

async function getPortfolioSnapshot() {
  const pages = await queryAll(databaseIds.portfolio, {
    filter: { property: "Status", select: { equals: "Opublikowany" } },
    sorts: [{ property: "Data realizacji", direction: "descending" }]
  });

  return Promise.all(
    pages.map(async (page) => {
      const props = page.properties || {};
      const item = {
        id: page.id,
        title: title(props["Tytuł"]),
        slug: richText(props["Slug"]),
        client: richText(props["Klient"]),
        categories: multiSelectNames(props["Kategoria"]),
        videoUrl: url(props["Wideo (link)"]),
        coverUrl: url(props["Okładka (link)"]) || firstFileUrl(props["Okładka"]),
        status: selectName(props["Status"]),
        realizedAt: dateStart(props["Data realizacji"]),
        blocks: await getBlocks(page.id)
      };

      return item;
    })
  );
}

async function getCalendarSnapshot() {
  const pages = await queryAll(databaseIds.calendar, {
    sorts: [{ property: "Data", direction: "ascending" }]
  });

  return pages
    .map((page) => {
      const props = page.properties || {};
      return {
        date: dateStart(props["Data"]),
        slot: selectName(props["Slot czasowy"]),
        status: publicStatus(selectName(props["Status"]))
      };
    })
    .filter((item) => item.date && item.slot);
}

function serialize(name, value) {
  return `export const ${name} = ${JSON.stringify(value, null, 2)};\n`;
}

const WROCLAWSKI_BARBER_INTRO =
  "Igor oficjalnie zarejestrowany jako zawodnik prestiżowej federacji HYROX, gdzie startuje w wymagającej kategorii HYROX PRO. Nie skupia się na klasycznej kulturystyce czy typowych zawodach sylwetkowych. Przekuł swoją siłę, muskulaturę i dyscyplinę w sporty wytrzymałościowo-siłowe (cross-trening).";

function cleanPortfolioSnapshot(cases) {
  return cases.map((item) => {
    let blocks = item.blocks || [];

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

    return { ...item, blocks };
  });
}

const portfolioSnapshot = cleanPortfolioSnapshot(await getPortfolioSnapshot());
const calendarSnapshot = await getCalendarSnapshot();

const output = `${serialize("portfolioSnapshot", portfolioSnapshot)}\n${serialize("calendarSnapshot", calendarSnapshot)}`;
const outPath = path.join(process.cwd(), "lib", "content", "notion-snapshot.js");
fs.writeFileSync(outPath, output, "utf8");

console.log(`Wrote ${portfolioSnapshot.length} portfolio cases and ${calendarSnapshot.length} calendar records to ${outPath}`);
