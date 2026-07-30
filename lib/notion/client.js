import { Client } from "@notionhq/client";

export const notion = process.env.NOTION_API_KEY
  ? new Client({ auth: process.env.NOTION_API_KEY })
  : null;

export const databaseIds = {
  calendar: process.env.NOTION_CALENDAR_DATABASE_ID || ""
};

export function notionConfigured(kind) {
  return Boolean(notion && databaseIds[kind]);
}

export function title(prop) {
  return prop?.title?.map((item) => item.plain_text).join("")?.trim() || "";
}

export function richText(prop) {
  return prop?.rich_text?.map((item) => item.plain_text).join("")?.trim() || "";
}

export function selectName(prop) {
  return prop?.select?.name || "";
}

export function multiSelectNames(prop) {
  return prop?.multi_select?.map((item) => item.name) || [];
}

export function dateStart(prop) {
  return prop?.date?.start || "";
}

export function url(prop) {
  return prop?.url || "";
}

export function fileUrl(file) {
  if (!file) return "";
  if (file.type === "external") return file.external?.url || "";
  return file.file?.url || "";
}

export async function queryAll(database_id, query) {
  if (!notion) return [];

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

export async function getBlocks(pageId) {
  if (!notion) return [];

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

function textFromRichText(rich_text = []) {
  return rich_text.map((item) => item.plain_text).join("");
}

function normalizeBlock(block) {
  const data = block[block.type];
  if (!data) return null;

  if (block.type === "image") {
    return {
      id: block.id,
      type: "image",
      url: fileUrl(data),
      caption: textFromRichText(data.caption)
    };
  }

  if (block.type === "to_do") {
    return {
      id: block.id,
      type: "to_do",
      text: textFromRichText(data.rich_text),
      checked: Boolean(data.checked)
    };
  }

  if (data.rich_text) {
    return {
      id: block.id,
      type: block.type,
      text: textFromRichText(data.rich_text)
    };
  }

  return null;
}
