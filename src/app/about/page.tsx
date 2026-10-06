import type { Metadata } from "next";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { TeamGrid } from "@/components/about/TeamGrid";
import { CtaSection } from "@/components/home/CtaSection";
import { getTeamMembers } from "@/content";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "About — Alpha Motion",
};

/**
 * Dedicated page for the nav's "About" link -- the team roster, CMS-managed
 * via getTeamMembers() (see content/index.ts, content/schema.ts). Not to be
 * confused with HeroAbout.tsx's "About Us" company blurb on Home (id="about"),
 * a separate section that's always existed there and still does.
 */
export default async function AboutPage() {
  const team = await getTeamMembers();

  return (
    <>
      <section className="flex w-full flex-col items-center gap-16 px-6 py-20 sm:px-12 lg:px-20">
        <Reveal className="flex max-w-[680px] flex-col items-center gap-[30px] text-center">
          <Tag>{copy.about.tag}</Tag>
          <h1 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
            {copy.about.heading}
          </h1>
          <p className="text-[length:var(--text-body2)] text-[#797b85]">{copy.about.body}</p>
        </Reveal>

        <TeamGrid members={team} />
      </section>
      <CtaSection />
    </>
  );
}
