import Image from "next/image";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import type { Service } from "@/content/types";

/**
 * The wide/tall service-card grid, extracted from the Home page's
 * ServicesSection so the dedicated /studios page can render the exact same
 * cards instead of re-implementing them -- same data source (getServices()),
 * same markup, same CMS-managed content either place it's used.
 */

function TagPill({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-[length:var(--text-body4)] text-white backdrop-blur-[2px]">
      {children}
    </span>
  );
}

function ServiceIcon({ src }: { src: string }) {
  return <Image src={src} alt="" width={24} height={24} className="shrink-0" />;
}

export function ServicesGrid({ services }: { services: Service[] }) {
  const wide = services.filter((s) => s.layout === "wide");
  const tall = services.filter((s) => s.layout === "tall");

  return (
    <Reveal stagger className="grid w-full max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="flex flex-col gap-5">
        {/*
          Figma has two distinct wide-card variants, not one template
          reused twice: "Large" (5075:25387, image first/left) and
          "Large Secondary" (5075:25415, Content first then Container --
          image on the RIGHT, no bottom fade). Every odd card (index 1,
          3, ...) flips to image-right.
        */}
        {wide.map((service, i) => {
          const mirrored = i % 2 === 1;
          return (
            <RevealItem
              key={service.id}
              className={`flex overflow-hidden rounded-3xl border border-white/[0.07] bg-[radial-gradient(circle_at_50%_50%,rgba(15,9,18,0.15),rgba(12,9,18,1))] p-2 ${mirrored ? "flex-row-reverse" : ""}`}
            >
              <div className="relative w-[200px] shrink-0 self-stretch overflow-hidden rounded-3xl">
                <Image src={service.image} alt="" fill className="object-cover" />
                {!mirrored && <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black" />}
              </div>
              <div className="flex flex-1 flex-col gap-[15px] p-3.5">
                <ServiceIcon src={service.icon} />
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[length:var(--text-body2)] text-white">{service.title}</h3>
                  <p className="text-[length:var(--text-body3)] text-[#797b85]">{service.description}</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {service.tags.map((tag) => (
                    <TagPill key={tag}>{tag}</TagPill>
                  ))}
                </div>
              </div>
            </RevealItem>
          );
        })}
      </div>

      {tall.map((service) => (
        <RevealItem key={service.id} className="relative self-stretch overflow-hidden rounded-3xl border border-white/[0.07]">
          <div className="relative h-[362px] w-full overflow-hidden rounded-3xl">
            <Image src={service.image} alt="" fill className="object-cover" />
          </div>
          <div
            className="absolute inset-x-6 bottom-0 flex flex-col gap-4 rounded-[30px] p-6 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "radial-gradient(circle,rgba(15,9,18,0.15),rgba(12,9,18,1))" }}
          >
            <div className="flex flex-col gap-2.5">
              <ServiceIcon src={service.icon} />
              <h3 className="text-[length:var(--text-body2)] text-white">{service.title}</h3>
              <p className="text-[length:var(--text-body3)] text-[#797b85]">{service.description}</p>
            </div>
            <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end">
              {service.tags.map((tag) => (
                <TagPill key={tag}>{tag}</TagPill>
              ))}
            </div>
          </div>
        </RevealItem>
      ))}
    </Reveal>
  );
}
