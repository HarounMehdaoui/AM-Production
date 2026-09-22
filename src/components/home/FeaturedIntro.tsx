import Image from "next/image";
import { copy } from "@/content/copy";

/**
 * Figma "Hero Banner" (17:11436, Components page) -- confirmed via
 * get_design_context after earlier attempts on the live Home frame kept
 * truncating before reaching this content. Real structure, all measurements
 * below are straight from that node:
 *
 * - "Container Hero" (17:11349), the actual visible card, is 1270x623 --
 *   aspect ~2.038:1, notably wider/shorter than 16:9, and sits only 48px in
 *   from each edge of the 1366-wide "Hero Banner" root (1270 centered in
 *   1366 via justify-center, no horizontal padding of its own). An earlier
 *   pass fixed the card's aspect ratio but left the SECTION wrapper on
 *   `lg:px-[183px]` (borrowed from HeroAbout's own margin, not this node)
 *   and the card on `max-w-[1000px]` (a pre-Figma-data guess) -- together
 *   those squeezed the correctly-shaped card down to ~1000px inside huge
 *   side gutters instead of Figma's near-full-bleed ~1270px, which is why
 *   everything inside it (video, scratch, brackets) rendered tiny relative
 *   to the page even though their own percentages were already correct
 *   (ss/video_shouldnt_look_like_this.png). Fixed below: `lg:px-12` (48px)
 *   and `max-w-[1270px]`.
 * - "video" (17:11351): a single centered rectangle, ~40.55% of the banner's
 *   width and ~62.12% of its height (515/1270, 387/623) -- NOT edge-to-edge.
 *   Figma can't embed a playable video, so this was a static placeholder
 *   image; the real asset is public/assets/banner_video.mp4 (confirmed via
 *   ffprobe/ffmpeg: 1920x1080 H.264, COLOR, with the diagonal parallelogram
 *   crop already baked into the footage itself -- no CSS clip-path/rotation
 *   needed, just render it and let object-contain show the shape as-is).
 *   Rendered in B&W via a CSS `grayscale` filter (confirmed the source
 *   footage is color, not baked-in monochrome).
 * - The purple "scratch" overlay (17:11385) is the exact same rotated,
 *   cropped scratche graphic as Tag.tsx's Dotted-Highlight-Tag decoration
 *   (rotate(-119.35deg), same inset crop keeping only the natural ~56%-width
 *   band) scaled up ~10.32x (780.555px container vs Tag's 75.631px) and
 *   composited with `mix-blend-multiply` instead of Tag's plus-lighter --
 *   multiply reads as vivid purple over the video's brighter midtones and
 *   sinks toward black over its shadows, matching ss/missing_video.png.
 * - "rec icon" (Property 1=Default): a plain 14px-diameter white circle at
 *   50% opacity, no ring/color -- given a genuine blink here (`animate-blink-dot`,
 *   defined in globals.css) per the explicit ask; Figma's own asset is static
 *   the same way every other "animated" element in this file has no
 *   extractable motion data.
 *
 * NOT PREVIOUSLY IMPLEMENTED (added now -- flagged by user review against
 * ss/video_should_look_like_this.png, which shows this text; an earlier
 * pass had the video/scratch/brackets right but silently dropped the two
 * headline blocks, which is also most of why the composition read as too
 * small/empty relative to the reference):
 * - "Section Tittle" (17:11367): "Creative Agency" is NOT a standalone
 *   top-left corner badge -- it's the first line of this same left-side
 *   text block, immediately above "Blending art, motion, and emotion"
 *   (56px bold white, tracking -2px, 540px/42.5% wide). Block origin:
 *   left 76px (5.98%), top `50% - 168.41px` (22.97% from the card top).
 * - "Headline" (17:11796): "Beyond Visuals." (56px bold, white/60%) over
 *   "Built with Vision." (56px bold, white), right-aligned, blur(2px).
 *   Origin: left 949px (74.72%), top 364px (58.43%), 271px/21.34% wide.
 * Both use fixed 56px Figma type with no XS/mobile frame data available
 * (same caveat as every other breakpoint gap in this file) -- stepped down
 * at sm/lg and hidden below sm rather than guessing a mobile layout, since
 * at mobile card widths (~300px) 56px text would overflow regardless.
 */
export function FeaturedIntro() {
  return (
    <section className="flex w-full justify-center px-6 pt-10 sm:px-12 lg:px-12">
      <div className="relative flex aspect-[1270/623] w-full max-w-[1270px] items-end justify-between overflow-hidden rounded-[24px] border border-white/10 bg-black p-4">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/*
            object-cover, not object-contain: the video box is 514x386
            (~1.331:1) but the real footage is 1920x1080 (1.778:1). Figma's
            own placeholder in that box is a pre-cropped static image with
            no aspect mismatch to resolve, so it always filled the box
            edge-to-edge -- contain on the real (wider) video instead
            letterboxes it to ~514x289 with ~48px of empty black top and
            bottom INSIDE the box, rendering the diagonal shape visibly
            smaller than the reference even though the box itself is sized
            correctly. Cover crops ~4.5% off each side of the 1920px-wide
            source instead, which the baked-in diagonal comfortably
            tolerates (it doesn't touch the frame's left/right edges).
          */}
          {/*
            Video rendered at 2x via `scale-[2]` on the <video> element
            itself, not by resizing this wrapper -- the wrapper stays
            514x386-equivalent (40.55%/62.12% of the card, matching Figma's
            box) so neighboring layout is untouched; only the painted video
            overflows it, contained by the outer card's own
            `overflow-hidden` rather than growing anything.
          */}
          <div className="relative h-[62.12%] w-[40.55%] bg-[#0d0d0d]">
            <video
              className="size-full scale-[2] object-cover grayscale"
              src="/assets/banner_video.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>

          {/* "scratche" (17:11385), scaled ~10.32x from the Tag version. */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 flex size-[57%] -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-multiply"
          >
            <div className="relative h-full w-[55.58%] rotate-[-119.35deg]">
              <Image src="/assets/icons/scratch.svg" alt="" fill className="object-contain" />
            </div>
          </div>
        </div>

        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={22}
          height={22}
          className="absolute left-4 top-4 opacity-60"
        />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={22}
          height={22}
          className="absolute right-4 top-4 -scale-x-100 opacity-60"
        />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={22}
          height={22}
          className="absolute bottom-4 left-4 -scale-y-100 opacity-60"
        />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={22}
          height={22}
          className="absolute bottom-4 right-4 -scale-x-100 -scale-y-100 opacity-60"
        />

        {/* "Section Tittle" (17:11367): left 5.98%, top 22.97%. */}
        <div className="absolute left-[5.98%] top-[22.97%] flex flex-col items-start gap-[10px]">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span
              className="motion-reduce:animate-none size-3.5 animate-blink-dot rounded-full bg-white/50"
              aria-hidden
            />
            <span className="text-[length:var(--text-body3)] text-white/80">{copy.featuredIntro.liveLabel}</span>
          </div>
          {/*
            <p>, not <h1> -- HeroAbout already renders the page's real H1
            ("We turn ideas into cinematic..."); a second H1 here broke
            fonts.spec.ts's `getByRole('heading', { level: 1 })` locator
            (strict-mode violation, 2 matches) and is the wrong semantic
            level for a decorative tagline inside a card anyway.
          */}
          <p className="hidden text-[56px] font-bold leading-[56px] tracking-[-2px] text-white lg:block lg:max-w-[540px]">
            {copy.featuredIntro.headline}
          </p>
        </div>

        {/*
          Both text blocks: hidden below `lg`, not `sm` -- at tablet widths
          (e.g. 768px, card ~672px) both blocks fit without clipping the
          card bounds, but wrapped to 3-4 lines each and crowded right up
          against the video with only ~8px of breathing room, unlike the
          desktop reference. No Figma tablet frame exists for this text to
          confirm an intentional smaller layout, so it only appears once
          there's room to match the reference's actual proportions (lg+);
          tablet/mobile keep the clean video-only card, already verified
          against ss/video_should_look_like_this.png at 375px.
        */}
        {/* "Headline" (17:11796): left 74.72%, top 58.43%, right-aligned, blurred. */}
        <div className="absolute left-[74.72%] top-[58.43%] hidden w-[21.34%] min-w-[140px] flex-col text-right text-[56px] font-bold leading-[56px] tracking-[-2px] blur-[2px] lg:flex">
          <span className="text-white/60">{copy.featuredIntro.headlineSecondary.muted}</span>
          <span className="text-white">{copy.featuredIntro.headlineSecondary.bold}</span>
        </div>

        <Image
          src="/assets/card/aperture-hover.svg"
          alt=""
          width={20}
          height={20}
          className="absolute right-6 top-6 opacity-70"
        />

        {/* Decorative pagination dots (Figma shows 3 for a single-video
            banner) -- not interactive, so no tablist/tab roles. */}
        <div aria-hidden className="relative flex gap-2 pb-2 pl-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`size-2.5 rounded-full border border-white/60 ${i === 0 ? "bg-white" : "bg-transparent"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
