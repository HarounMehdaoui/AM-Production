import { redirect } from "next/navigation";

/**
 * Same situation as /about: no "Studios" frame exists in the Figma file.
 * "Studios" in the nav refers to the Services section on Home (id="studios"),
 * so a direct hit on this legacy route sends visitors there instead of a
 * dead stub page.
 */
export default function StudiosPage() {
  redirect("/#studios");
}
