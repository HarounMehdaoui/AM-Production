import Image from "next/image";

/**
 * Figma "Dotted Highlight Tag" (5075:25324) -- small pill label with a purple
 * scratch mark centered behind it.
 *
 * get_design_context on that node revealed two details an earlier version
 * missed, which is what made the mark render as a stray artifact (flagged
 * against ss/artifact1.png) instead of a tight flourish tucked behind the
 * text: (1) the scratch image itself is rotated -119.35deg -- rendered
 * upright, its 4 near-vertical claw strokes read as loose diagonal lines
 * poking out past the pill in every direction; rotated, they bunch into a
 * compact cluster. (2) the rotated image is sized to the SVG's own natural
 * ~30.86x55.54 aspect (not stretched into a 56x56 square), which keeps the
 * cluster narrow instead of ballooning it wider than the pill itself.
 */
export function Tag({ children }: { children: string }) {
  return (
    <span className="relative inline-flex items-center justify-center gap-[5px] rounded-[40px] p-[6px]">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 flex size-[75.631px] -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-plus-lighter"
      >
        <span className="relative block h-[55.538px] w-[30.863px] rotate-[-119.35deg]">
          <Image src="/assets/icons/scratch.svg" alt="" fill className="object-contain" />
        </span>
      </span>
      {/* Optical sizing handled globally via `font-optical-sizing: auto` in
          globals.css -- no per-component opsz override needed here. */}
      <span className="relative bg-gradient-to-r from-white to-white/0 bg-clip-text text-[16px] font-normal tracking-[-0.5px] text-transparent">
        {children}
      </span>
    </span>
  );
}
