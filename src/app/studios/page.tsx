import type { Metadata } from "next";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { getServices } from "@/content";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "Studios — Alpha Motion",
};

/**
 * Dedicated page for the nav's "Studios" link. Reuses the exact same
 * ServicesGrid component and getServices() data source as the Home page's
 * own Services section (id="studios") -- same CMS-managed content, same
 * cards, just presented as its own full page with a page-level intro
 * instead of a teaser nested in Home.
 */
export default async function StudiosPage() {
  const services = await getServices();

  return (
    <section className="flex w-full flex-col items-center gap-16 px-6 py-20 sm:px-12 lg:px-20">
      <Reveal className="flex max-w-[680px] flex-col items-center gap-[30px] text-center">
        <Tag>{copy.studios.tag}</Tag>
        <h1 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
          {copy.studios.heading}
        </h1>
        <p className="text-[length:var(--text-body2)] text-[#797b85]">{copy.studios.body}</p>
      </Reveal>

      <ServicesGrid services={services} />
    </section>
  );
}
