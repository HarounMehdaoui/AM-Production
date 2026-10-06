import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { getServices } from "@/content";
import { copy } from "@/content/copy";

export async function ServicesSection() {
  const services = await getServices();

  return (
    <section
      id="studios"
      className="relative flex w-full scroll-mt-24 flex-col items-center gap-20 overflow-hidden bg-black px-6 pt-10 sm:px-12 lg:px-20"
    >
      <Image src="/assets/support/section-glow-bg.png" alt="" fill className="pointer-events-none absolute inset-0 -z-10 object-cover" />

      <Reveal className="flex flex-col items-center gap-[30px] text-center">
        <Tag>{copy.services.tag}</Tag>
        <h2 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
          {copy.services.heading}
        </h2>
        <p className="text-[length:var(--text-h5)] text-[#797b85]">{copy.services.subheading}</p>
      </Reveal>

      <ServicesGrid services={services} />
    </section>
  );
}
