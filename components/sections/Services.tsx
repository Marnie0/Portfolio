import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';
import { services } from '@/lib/content';

export function Services() {
  return (
    <Section id="services" className="bg-surface-muted/40">
      <SectionHeading
        id="services"
        eyebrow="Services"
        title="How I can help"
        description="Freelance and collaboration work — from a responsive frontend through to the API and database behind it."
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal as="li" key={service.id} delay={index * 0.06}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/45">
              {/* Accent wash that fades in on hover — opacity only, no repaint cost. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <span className="inline-grid h-11 w-11 place-items-center rounded-xl border border-border bg-accent-soft text-accent-text">
                <Icon name={service.icon} className="h-5 w-5" />
              </span>

              <h3 className="mt-5 font-display text-xl leading-snug">{service.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted text-pretty">
                {service.description}
              </p>

              <ul className="mt-5 space-y-2 border-t border-border pt-5">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-start gap-2.5 text-sm text-muted">
                    <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-text" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
