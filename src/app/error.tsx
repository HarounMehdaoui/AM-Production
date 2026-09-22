"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
        Something went wrong.
      </h1>
      <p className="max-w-[480px] text-[length:var(--text-body3)] text-[#797b85]">
        Our team has been notified. Try again, or head back to the homepage.
      </p>
      <Button onClick={retry} variant="primary">
        Try again
      </Button>
    </section>
  );
}
