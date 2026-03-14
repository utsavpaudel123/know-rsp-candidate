import type { ReactNode } from "react";
import { ExternalLink, Globe, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/lib/types";

interface SocialLinksProps {
  socials: SocialLink[];
}

const PLATFORM_CONFIG: Record<
  SocialPlatform,
  { label: string; icon: ReactNode; color: string }
> = {
  Website: {
    label: "Website",
    icon: <Globe className="h-4 w-4" />,
    color: "text-purple-600 dark:text-purple-400",
  },
  Facebook: {
    label: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    color: "text-blue-700 dark:text-blue-400",
  },
  LinkedIn: {
    label: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  "Twitter/X": {
    label: "Twitter / X",
    icon: <Twitter className="h-4 w-4" />,
    color: "text-sky-500 dark:text-sky-400",
  },
  Instagram: {
    label: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    color: "text-pink-600 dark:text-pink-400",
  },
};

export default function SocialLinks({ socials }: SocialLinksProps) {
  if (!socials || socials.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {socials.map((social, idx) => {
        const config = PLATFORM_CONFIG[social.platform];

        return (
          <a
            key={`${social.platform}-${social.url}-${idx}`}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-[1.25rem] border border-border/80 bg-[var(--surface-soft)] px-4 py-3 transition-all hover:bg-muted/70"
          >
            <span className={`shrink-0 ${config.color}`}>{config.icon}</span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground leading-none truncate">
                {social.label ?? config.label}
              </p>
              <p className={`mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${config.color}`}>
                {config.label}
              </p>
            </div>

            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
          </a>
        );
      })}
    </div>
  );
}
