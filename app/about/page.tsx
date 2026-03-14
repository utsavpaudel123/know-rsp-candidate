import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Database,
  Shield,
  AlertTriangle,
  Clock,
  Mail,
  Code2,
  BookOpen,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About | Know RSP",
  description:
    "About the Know RSP civic transparency initiative — methodology, data sources, and disclaimers.",
};

export default function AboutPage() {
  return (
    <div className="page-shell-wide page-section">
      <section className="surface-card overflow-hidden p-8 sm:p-10">
        <p className="section-kicker">About the project</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <h1 className="display-title max-w-4xl text-foreground">
              Civic context, methodology, and sourcing for Know RSP.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              Know RSP is a citizen-led public directory focused on who has been
              elected, what is publicly knowable about them, and how that data is
              verified before it reaches the site.
            </p>
          </div>

          <div className="surface-panel p-5">
            <p className="section-kicker">Project principles</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>Verified public records over speculation</li>
              <li>Structured candidate data with source trails</li>
              <li>Open corrections and transparent limitations</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6">
        <AboutSection icon={<BookOpen className="h-5 w-5" />} title="Project Purpose">
          <p>
            <strong>Know RSP</strong> is a citizen-led civic transparency initiative
            dedicated to making information about elected representatives of the Rastriya
            Swatantra Party (RSP) freely accessible to the public.
          </p>
          <p className="mt-3">
            Following the 2026 Nepal General Election, we believe every citizen has the
            right to know who represents them in Parliament — their background, education,
            electoral performance, and past contributions. This project aggregates and
            presents that information in one place, structured and searchable.
          </p>
          <p className="mt-3">
            Our mission is to reduce the information gap between elected officials and the
            citizens they serve.
          </p>
        </AboutSection>

        <AboutSection icon={<Database className="h-5 w-5" />} title="Data Methodology">
          <p>
            All data is manually researched, cross-referenced from multiple sources, and
            verified before publication. Our process:
          </p>
          <ol className="mt-3 space-y-2 list-decimal list-inside text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Primary research</span> — Data
              is first sourced from the Election Commission of Nepal and Parliament
              publications.
            </li>
            <li>
              <span className="font-medium text-foreground">Cross-referencing</span> — Each
              data point is verified against at least two independent sources where possible.
            </li>
            <li>
              <span className="font-medium text-foreground">Community review</span> — We
              welcome corrections and additions from the public through our GitHub
              repository.
            </li>
            <li>
              <span className="font-medium text-foreground">Dated entries</span> — Every
              candidate profile records when data was last verified.
            </li>
          </ol>
        </AboutSection>

        <AboutSection icon={<ExternalLink className="h-5 w-5" />} title="Primary Sources">
          <p className="mb-3 text-muted-foreground">
            We rely on the following primary sources for all data:
          </p>
          <ul className="space-y-2">
            {[
              {
                name: "Election Commission of Nepal",
                url: "https://www.election.gov.np",
                note: "Official election results and candidate declarations",
              },
              {
                name: "Parliament of Nepal",
                url: "https://www.parliament.gov.np",
                note: "MP profiles, committee memberships, legislative records",
              },
              {
                name: "Wikipedia (Nepali & English)",
                url: "https://en.wikipedia.org",
                note: "Biographical information and cross-reference",
              },
              {
                name: "Kantipur / The Kathmandu Post",
                url: "https://kathmandupost.com",
                note: "News articles and electoral coverage",
              },
              {
                name: "RSP Official Website",
                url: "#",
                note: "Party-published profiles and announcements",
              },
            ].map((source) => (
              <li key={source.name} className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--rsp-blue)" }}
                />
                <div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:underline"
                  >
                    {source.name}
                  </a>
                  <p className="text-sm text-muted-foreground">{source.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </AboutSection>

        <div className="rounded-[1.75rem] border border-amber-300/80 bg-amber-50 p-6 dark:border-amber-500/20 dark:bg-amber-950/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-amber-400" />
            <h2 className="text-base font-semibold text-orange-800 dark:text-amber-200">Disclaimer</h2>
          </div>
          <p className="text-orange-900 text-sm leading-relaxed dark:text-amber-100/80">
            This project is <strong>not affiliated with, endorsed by, or connected to</strong>{" "}
            the Rastriya Swatantra Party (RSP) or any other political party, government
            body, or official institution. All information is published for civic
            transparency and educational purposes only. While we strive for accuracy,
            errors may exist — verify important information with official sources before
            relying on it.
          </p>
        </div>

        <AboutSection icon={<Clock className="h-5 w-5" />} title="Data Status">
          <div className="rounded-[1.25rem] border border-border/80 bg-[var(--surface-soft)] p-4 text-sm">
            <p className="font-medium text-[var(--rsp-blue)]">
              2026 election results are still being finalized.
            </p>
            <p className="mt-1 text-muted-foreground">
              Last data update: <strong>March 8, 2026</strong>
            </p>
          </div>
          <p className="mt-3 text-muted-foreground text-sm">
            Candidate profiles are updated on a rolling basis as official data becomes
            available. Check the &ldquo;Last verified&rdquo; date on each candidate page for
            the most recent update timestamp for that profile.
          </p>
        </AboutSection>

        <AboutSection icon={<Mail className="h-5 w-5" />} title="Found an Error?">
          <p className="text-muted-foreground">
            We are committed to accuracy. If you notice incorrect or outdated information,
            please help us improve:
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <span className="font-medium text-foreground">Open a GitHub issue</span>{" "}
              —{" "}
              <a
                href="https://github.com/xafold/know-rsp-candidate/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                github.com/xafold/know-rsp-candidate
              </a>
            </li>
            <li>
              <span className="font-medium text-foreground">Submit a pull request</span>{" "}
              — Edit the{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                data/candidates.json
              </code>{" "}
              file and open a PR with your correction.
            </li>
            <li>
              <span className="font-medium text-foreground">Contact us</span> — Reach out
              via the contact details in the GitHub repository.
            </li>
          </ul>
        </AboutSection>

        <AboutSection icon={<Code2 className="h-5 w-5" />} title="Tech Stack">
          <p className="text-muted-foreground text-sm mb-3">
            This project is open-source and built with modern web technologies:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: "Next.js 15", desc: "App Router" },
              { name: "TypeScript", desc: "Strict mode" },
              { name: "Tailwind CSS v4", desc: "Styling" },
              { name: "shadcn/ui", desc: "Components" },
              { name: "Recharts", desc: "Analytics charts" },
              { name: "Lucide React", desc: "Icons" },
              { name: "next-themes", desc: "Dark mode" },
              { name: "Vercel", desc: "Hosting" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="rounded-[1.2rem] border border-border/80 bg-[var(--surface-soft)] p-3"
              >
                <p className="text-sm font-medium text-foreground">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </AboutSection>

        <div className="surface-panel flex items-center gap-3 p-4">
          <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            A citizen-led transparency initiative. Not affiliated with RSP.{" "}
            <Link href="/" className="font-medium text-foreground hover:underline">
              Back to directory &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function AboutSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="surface-card p-6 sm:p-7">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <div>
          <p className="section-kicker">Project note</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-foreground">
            {title}
          </h2>
        </div>
      </div>
      <div className="leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
