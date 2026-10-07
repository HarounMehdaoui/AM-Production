import type { Metadata } from "next";
import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { StudioGallery } from "@/components/studios/StudioGallery";
import { getServices, getStudioGallery } from "@/content";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "Studios — Alpha Motion",
};

/**
 * Dedicated page for the nav's "Studios" link. Originally just reused Home's
 * ServicesGrid teaser ("what we do") with no sense of the physical space --
 * now leads with a shot of the studio floor itself (studio-wide.png, the
 * one genuine interior photo already in this repo -- see Contact's left
 * panel, same asset) plus a CMS-managed gallery (getStudioGallery(), same
 * lightweight shape as the Home circle-ticker) before the same services
 * content Home already surfaces below that.
 */
export default async function StudiosPage() {
  const [services, gallery] = await Promise.all([getServices(), getStudioGallery()]);

  return (
    <section className="flex w-full flex-col items-center gap-16 px-6 py-20 sm:px-12 lg:px-20">
      <Reveal className="flex max-w-[680px] flex-col items-center gap-[30px] text-center">
        <Tag>{copy.studios.tag}</Tag>
        <h1 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
          {copy.studios.heading}
        </h1>
        <p className="text-[length:var(--text-body2)] text-[#797b85]">{copy.studios.body}</p>
      </Reveal>

      {/* The studio floor itself -- same bracket/gradient treatment as
          Contact's visual panel and ProjectCard's image slot, not a new
          image style. */}
      <Reveal className="relative aspect-[16/9] w-full max-w-[1160px] overflow-hidden rounded-3xl border border-[var(--color-omega-10)] sm:aspect-[21/9]">
        <Image src="/assets/support/studio-wide.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />
        <Image src="/assets/card/bracket-left.png" alt="" width={28} height={28} className="absolute left-5 top-5 opacity-70" />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={28}
          height={28}
          className="absolute right-5 top-5 -scale-x-100 opacity-70"
        />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={28}
          height={28}
          className="absolute bottom-5 left-5 -scale-y-100 opacity-70"
        />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={28}
          height={28}
          className="absolute bottom-5 right-5 -scale-x-100 -scale-y-100 opacity-70"
        />
      </Reveal>

      <StudioGallery images={gallery} />

      <div className="flex w-full max-w-[1200px] flex-col items-center gap-16">
        <Reveal className="flex flex-col items-center gap-[30px] text-center">
          <Tag>{copy.studios.servicesTag}</Tag>
          <h2 className="text-[28px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h2)]">
            {copy.studios.servicesHeading}
          </h2>
        </Reveal>

        <ServicesGrid services={services} />
      </div>
    </section>
  );
}
