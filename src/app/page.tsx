import { FeaturedIntro } from "@/components/home/FeaturedIntro";
import { HeroAbout } from "@/components/home/HeroAbout";
import { ProjectsTeaser } from "@/components/home/ProjectsTeaser";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function Home() {
  return (
    <>
      <FeaturedIntro />
      <HeroAbout />
      <ProjectsTeaser />
      <ServicesSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
