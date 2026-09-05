import Image from 'next/image';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { getAboutFacts, getSiteSettings } from '@/lib/content-db/settings';

export async function About() {
  const [settings, facts] = await Promise.all([getSiteSettings(), getAboutFacts()]);

  return (
    <Section id="about">
      <SectionHeading id="about" eyebrow={settings.about_eyebrow} title={settings.about_lead} />

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="max-w-prose space-y-5 text-base leading-relaxed text-muted text-pretty sm:text-lg">
            {settings.about_paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.24}>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.id}>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted">{fact.label}</dt>
                  <dd className="mt-1.5 text-sm font-medium text-fg">
                    {/* A single entry reads inline; several stack as lines,
                        which is exactly how the original design behaved. */}
                    {fact.entries.length === 1
                      ? fact.entries[0]
                      : fact.entries.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="lg:col-span-5">
          <figure className="relative isolate">
            <div className="relative overflow-hidden rounded-4xl border border-border bg-surface-muted">
              <Image
                src="/portrait.jpeg"
                alt={`Portrait of ${settings.name}`}
                width={1122}
                height={1402}
                sizes="(min-width: 1024px) 34vw, 90vw"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Offset accent frame adds depth without a second image request. */}
            <div
              aria-hidden
              className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-4xl border border-accent/35"
            />
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
