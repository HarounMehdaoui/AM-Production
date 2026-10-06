import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "Contact — Alpha Motion",
};

export default function ContactPage() {
  return (
    <section className="flex w-full flex-col lg:flex-row lg:items-stretch">
      {/* Visual panel -- stacks above the form on mobile, sits left of it on
          desktop. Same corner-bracket treatment as FeaturedIntro/ProjectCard
          rather than a new image style. */}
      <div className="relative h-64 w-full overflow-hidden sm:h-96 lg:h-auto lg:w-1/2">
        <Image src="/assets/support/studio-wide.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent lg:bg-gradient-to-r" aria-hidden />
        <Image src="/assets/card/bracket-left.png" alt="" width={22} height={22} className="absolute left-4 top-4 opacity-60" />
        <Image src="/assets/card/bracket-left.png" alt="" width={22} height={22} className="absolute right-4 top-4 -scale-x-100 opacity-60" />
        <Image src="/assets/card/bracket-left.png" alt="" width={22} height={22} className="absolute bottom-4 left-4 -scale-y-100 opacity-60" />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={22}
          height={22}
          className="absolute bottom-4 right-4 -scale-x-100 -scale-y-100 opacity-60"
        />
      </div>

      <div className="flex w-full flex-col items-center gap-10 px-6 py-16 sm:px-12 lg:w-1/2 lg:justify-center lg:px-16 lg:py-20">
        <Reveal className="flex max-w-[500px] flex-col items-center gap-[18px] text-center">
          <h1 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
            {copy.contact.heading}
          </h1>
          <p className="text-[length:var(--text-body2)] text-[#797b85]">{copy.contact.body}</p>
        </Reveal>

        {/*
          Not wrapped in Reveal: on this split layout the form sits well
          below the fold behind a tall hero image, and whileInView's
          scroll-triggered fade genuinely failed to fire under fast/
          programmatic scrolling in testing -- a visitor landing on a page
          whose entire purpose is "fill out this form" should never be able
          to out-scroll the thing they came for. Not worth the animation.
        */}
        <div
          className="w-full max-w-[500px] rounded-[30px] bg-[var(--color-alpha)] p-2.5"
          style={{
            boxShadow:
              "0px -19px 35px rgba(79,26,214,0.4), 0px -0.8px 2px rgba(79,26,214,0.02), 0px -2.4px 6px rgba(79,26,214,0.05), 0px -6.4px 16px rgba(79,26,214,0.13), 0px -20px 50px rgba(79,26,214,0.4)",
          }}
        >
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
