"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Oferta", "/oferta"],
  ["Portfolio", "/portfolio"],
  ["Blog", "/blog"],
  ["Kalendarz", "/kalendarz"],
  ["Q&A", "/qa"],
  ["Produkty", "/produkty"],
  ["Kontakt", "/kontakt"],
  ["Regulamin", "/regulamin"]
];

export default function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-md">
      <div className="wrap flex items-center justify-between gap-5 py-4">
        <Link href="/" className="font-display text-lg tracking-normal">
          EWA WIERZBA
        </Link>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-ui bg-ink text-paper md:hidden"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full flex-col gap-1 border-b border-line bg-paper px-6 py-4 md:static md:flex md:flex-row md:flex-wrap md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0`}
        >
          {links.map(([label, href]) => {
            const active =
              href === "/" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`font-mono text-[13px] font-semibold uppercase tracking-[0.05em] transition-colors hover:text-accent ${
                  active ? "text-accent" : "text-inkSoft"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
