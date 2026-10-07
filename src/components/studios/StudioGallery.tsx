import Image from "next/image";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import type { StudioImage } from "@/content/types";

/**
 * Secondary photo grid for /studios, below the main hero shot of the floor.
 * CMS-managed (getStudioGallery()) -- same lightweight {id, imageUrl, order}
 * shape as the Home circle-ticker, plus an optional caption, so content
 * owners can drop in more real studio/gear photos without a publish toggle
 * to manage. Falls back to the two real equipment shots already shipped in
 * this repo until the CMS has real photos of its own.
 */
function GalleryCard({ image }: { image: StudioImage }) {
  return (
    <RevealItem className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[var(--color-omega-10)]">
      <Image src={image.imageUrl} alt={image.caption ?? ""} fill className="object-cover" />

      <Image src="/assets/card/bracket-left.png" alt="" width={18} height={18} className="absolute left-2 top-2 opacity-60" />
      <Image
        src="/assets/card/bracket-left.png"
        alt=""
        width={18}
        height={18}
        className="absolute right-2 top-2 -scale-x-100 opacity-60"
      />
      <Image
        src="/assets/card/bracket-left.png"
        alt=""
        width={18}
        height={18}
        className="absolute bottom-2 left-2 -scale-y-100 opacity-60"
      />
      <Image
        src="/assets/card/bracket-left.png"
        alt=""
        width={18}
        height={18}
        className="absolute bottom-2 right-2 -scale-x-100 -scale-y-100 opacity-60"
      />

      {image.caption && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 text-[length:var(--text-body3)] text-white">
          {image.caption}
        </span>
      )}
    </RevealItem>
  );
}

export function StudioGallery({ images }: { images: StudioImage[] }) {
  if (images.length === 0) return null;

  return (
    <Reveal stagger className="grid w-full max-w-[1160px] grid-cols-2 gap-5 sm:grid-cols-3">
      {images.map((image) => (
        <GalleryCard key={image.id} image={image} />
      ))}
    </Reveal>
  );
}
