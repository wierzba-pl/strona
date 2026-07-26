"use client";

export default function FilterChips({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          activeCategory === "all"
            ? "border-ink bg-ink text-paper"
            : "border-lineStrong bg-white text-inkSoft hover:border-accent hover:text-accent"
        }`}
        onClick={() => onChange("all")}
      >
        Wszystkie
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            activeCategory === category
              ? "border-ink bg-ink text-paper"
              : "border-lineStrong bg-white text-inkSoft hover:border-accent hover:text-accent"
          }`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
