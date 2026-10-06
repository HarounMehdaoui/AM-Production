import Image from "next/image";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import type { TeamMember } from "@/content/types";

/**
 * Team roster grid for /about. Same card-grid shape as ProjectsGrid (3
 * columns at lg, stacking down to 1 on mobile), and the same
 * border/radius/gradient vocabulary as TestimonialsSection's cards --
 * just a portrait-photo card instead of a quote card.
 */
function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <RevealItem className="flex flex-col gap-5 rounded-[20px] border border-[var(--color-omega-10)] bg-gradient-to-b from-[var(--color-misty)] to-[var(--color-misty-0)] p-6">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[var(--color-omega-10)]">
        {member.photo ? (
          <Image src={member.photo} alt="" fill className="object-cover" />
        ) : (
          // No real photo uploaded yet -- same reasoning as ProjectCard's
          // placeholder: a brand-toned gradient, not invented stock
          // photography or a broken/empty image.
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-[var(--color-secondary)]/30 via-[var(--color-alpha)] to-[var(--color-primary)]/20">
            <span className="text-[length:var(--text-h2)] font-bold text-white/60">{initials(member.name)}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[length:var(--text-body2)] font-medium text-white">{member.name}</h3>
        <p className="text-[length:var(--text-body3)] text-[var(--color-link)]">{member.role}</p>
      </div>
      <p className="text-[length:var(--text-body3)] text-[var(--color-omega-60)]">{member.bio}</p>
    </RevealItem>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <Reveal stagger className="grid w-full max-w-[1160px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </Reveal>
  );
}
