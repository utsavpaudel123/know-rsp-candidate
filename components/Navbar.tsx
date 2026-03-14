"use client";

import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { ChartColumnBig, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Directory" },
  { href: "/analytics", label: "Analytics" },
  { href: "/about", label: "Methodology" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); // set correct state on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-300", scrolled ? "pt-1 sm:pt-1.5" : "pt-3 sm:pt-4")}>
      <div className="page-shell-wide">
        <div className="surface-panel overflow-hidden">
          <div className={cn("flex items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-300", scrolled ? "py-1.5" : "py-3")}>
            <div className="flex min-w-0 items-center gap-4">
              <Link href="/" className="flex min-w-0 items-center gap-3">
                <div className={cn("shrink-0 flex items-center justify-center rounded-2xl overflow-hidden shadow-sm ring-1 ring-border/50 transition-all duration-300", scrolled ? "size-8" : "size-11")}>
                  <Image
                    src="/logo.png"
                    alt="Know RSP Logo"
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <p className={cn("font-display truncate font-semibold text-foreground transition-all duration-300", scrolled ? "text-base" : "text-lg sm:text-xl")}>
                    Know RSP
                  </p>
                  <p className={cn("truncate font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300", scrolled ? "text-[0.6rem]" : "text-[0.68rem]")}>
                    Nepal Election Directory
                  </p>
                </div>
              </Link>

              <div className="hidden xl:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="metric-chip px-3 py-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--rsp-green)]" />
                  Verified public records
                </span>
                <span className="metric-chip px-3 py-2">
                  <ChartColumnBig className="h-3.5 w-3.5 text-[var(--rsp-blue)]" />
                  Candidate analytics
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center rounded-full border border-border/90 bg-[var(--surface-soft)] p-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-[var(--surface-inverse)] text-[var(--surface-inverse-foreground)] shadow-[0_10px_24px_rgba(10,14,20,0.16)]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/80 bg-[var(--surface-soft)] px-3 py-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[var(--rsp-green)]" />
                2026 results, profiles, and source links
              </div>
              <ThemeToggle />
              <div className="md:hidden">
                <MobileNav links={navLinks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
