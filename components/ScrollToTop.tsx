"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-[var(--surface-strong)] shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-xl"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4 text-foreground" />
    </button>
  );
}
