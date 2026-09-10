import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import testimonials from "@/content/testimonials.json";
import type { Testimonial } from "@/content/types";

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="flex w-[340px] shrink-0 flex-col gap-6 rounded-[20px] border border-[var(--color-alpha)] bg-gradient-to-b from-[var(--color-misty)] to-[var(--color-misty-0)] px-6 py-[30px] sm:w-[387px]">
      <p className="text-[length:var(--text-body2)] text-[var(--color-omega-80)]">{item.quote}</p>
      <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0" aria-hidden />
      <div className="flex items-center gap-3">
        <Image src={item.avatar} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
        <div className="flex flex-col">
          <span className="text-[length:var(--text-body2)] text-white">{item.name}</span>
          <span className="text-[length:var(--text-body3)] text-[var(--color-omega-60)]">{item.company}</span>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const items = testimonials as Testimonial[];
  const loop = [...items, ...items];

  return (
    <section className="flex w-full flex-col items-center gap-[72px] border-t border-black bg-[radial-gradient(circle_at_50%_0%,rgba(15,9,18,1)_0%,rgba(8,5,9,1)_50%,rgba(0,0,0,1)_100%)] py-16">
      <Reveal className="flex flex-col items-center gap-4 px-6 text-center">
        <Tag>Testimonials</Tag>
        <h2 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
          Hear from Our User
        </h2>
        <p className="text-[length:var(--text-h5)] text-[#797b85]">Read how our users have achieved success</p>
      </Reveal>

      <div
        className="relative w-full overflow-hidden py-3.5"
        style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
        data-testid="testimonial-slider"
      >
        <div className="animate-marquee-slow flex w-max items-center gap-[19px]">
          {loop.map((item, i) => (
            <TestimonialCard key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
