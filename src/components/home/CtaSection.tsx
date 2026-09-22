import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { copy } from "@/content/copy";

export function CtaSection() {
  return (
    <section className="flex w-full items-center justify-center px-6 pt-20 lg:px-[120px]">
      <Reveal className="relative w-full max-w-[1000px] overflow-hidden rounded-[20px] border border-white/[0.07] bg-black">
        {/*
          Figma's "Section - CTA" > "image" (5075:25490) is a FIXED
          1000x462 asset (bpou_card_bg.svg's own natural size), not a
          percentage of the card -- a previous pass used h-[86.58%]
          (462/533, guessed against an assumed ~533px card height instead
          of reading the node's real absolute size). This card's actual
          height is content-driven (~500px, shorter than that guess), so
          86.58% rendered the image at ~431px -- short enough that the
          glow's own built-in falloff read as "done" well before the box
          even ended, leaving a hard black band under the button
          (ss/visual_bug3.png). `aspect-[1000/462]` reproduces the asset's
          real proportions at any card width instead of a height guess.
        */}
        <img
          src="/assets/bpou_card_bg.svg"
          alt=""
          className="pointer-events-none absolute inset-x-0 top-0 aspect-[1000/462] w-full object-cover"
        />
        <div className="relative flex flex-col items-center gap-10 px-6 py-16 text-center sm:px-12 lg:px-[50px]">
          <div className="flex max-w-[680px] flex-col items-center gap-4">
            <Tag>{copy.cta.tag}</Tag>
            <h2 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
              {copy.cta.heading}
            </h2>
          </div>
          <p className="max-w-[680px] text-[length:var(--text-body3)] tracking-[-0.2px] text-white/60">{copy.cta.body}</p>
          <Button href="/contact" variant="primary">
            {copy.cta.cta}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
