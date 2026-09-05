import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ContactForm } from './ContactForm';
import { getSiteSettings, getSocialLinks, socialIcon } from '@/lib/content-db/settings';

type Channel = {
  href: string;
  label: string;
  value: string;
  icon: IconName;
  external?: boolean;
};


const rowClass =
  'group flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3.5 transition-colors duration-200 hover:border-accent/45';

export async function Contact() {
  const [settings, socials] = await Promise.all([getSiteSettings(), getSocialLinks()]);

  const channels: Channel[] = [
    {
      href: `mailto:${settings.email}`,
      label: 'Email',
      value: settings.email,
      icon: 'mail',
    },
    ...socials.map((social) => ({
      href: social.url,
      label: social.label,
      value: social.display || social.url,
      icon: socialIcon(social.icon),
      external: true,
    })),
  ];

  return (
    <Section id="contact">
      <SectionHeading
        id="contact"
        eyebrow={settings.contact_eyebrow}
        title={settings.contact_title}
        description={settings.contact_description}
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
                  <a href={`tel:${settings.phone_tel}`} className={`${rowClass} flex-1`}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-muted text-muted transition-colors duration-200 group-hover:text-accent-text">
                      <Icon name="phone" className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-fg">Phone</span>
                      <span className="block truncate text-xs text-muted">
                        {settings.phone_display}
                      </span>
                    </span>
                  </a>

                  <a
                    href={settings.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Message ${settings.phone_display} on WhatsApp (opens in a new tab)`}
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
                {settings.location}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{settings.availability}.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
