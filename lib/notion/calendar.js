import {
  databaseIds,
  dateStart,
  notionConfigured,
  queryAll,
  selectName
} from "@/lib/notion/client";
import { CALENDAR_SLOTS, NOTION_SLOT_GROUPS } from "@/lib/calendar-constants";

export function publicStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "zarezerwowane" || normalized === "reserved") return "reserved";
  if (normalized === "closed" || normalized === "niedost\u0119pne" || normalized === "zaj\u0119te") return "closed";
  return "free";
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function eachDate(start, end) {
  const dates = [];
  let cursor = new Date(`${start}T00:00:00.000Z`);
  const last = new Date(`${end}T00:00:00.000Z`);

  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor = addDays(cursor, 1);
  }

  return dates;
}

function aggregateStatus(records, publicSlot) {
  const sourceSlots = NOTION_SLOT_GROUPS[publicSlot] || [publicSlot];
  const statuses = sourceSlots.map((slot) => records.get(slot));

  if (statuses.some((status) => status === "reserved")) return "reserved";
  if (statuses.some((status) => status === "closed")) return "closed";
  return "free";
}

export async function getCalendarRange(start, end) {
  if (!notionConfigured("calendar")) {
    return {
      configured: false,
      source: "notion",
      error: "Notion Calendar is not configured in this environment.",
      slots: []
    };
  }

  let pages = [];
  try {
    pages = await queryAll(databaseIds.calendar, {
      filter: {
        and: [
          { property: "Data", date: { on_or_after: start } },
          { property: "Data", date: { on_or_before: end } }
        ]
      }
    });
  } catch (error) {
    console.error("Failed to load Calendar from Notion", error);
    return {
      configured: false,
      source: "notion",
      error: "Failed to load Calendar from Notion.",
      slots: []
    };
  }

  const rawSlots = pages.map((page) => {
    const props = page.properties || {};
    return {
      date: dateStart(props["Data"]),
      slot: selectName(props["Slot czasowy"]),
      status: publicStatus(selectName(props["Status"]))
    };
  });

  return {
    configured: true,
    source: "notion",
    slots: normalizeCalendarSlots(rawSlots, start, end)
  };
}

function normalizeCalendarSlots(rawSlots, start, end) {
  const byDate = new Map();
  rawSlots.forEach((raw) => {
    if (!raw.date || !raw.slot) return;
    if (raw.date < start || raw.date > end) return;
    if (!byDate.has(raw.date)) byDate.set(raw.date, new Map());
    byDate.get(raw.date).set(raw.slot, raw.status);
  });

  return eachDate(start, end).flatMap((date) => {
    const records = byDate.get(date) || new Map();
    return CALENDAR_SLOTS.map((slot) => ({
      date,
      slot,
      status: aggregateStatus(records, slot)
    }));
  });
}
