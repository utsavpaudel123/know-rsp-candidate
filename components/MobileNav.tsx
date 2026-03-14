"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
}

export default function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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

          <div className="page-shell absolute inset-x-0 top-4 fade-in">
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
                {links.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "border-[var(--rsp-blue)]/30 bg-[var(--rsp-blue)]/5 text-foreground"
                          : "border-border/80 bg-[var(--surface-soft)] text-foreground hover:bg-muted/70"
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <span className="ml-2 inline-flex h-1.5 w-1.5 rounded-full bg-[var(--rsp-blue)]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
