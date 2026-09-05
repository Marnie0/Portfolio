import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { getEducation } from '@/lib/content-db/education';

export async function Education() {
  const education = await getEducation();

  return (
    <Section id="education" className="bg-surface-muted/40">
      <SectionHeading
        id="education"
        eyebrow="Education"
        title="Where the foundations were laid"
        description="Formal study, plus the professional training that sits alongside it."
      />

      <ol className="mt-14 space-y-0">
        {education.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 0.08} className="group relative">
            <div className="grid gap-x-8 gap-y-4 border-t border-border py-8 sm:grid-cols-12 sm:py-10">
              {/* Timeline rail */}
              <div className="sm:col-span-3">
                <p className="font-mono text-sm text-accent-text">{item.period}</p>
                {item.location && (
                  <p className="mt-1 text-sm text-muted">{item.location}</p>
                )}
              </div>

              <div className="sm:col-span-9">
                <h3 className="font-display text-2xl leading-snug text-balance sm:text-[1.75rem]">
                  {item.degree}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-fg/80">{item.institution}</p>
                <p className="mt-4 max-w-prose text-base leading-relaxed text-muted text-pretty">
                  {item.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
