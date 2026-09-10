"use client";

import { useState, type FormEvent } from "react";

const fieldCls =
  "w-full rounded-lg bg-[rgba(51,51,51,0.2)] p-3 text-[length:var(--text-body3)] text-white placeholder:text-[#707070] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]";
const labelCls = "text-[length:var(--text-body4)] font-medium tracking-[-0.5px] text-white";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex w-full flex-col items-center gap-2 rounded-[21px] border border-white/10 bg-black p-10 text-center"
      >
        <p className="text-[length:var(--text-h5)] font-bold text-white">Message sent</p>
        <p className="text-[length:var(--text-body3)] text-white/60">
          Thanks for reaching out — we&rsquo;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-[30px] rounded-[21px] border border-[rgba(255,255,255,0.1)] bg-black px-6 pb-[30px] pt-10 sm:px-10"
    >
      <div className="flex flex-col gap-6 sm:flex-row">
        <label className="flex flex-1 flex-col gap-3.5">
          <span className={labelCls}>First name*</span>
          <input required name="firstName" autoComplete="given-name" className={fieldCls} placeholder="Jane" />
        </label>
        <label className="flex flex-1 flex-col gap-3.5">
          <span className={labelCls}>Last Name*</span>
          <input required name="lastName" autoComplete="family-name" className={fieldCls} placeholder="Doe" />
        </label>
      </div>

      <label className="flex flex-col gap-3.5">
        <span className={labelCls}>How can we reach you?*</span>
        <input required type="email" name="email" autoComplete="email" className={fieldCls} placeholder="jane@studio.com" />
      </label>

      <label className="flex flex-col gap-3.5">
        <span className={labelCls}>Message*</span>
        <textarea required name="message" rows={3} className={fieldCls} placeholder="Tell us about your project" />
      </label>

      <button
        type="submit"
        className="w-full rounded-[10px] border border-[var(--color-omega-10)] bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-accent)] px-4 py-2 text-[length:var(--text-button2)] font-medium tracking-[-0.5px] text-[var(--color-omega-80)] backdrop-blur-[var(--blur-glass)] transition-transform duration-200 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        Submit Now
      </button>
    </form>
  );
}
