import Image from "next/image";
import Link from "next/link";
import { siteInfo } from "@/content/site";
import navData from "@/content/nav.json";

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center gap-12 overflow-hidden bg-[var(--color-black)] pt-16">
      {/*
        Solid black (Colors/Black/black, #000000, confirmed via
        get_variable_defs on 14:19604 -- matches the existing --color-black
        token, no new one needed). An earlier pass used a radial glow here
        specifically to avoid a hard seam against the CTA section above
        (which ends in pure black) -- but solid black against solid black
        has zero brightness delta, which is an even more seamless match
        than the radial version was, so this doesn't reintroduce that bug.
      */}
      <div className="h-px w-full bg-gradient-to-r from-black via-[#28282c] to-black" aria-hidden />

      <div className="flex flex-col items-center gap-8 px-6 text-center sm:px-[80px] lg:px-[403px]">
        {/*
          Figma's Logo component (10:8802) has a second child --
          "1 Spray Text Effect by Sko4 2" -- a pink spray-paint "Media"
          script overlaid across "Motion" (left 49.94%, width 41.52%, top
          50%+14px translateY(-50%) of the logo's own box). Missing from
          both this and TopNav's logo; confirmed against
          ss/how_footer_and_last_section_should_look.png, which shows it
          on the footer wordmark.
        */}
        <div className="relative inline-block">
          {/* Plain <img>: real .svg export, see the note in TopNav.tsx. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteInfo.logo} alt={siteInfo.name} width={147} height={60} className="h-[48px] w-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo/spray-text-media.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-[49.94%] top-[56.4%] w-[41.52%] max-w-none -translate-y-1/2 object-cover"
            style={{ aspectRatio: "3000/2000" }}
          />
        </div>
        <p className="max-w-[255px] text-[length:var(--text-body3)] text-[var(--color-omega-50)] tracking-[-0.2px]">
          Made with <span className="text-white">💜</span> and passion
        </p>
      </div>

      <nav aria-label="Footer" className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6">
        {navData.primary.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-1 text-[length:var(--text-button3)] font-medium text-[var(--color-omega-80)] transition-colors hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex w-full flex-col items-center gap-6 border-t border-[#1d1d20] px-6 py-10 sm:flex-row sm:justify-between sm:px-20">
        {/*
          Figma (14:19588): bg-gradient-to-r from-white to-white/0
          (60% opacity), bg-clip-text + transparent fill -- not a solid
          color. Over this footer's solid black, white-fading-to-
          transparent reads as white-fading-to-black, i.e. exactly the
          black-to-white gradient effect, implemented with Figma's real
          stops rather than a literal black-to-white gradient (which
          would look identical here but wouldn't match the source).
        */}
        <p className="bg-gradient-to-r from-white to-white/0 bg-clip-text text-[length:var(--text-body3)] text-transparent tracking-[-0.2px] opacity-60">
          {siteInfo.copyright}
        </p>
        <div className="flex items-center gap-2.5">
          {siteInfo.socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.name}
              className="flex items-center rounded-xl bg-[var(--color-alpha)] p-2.5 transition-opacity hover:opacity-80"
            >
              <Image src={social.icon} alt="" width={24} height={24} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
