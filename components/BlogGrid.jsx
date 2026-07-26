"use client";

import { useMemo, useState } from "react";
import FilterChips from "@/components/FilterChips";
import PostCard from "@/components/PostCard";

export default function BlogGrid({ posts }) {
  const categories = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.categories))).sort(),
    [posts]
  );
  const [activeCategory, setActiveCategory] = useState("all");
  const visiblePosts =
    activeCategory === "all"
      ? posts
      : posts.filter((post) => post.categories.includes(activeCategory));

  return (
    <>
      {categories.length > 0 ? (
        <div className="wrap flex flex-col gap-3 pb-4 pt-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-inkFaint">
            Kategoria
          </div>
          <FilterChips
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      ) : null}
      <section className="wrap grid gap-7 pb-24 pt-6 md:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        {visiblePosts.length === 0 ? (
          <div className="paper-card flex min-h-64 items-center justify-center border-dashed p-10 text-center font-mono text-sm uppercase tracking-[0.08em] text-inkFaint">
            Kolejne artykuły pojawią się tutaj po publikacji w Notion.
          </div>
        ) : null}
      </section>
    </>
  );
}
