"use client";

import { useMemo, useState } from "react";
import FilterChips from "@/components/FilterChips";
import CaseCard from "@/components/CaseCard";

export default function PortfolioGrid({ cases }) {
  const categories = useMemo(
    () => Array.from(new Set(cases.flatMap((item) => item.categories))).sort(),
    [cases]
  );
  const [activeCategory, setActiveCategory] = useState("all");
  const visibleCases =
    activeCategory === "all"
      ? cases
      : cases.filter((item) => item.categories.includes(activeCategory));

  return (
    <>
      <div className="wrap flex flex-col gap-3 pb-10 pt-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-inkFaint">
          Kategoria
        </div>
        <FilterChips
          categories={categories}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
      </div>
      <section className="wrap grid gap-7 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {visibleCases.map((item) => (
          <CaseCard key={item.slug} item={item} />
        ))}
        {visibleCases.length === 0 ? (
          <div className="col-span-full py-20 text-center font-mono text-sm uppercase tracking-[0.08em] text-inkFaint">
            Brak opublikowanych projektów dla tej kategorii.
          </div>
        ) : null}
      </section>
    </>
  );
}
