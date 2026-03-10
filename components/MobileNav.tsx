"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
}

export default function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[var(--surface-strong)] transition-colors hover:bg-muted/70"
        aria-label="Toggle mobile menu"
        aria-expanded={open}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[200] md:hidden">
          <button
            type="button"
            aria-label="Close mobile menu"
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="page-shell absolute inset-x-0 top-4">
            <div className="surface-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/80 px-5 py-4">
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    Navigation
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Explore the directory
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[var(--surface-soft)]"
                  aria-label="Close mobile menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 p-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-border/80 bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/70"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
