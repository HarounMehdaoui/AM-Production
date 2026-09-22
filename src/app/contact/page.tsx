import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { copy } from "@/content/copy";

export const metadata: Metadata = {
  title: "Contact — Alpha Motion",
};

export default function ContactPage() {
  return (
    <section className="flex w-full flex-col items-center gap-16 px-6 py-20 sm:px-12">
      <Reveal className="flex max-w-[837px] flex-col items-center gap-[30px] text-center">
        <h1 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
          {copy.contact.heading}
        </h1>
        <p className="text-[length:var(--text-body2)] text-[#797b85]">{copy.contact.body}</p>
      </Reveal>

      <Reveal
        className="w-full max-w-[792px] rounded-[30px] bg-[var(--color-alpha)] p-2.5"
        style={{
          boxShadow:
            "0px -19px 35px rgba(79,26,214,0.4), 0px -0.8px 2px rgba(79,26,214,0.02), 0px -2.4px 6px rgba(79,26,214,0.05), 0px -6.4px 16px rgba(79,26,214,0.13), 0px -20px 50px rgba(79,26,214,0.4)",
        }}
      >
        <ContactForm />
      </Reveal>
    </section>
  );
}
