"use client";

import { useState } from "react";

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-line">
      {items.map((item, index) => {
        const active = open === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-5 py-6 text-left font-bold transition-colors hover:text-accent"
              onClick={() => setOpen(active ? -1 : index)}
              aria-expanded={active}
            >
              <span>{item.question}</span>
              <span className="relative h-6 w-6 flex-none">
                <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-accent" />
                <span
                  className={`absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 rounded bg-accent transition-transform ${
                    active ? "rotate-90 opacity-0" : ""
                  }`}
                />
              </span>
            </button>
            <div className={`${active ? "block" : "hidden"} pb-6 text-inkSoft`}>
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
