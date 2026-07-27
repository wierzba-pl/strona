"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CALENDAR_MAX_DATE, CALENDAR_SLOTS } from "@/lib/calendar-constants";

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date) {
  const day = date.getDay() || 7;
  return addDays(date, 1 - day);
}

function label(date) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  }).format(date);
}

export default function WeekCalendarGrid() {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(startOfWeek(today));
  const [data, setData] = useState({ configured: true, slots: [] });
  const [loading, setLoading] = useState(true);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart]
  );

  const rangeLabel = `${new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long"
  }).format(days[0])} - ${new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(days[6])}`;

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/kalendarz?calendar=1&start=${isoDate(days[0])}&end=${isoDate(days[6])}`)
      .then((response) => response.json())
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch(() => {
        if (active) setData({ configured: false, slots: [] });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [days]);

  const byKey = new Map(data.slots?.map((item) => [`${item.date}|${item.slot}`, item.status]));
  const previousDisabled = isoDate(addDays(weekStart, -7)) < isoDate(startOfWeek(today));
  const nextDisabled = isoDate(addDays(weekStart, 7)) > CALENDAR_MAX_DATE;

  return (
    <section className="wrap pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-ui border border-lineStrong bg-white disabled:opacity-30"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            disabled={previousDisabled}
            aria-label="Poprzedni tydzień"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-64 text-center font-display text-lg uppercase">{rangeLabel}</div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-ui border border-lineStrong bg-white disabled:opacity-30"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            disabled={nextDisabled}
            aria-label="Następny tydzień"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex gap-5 text-sm text-inkSoft">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px] border border-[#2F6B3A] bg-[#EAF3EA]" />
            Wolne
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px] border border-[#A79E8C] bg-[#F1EEE7]" />
            Zajęte / niedostępne
          </span>
        </div>
      </div>

      {!data.configured ? (
        <div className="paper-card mb-6 p-5 font-mono text-sm text-inkSoft">
          TODO: podłączyć `NOTION_API_KEY` i `NOTION_CALENDAR_DATABASE_ID`.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <div className="min-w-[820px] overflow-hidden rounded-ui border border-line bg-white">
          <div className="grid grid-cols-[140px_repeat(7,1fr)] border-b border-line bg-paperAlt">
            <div className="p-4 font-mono text-xs uppercase tracking-[0.08em] text-inkFaint">Slot</div>
            {days.map((day) => (
              <div key={day.toISOString()} className="border-l border-line p-4 text-center font-bold">
                {label(day)}
              </div>
            ))}
          </div>
          {CALENDAR_SLOTS.map((slot) => (
            <div key={slot} className="grid grid-cols-[140px_repeat(7,1fr)] border-b border-line last:border-b-0">
              <div className="p-4 font-mono text-xs text-inkSoft">{slot}</div>
              {days.map((day) => {
                const status = byKey.get(`${isoDate(day)}|${slot}`) || "unknown";
                const free = status === "free";
                return (
                  <div key={`${day.toISOString()}-${slot}`} className="border-l border-line p-2">
                    <div
                      className={`flex min-h-16 items-center justify-center rounded-ui border px-3 text-center text-sm font-semibold ${
                        loading
                          ? "border-line bg-paperAlt text-inkFaint"
                          : free
                            ? "border-[#2F6B3A] bg-[#EAF3EA] text-[#2F6B3A]"
                            : "border-[#A79E8C] bg-[#F1EEE7] text-[#A79E8C]"
                      }`}
                    >
                      {loading ? "..." : free ? "Wolne" : "Zajęte"}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 max-w-2xl text-sm text-inkFaint">
        Brak rekordu w bazie nie oznacza wolnego terminu. Takie sloty są pokazywane jako zajęte/niedostępne, dopóki termin nie zostanie wpisany w Notion.
      </p>
    </section>
  );
}
