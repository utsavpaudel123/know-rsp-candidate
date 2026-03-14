import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Outfit, Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import CompareBar from "@/components/CompareBar";
import { CompareProvider } from "@/lib/compare-context";
import "./globals.css";

const SITE_URL = "https://knowrspcandidate.vercel.app";
const DEFAULT_SHARE_IMAGE = "/rsp-share-preview.jpg";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Know RSP | Election Directory",
    template: "%s | Know RSP",
  },
  description:
    "A civic directory of RSP Members of Parliament from the 2026 Nepal General Election, with profiles, education, verified links, and election performance data.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Know RSP | Election Directory",
    description:
      "Profiles, education, social links, and election performance for RSP Members of Parliament elected in the 2026 Nepal General Election.",
    url: SITE_URL,
    siteName: "Know RSP",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: DEFAULT_SHARE_IMAGE,
        width: 1024,
        height: 576,
        alt: "Know RSP share preview using the official RSP visual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Know RSP | Election Directory",
    description:
      "Profiles, education, social links, and election performance for RSP Members of Parliament elected in the 2026 Nepal General Election.",
    images: [DEFAULT_SHARE_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${sourceSans3.variable} min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CompareProvider>
          <div className="relative flex min-h-screen flex-col">
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 -z-10 opacity-90"
            />
            <Navbar />
            <main className="flex-1 pb-14">{children}</main>
            <ScrollToTop />
            <footer className="page-shell-wide pb-8">
              <div className="surface-panel overflow-hidden px-6 py-6 sm:px-8">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
                  <div className="space-y-3">
                    <p className="section-kicker">Citizen-led transparency project</p>
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-foreground">
                        Know RSP
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        An independent directory of elected RSP representatives,
                        focused on verified public data, education records, official
                        links, and election performance.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="section-kicker">Explore</p>
                      <div className="flex flex-wrap gap-3">
                        <Link href="/" className="hover:text-foreground">
                          Directory
                        </Link>
                        <Link href="/analytics" className="hover:text-foreground">
                          Analytics
                        </Link>
                        <Link href="/about" className="hover:text-foreground">
                          Methodology
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2 sm:text-right">
                      <p className="section-kicker">Disclosure</p>
                      <p className="leading-6">
                        Not affiliated with RSP or any government institution. Verify
                        important facts with official sources.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <CompareBar />
          </CompareProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
