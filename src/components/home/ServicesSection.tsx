import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { getServices } from "@/content";
import { copy } from "@/content/copy";

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

export async function ServicesSection() {
  const services = await getServices();
  const wide = services.filter((s) => s.layout === "wide");
  const tall = services.filter((s) => s.layout === "tall");

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

      <Reveal stagger className="grid w-full max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          {/*
            Figma has two distinct wide-card variants, not one template
            reused twice: "Large" (5075:25387, image first/left) and
            "Large Secondary" (5075:25415, Content first then Container --
            image on the RIGHT, no bottom fade). An earlier version mapped
            both through the same image-left markup, so "Shot with Top
            Gear" never mirrored (ss/how_service_section_shouldnt_look.png).
            Every odd card (index 1, 3, ...) now flips to image-right.
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
                {/*
                  Figma (5075:25391): the content column's own gap-[15px]
                  sits BETWEEN icon / text-group / tags-row (3 children, 2
                  gaps) -- title+description are their own nested group
                  with a tighter gap-[10px]. An earlier version flattened
                  title and description into the outer gap-[15px] column
                  directly (3 gaps instead of 2, plus a redundant `mt-2` on
                  the tags row on top of the gap Tailwind's `gap` already
                  adds) -- ~15px of extra height per card that, via this
                  column's `self-stretch` sibling, silently inflated the
                  tall card's overlap.
                */}
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

        {/*
          ss/card_positioning.png: the content panel is only PARTLY inside
          the image (its bottom half sits below the image, in the extra
          space the taller left column creates) -- not fully contained
          within it. That means the OUTER box has to be taller than the
          362px image (self-stretch, matching the left column), with the
          panel anchored to THIS taller box's own bottom edge, not the
          image's. A previous pass swapped this to `self-start` to chase
          down an unrounded-corner artifact (ss/fix_these_edges.png), which
          did fix the rounding but also collapsed the box back down to
          exactly the image's height -- pulling the panel fully inside the
          image and losing the below-the-image overlap this diagram shows.
          Restored self-stretch; the corner fix that's still needed is the
          rounding matching on the outer box itself, verified below with
          overflow-hidden + rounded-3xl explicitly on both the box and the
          image, not by shrinking the box.
        */}
        {tall.map((service) => (
          <RevealItem key={service.id} className="relative self-stretch overflow-hidden rounded-3xl border border-white/[0.07]">
            {/*
              overflow-hidden + rounded-3xl repeated here (matching the
              outer card exactly), not just relied on from the parent --
              belt-and-suspenders per explicit request against
              ss/column.png. The outer card's own clip was already
              verified correct (debug outline, both corners, two
              breakpoints), but this guarantees the image's own corners
              can never paint past the silhouette regardless of how it's
              nested.
            */}
            <div className="relative h-[362px] w-full overflow-hidden rounded-3xl">
              <Image src={service.image} alt="" fill className="object-cover" />
            </div>
            {/*
              Figma (5075:25445): the content panel sits at bottom-[0.5px]
              (flush against the column's bottom edge, not floated above
              it) with ~29-30px side margins (left-[29.66px] on a ~590px
              column) -- an earlier version used bottom-4/inset-x-4 (16px
              on both), which left a visible gap under the panel that
              doesn't appear in the design.

              No backdrop-blur here (Figma specs blur-100/2px, but at that
              radius it's barely perceptible as a blur and instead renders
              as a visible hairline seam right at the panel's top edge --
              a known backdrop-filter + border-radius compositing artifact,
              confirmed by toggling it off live: the line vanishes and the
              image-to-panel transition reads as clean (ss/remove_this_line.png).
              Not worth the tradeoff for a 2px blur nobody would notice.
            */}
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
    </section>
  );
}
