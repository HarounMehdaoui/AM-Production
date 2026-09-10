import { redirect } from "next/navigation";

/**
 * The Figma file (MAE6trb9cxb8nKwpoBAhVy) has no dedicated "About" frame --
 * only Home, Contact, and Projects have designed screens. "About" in the nav
 * refers to the About block at the top of Home (id="about"), so a direct
 * hit on this legacy route sends visitors there instead of a dead stub page.
 */
export default function AboutPage() {
  redirect("/#about");
}
