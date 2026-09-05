import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';
import { achievements } from '@/lib/content';

export function Achievements() {
  return (
    <Section id="achievements" className="bg-surface-muted/40">
      <SectionHeading
        id="achievements"
        eyebrow="Achievements"
        title="Milestones along the way"
        description="Certifications, competitions, talks and the occasional peer-reviewed paper."
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement, index) => (
          <Reveal as="li" key={achievement.id} delay={index * 0.06}>
            <article className="flex h-full flex-col rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/45">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-accent-text">
                  {achievement.type}
                </span>
                <span className="font-mono text-xs text-muted">{achievement.year}</span>
              </div>

              <h3 className="mt-5 font-display text-lg leading-snug text-balance">
                {achievement.title}
              </h3>

              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-fg/70">
                <Icon name="award" className="h-3.5 w-3.5 shrink-0 text-muted" />
                {achievement.issuer}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted text-pretty">
                {achievement.description}
              </p>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
