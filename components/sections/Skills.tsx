import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { SkillCard } from '@/components/ui/SkillCard';
import { skillGroups, spokenLanguages } from '@/lib/content';

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        id="skills"
        eyebrow="Skills"
        title="The stack I reach for"
        description="Grouped by where each piece sits in a project, from the language up to the tools around it."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          // Stagger across each row rather than the whole grid, so later rows
          // are not still waiting when they scroll into view.
          <SkillCard key={group.id} group={group} delay={(index % 3) * 0.08} />
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-12 border-t border-border pt-8">
          <h3 className="text-xs uppercase tracking-[0.18em] text-muted">Languages</h3>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {spokenLanguages.map((language) => (
              <li
                key={language.name}
                className="flex items-baseline gap-2 rounded-lg border border-border bg-surface px-3 py-1.5"
              >
                <span className="text-sm font-medium text-fg">{language.name}</span>
                <span className="font-mono text-xs text-muted">{language.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
