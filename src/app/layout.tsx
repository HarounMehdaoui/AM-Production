import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";

/*
 * ROOT CAUSE of the earlier font mismatch (measured, not guessed): DM Sans
 * is a variable font with `wght` (100-1000) AND `opsz` (9-40) axes, and
 * every Figma text style in this file sets `fontVariationSettings: '"opsz"
 * 14'` (or `"opsz" 9` on the Tag label). next/font/google, by default,
 * *only* requests the `wght` axis from Google Fonts to keep file size down
 * -- `opsz` is silently dropped unless explicitly requested via `axes`
 * (documented at node_modules/next/dist/docs/.../font.md under "axes").
 * Confirmed by measuring `ctx.measureText()` width of the same string at
 * opsz 9 vs 14 vs 40, same weight: all three produced the IDENTICAL width
 * (789px) before this fix -- proof the axis had zero effect on the served
 * file. Figma's own render of that string measures 717px (opsz 14 is
 * DM Sans's larger/display-tuned cut: more condensed than the small-text
 * default the font was silently stuck on), which is exactly why headings
 * wrapped to an extra line versus the design. `weight` is still omitted
 * (keeps it fully variable rather than static instances), `axes: ['opsz']`
 * is the actual fix.
 */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Alpha Motion — Film & Photography Production",
  description:
    "Alpha Motion turns ideas into cinematic experiences through the power of film and photography.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-black font-[family-name:var(--font-dm-sans)] text-white">
        <TopNav />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
