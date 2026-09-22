import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <span className="text-[length:var(--text-body3)] text-[var(--color-omega-50)]">404</span>
      <h1 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
        This page went off camera.
      </h1>
      <p className="max-w-[480px] text-[length:var(--text-body3)] text-[#797b85]">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved.
      </p>
      <Button href="/" variant="primary">
        Back to home
      </Button>
      <Link href="/contact" className="text-[length:var(--text-body3)] text-[var(--color-link)] underline">
        Or get in touch
      </Link>
    </section>
  );
}
