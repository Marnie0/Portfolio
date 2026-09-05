import { Icon, type IconName } from '@/components/ui/Icon';
import { initials, navLinks, siteConfig } from '@/lib/site';

const socials: { href: string; label: string; icon: IconName }[] = [
  { href: siteConfig.socials.github, label: 'GitHub', icon: 'github' },
  { href: siteConfig.socials.linkedin, label: 'LinkedIn', icon: 'linkedin' },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-content px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="/#top" className="inline-flex items-center gap-2.5 text-sm font-semibold">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-display text-base tracking-tight text-accent-fg"
              >
                {initials}
              </span>
              {siteConfig.name}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted">{siteConfig.tagline}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-3 inline-block py-1 text-sm font-medium text-accent-text underline underline-offset-4 hover:text-fg"
            >
              {siteConfig.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted">Sections</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-10">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-block py-1.5 text-sm text-muted transition-colors duration-200 hover:text-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js and Tailwind CSS.
          </p>
          <ul className="flex items-center gap-2">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-fg/30 hover:text-fg"
                >
                  <Icon name={social.icon} className="h-4 w-4" title={social.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
