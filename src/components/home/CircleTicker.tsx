import Image from "next/image";
import type { ReactNode } from "react";
import { getCircleTickerImages } from "@/content";

/**
 * Figma's "Circle Wrap -> Circle" component (14:16765) is a ~1564px-diameter
 * ring of tilted photo cards. The ring spins continuously (animate-spin-slow).
 *
 * A previous pass placed the 12 cards across only a -90..+90deg arc
 * (reasoning: Figma's raw node data only showed arm rotations up to
 * ~165deg, assumed to mean "half the circle"). That's wrong: since the
 * whole arc rotates as one rigid block, a 180deg arc reads as a lopsided
 * sweep at most rotation angles -- caught only on one side of the
 * viewport, nothing on the other (ss/how_wheel_shouldnt_look.png). A full
 * 360deg distribution is rotationally symmetric, so it reads the same (a
 * dome with cards visible down both sides) at every point in the
 * animation, matching ss/how_wheel_should_look.png. The same 12 real
 * photos are placed twice around the full circle (24 positions, still
 * 15deg apart) rather than stretching 12 photos thin across 360deg.
 *
 * Cropping/fade (ss/how_wheel_shouldnt_look.png vs .../should_look.png):
 * an earlier version used a SHORT, `overflow-hidden` wrapper (height <
 * ring radius + card half-size) to clip the ring, which hard-cropped the
 * TOP of the topmost cards -- the wrong edge. The wrapper is now tall
 * enough that the full top of the ring always renders uncropped, and the
 * BOTTOM alone gets a soft fade via `mask-image` (not `overflow-hidden` +
 * an opaque color div) -- a mask fades the ring's own pixels to
 * transparent gradually, so there's no hard edge at either boundary, only
 * a deliberate gradient at the bottom.
 *
 * `children` renders as a pointer-events-auto overlay centered in the
 * space the arc curves around (roughly bottom-third of the wrapper) --
 * ss/how_wheel_should_look.png shows the "A glimpse through our
 * Perspective" heading sitting inside the wheel's embrace, not as a
 * separate block below it.
 *
 * `children`'s clearance from the CARDS is controlled by its own
 * bottom-padding, NOT the wrapper's height -- see the note beside that
 * padding below for why (increasing wrapper height doesn't change a
 * card-vs-tag distance; it was tried first and measurably did nothing).
 *
 * But the wrapper's height DOES matter for a second, different reason:
 * `children` is bottom-anchored (`absolute ... bottom-0`) with zero
 * padding, so if the overlay's own content is TALLER than the wrapper,
 * its top edge pokes out above the wrapper's top -- and since the
 * wrapper is the whole component's only sizing contribution, that
 * overflow lands in the space right below the (sticky, higher z-index)
 * nav. Measured overlay content height is ~410px at mobile / ~475px at
 * sm+, while the old heights (280/410) were sized ONLY for
 * ring-radius+card-half-size, ~130-65px short -- the "Projects" tag,
 * being the overlay's topmost element, ended up rendered behind the nav
 * bar and effectively invisible (ss/the_scratch_disappears_in_tablet_mode.png:
 * only its scratch decoration -- which slightly overflows above the tag
 * text itself -- peeked out below the nav). lg was already tall enough
 * (560 vs ~475 content) so it never showed this. Heights below are now
 * sized to the taller of (ring-radius+card-half) and (overlay content),
 * not just the ring geometry.
 *
 * The 12-photo count itself is not hardcoded here -- `images` comes from
 * the CMS-managed circle-ticker gallery (unbounded), and whatever count it
 * returns gets doubled and spread evenly around the full circle the same
 * way the original 12 did. Fewer or more photos both still produce a
 * rotationally-symmetric ring; only the spacing between cards changes.
 */
const FADE_MASK =
  "linear-gradient(to bottom, black 0%, black 62%, transparent 92%)";

export async function CircleTicker({ children }: { children?: ReactNode }) {
  const images = await getCircleTickerImages();
  const totalPositions = images.length * 2;
  const positions = Array.from({ length: totalPositions }, (_, i) => ({
    src: images[i % images.length].imageUrl,
    angle: i * (360 / totalPositions),
    key: `pos-${i}`,
  }));

  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none relative z-0 h-[440px] w-full overflow-hidden sm:h-[510px] lg:h-[560px]"
        style={{
          WebkitMaskImage: FADE_MASK,
          maskImage: FADE_MASK,
        }}
      >
        <div
          data-testid="circle-ticker-ring"
          className="animate-spin-slow motion-reduce:animate-none absolute left-1/2 top-full size-[560px] -translate-x-1/2 -translate-y-1/2 [--ring-radius:250px] sm:size-[820px] sm:[--ring-radius:370px] lg:size-[1120px] lg:[--ring-radius:510px]"
        >
          {positions.map(({ src, angle, key }) => (
            <div
              key={key}
              className="absolute left-1/2 top-1/2 size-[52px] overflow-hidden rounded-[14px] border border-white/[0.08] bg-[var(--color-alpha)] shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:size-[70px] sm:rounded-[18px] lg:size-[86px] lg:rounded-[22px]"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--ring-radius) * -1))`,
              }}
            >
              <Image src={src} alt="" fill sizes="100px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-white/15" />
            </div>
          ))}
        </div>
      </div>

      {/*
        pb (not wrapper height) is what actually controls clearance from
        the cards: the ring's rotation center sits at THIS overlay's own
        bottom-anchor point too (both track the wrapper's bottom edge), so
        growing the wrapper shifts the anchor and the overlay down by the
        same amount and cancels out -- increasing wrapper height alone
        does NOT change the tag's distance from center. What actually
        matters is how far the padding pushes content's top (the
        "Projects" tag) UP from that shared anchor point: it needs to
        stay inside a circle of radius `ring-radius - card-half-size`
        around the anchor to guarantee no card ever renders behind it.
        Measured against the tag's real height at each breakpoint, pb-0
        keeps it comfortably inside that radius (was pb-8/10/12,
        ~20-50px too far out, depending on breakpoint).
      */}
      {children && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-0">
          <div className="pointer-events-auto">{children}</div>
        </div>
      )}
    </div>
  );
}
