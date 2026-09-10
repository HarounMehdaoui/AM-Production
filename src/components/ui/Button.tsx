import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary";

const base =
  "inline-flex items-center justify-center rounded-[10px] px-4 py-2 font-medium text-[length:var(--text-button2)] leading-[1.5] tracking-[-0.5px] backdrop-blur-[var(--blur-glass)] transition-transform duration-200 ease-out hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-accent)] text-[var(--color-omega-80)] border border-[var(--color-omega-10)]",
  secondary: "bg-[rgba(255,255,255,0.1)] text-[var(--color-omega)]",
  tertiary:
    "border border-[var(--color-omega-10)] text-[var(--color-omega)] bg-transparent",
};

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  onClick,
  type = "button",
}: {
  href?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
