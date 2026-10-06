/**
 * Section-level marketing copy that used to be hardcoded directly in JSX.
 * Centralizing it here does two things: it's the seam a future CMS-backed
 * "site content" entity would slot into (swap the object below for a fetch,
 * components don't change), and it's the same seam an i18n setup would key
 * off of per-locale -- neither is wired up yet, this just stops new copy
 * from landing back inside components.
 */
export const copy = {
  contact: {
    heading: "Your Story Deserves the Spotlight",
    body: "We believe every collaboration starts with a spark. Whether you need a full-scale production or creative editing support, our team is ready to roll.",
  },
  heroAbout: {
    tag: "About Us",
    heading: "We turn ideas into cinematic experiences through the power of film and photography.",
    cta: "Book an Appointment",
  },
  featuredIntro: {
    liveLabel: "Creative Agency",
    headline: "Blending art, motion, and emotion",
    headlineSecondary: {
      muted: "Beyond Visuals.",
      bold: "Built with Vision.",
    },
  },
  projectsTeaser: {
    tag: "Projects",
    heading: ["A glimpse through our", "Perspective"],
    body: "We transform your vision into reality with creative editorial and portrait photography.",
    cta: "Get in Touch",
  },
  services: {
    tag: "Services",
    heading: "How can we assist you today?",
    subheading: "Read how our users have achieved success",
  },
  studios: {
    tag: "Studios",
    heading: "What we do, built for every production",
    body: "From first frame to final grade, our studio brings the crew, the gear, and the craft to bring your story to life.",
  },
  about: {
    tag: "About Us",
    heading: "The people behind the camera",
    body: "A small crew of directors, shooters, and editors who've spent the last decade turning briefs into films worth watching.",
  },
  testimonials: {
    tag: "Testimonials",
    heading: "Hear from Our User",
    subheading: "Read how our users have achieved success",
  },
  cta: {
    tag: "Become a Part of Us",
    heading: "Ready to create something unforgettable?",
    body: "From concept to final cut, we turn imagination into emotion. Tell us your vision — and let's make it real.",
    cta: "Book an Appointment",
  },
  projectCard: {
    viewNow: "View Now",
  },
  projectModal: {
    getInTouch: "Get in Touch",
    viewCaseStudy: "View full case study",
  },
  navDrawer: {
    menuLabel: "MENU",
    emailLabel: "(EMAIL)",
    socialsLabel: "(SOCIALS)",
  },
};
