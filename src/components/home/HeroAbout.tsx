import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { clients } from "@/content";
import { copy } from "@/content/copy";

export function HeroAbout() {
  const loopClients = [...clients, ...clients, ...clients];

  return (
    <section
      id="about"
      className="flex w-full scroll-mt-24 flex-col items-center gap-16 px-6 py-20 sm:px-12 lg:px-[183px] lg:pt-[40px]"
    >
      <Reveal className="flex w-full max-w-[999px] flex-col items-center gap-6">
        <Tag>{copy.heroAbout.tag}</Tag>
        <h1 className="px-0 py-6 text-center text-[36px] font-bold leading-[1.3] text-white sm:text-[44px] lg:px-[90px] lg:text-[length:var(--text-h1)]">
          {copy.heroAbout.heading}
        </h1>
        <Button href="/contact" variant="primary">
          {copy.heroAbout.cta}
        </Button>
      </Reveal>

      <div className="flex w-full max-w-[430px] flex-col items-start gap-5">
        <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0" aria-hidden />
        <div
          className="relative h-20 w-full overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
          data-testid="client-logo-ticker"
        >
          <div className="animate-marquee flex w-max items-center gap-16 py-5">
            {loopClients.map((client, i) => (
              <Image
                key={`${client.name}-${i}`}
                src={client.image}
                alt={client.name}
                width={120}
                height={40}
                className="h-10 w-auto object-contain opacity-50 grayscale"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
