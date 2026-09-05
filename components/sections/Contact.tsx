import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ContactForm } from './ContactForm';
import { siteConfig } from '@/lib/site';

type Channel = {
  href: string;
  label: string;
  value: string;
  icon: IconName;
  external?: boolean;
};

const channels: Channel[] = [
  {
    href: `mailto:${siteConfig.email}`,
    label: 'Email',
    value: siteConfig.email,
    icon: 'mail',
  },
  {
    href: siteConfig.socials.github,
    label: 'GitHub',
    value: '@Marnie0',
    icon: 'github',
    external: true,
  },
  {
    href: siteConfig.socials.linkedin,
    label: 'LinkedIn',
    value: 'in/ibrahim-hassan-552692239',
    icon: 'linkedin',
    external: true,
  },
];

const rowClass =
  'group flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3.5 transition-colors duration-200 hover:border-accent/45';

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading
        id="contact"
        eyebrow="Contact"
        title="Let's build something"
        description="Open to freelance work and collaboration. Email, phone or WhatsApp — whichever suits you."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-7">
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.18em] text-muted">Get in touch</h3>
              <ul className="mt-5 space-y-2.5">
                {/* Phone sits in its own row so the WhatsApp action can be a
                    sibling link — nesting it inside the tel link would be
                    invalid markup and unreachable by keyboard. */}
                <li className="flex items-stretch gap-2.5">
                  <a href={`tel:${siteConfig.phone.tel}`} className={`${rowClass} flex-1`}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-muted text-muted transition-colors duration-200 group-hover:text-accent-text">
                      <Icon name="phone" className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-fg">Phone</span>
                      <span className="block truncate text-xs text-muted">
                        {siteConfig.phone.display}
                      </span>
                    </span>
                  </a>

                  <a
                    href={siteConfig.phone.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Message ${siteConfig.phone.display} on WhatsApp (opens in a new tab)`}
                    title="Chat on WhatsApp"
                    className="grid w-14 shrink-0 place-items-center rounded-2xl border border-border bg-surface text-[#25D366] transition-colors duration-200 hover:border-[#25D366]/60 hover:bg-[#25D366]/10"
                  >
                    <Icon name="whatsapp" className="h-5 w-5" />
                  </a>
                </li>

                {channels.map((channel) => (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className={rowClass}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-muted text-muted transition-colors duration-200 group-hover:text-accent-text">
                        <Icon name={channel.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-fg">{channel.label}</span>
                        <span className="block truncate text-xs text-muted">{channel.value}</span>
                      </span>
                      <Icon
                        name="arrowUpRight"
                        className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-surface-muted/60 p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-fg">
                <Icon name="mapPin" className="h-4 w-4 text-accent-text" />
                {siteConfig.location}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{siteConfig.availability}.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
