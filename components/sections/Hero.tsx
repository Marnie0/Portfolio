import { Icon } from '@/components/ui/Icon';
import { siteConfig } from '@/lib/site';

const socials = [
  { href: siteConfig.socials.github, label: 'GitHub', icon: 'github' },
  { href: siteConfig.socials.linkedin, label: 'LinkedIn', icon: 'linkedin' },
] as const;

const stats = [
  { value: '10+', label: 'Projects' },
  { value: '20+', label: 'Repos' },
] as const;

/**
 * The hero is deliberately a *server* component with CSS-only animation.
 *
 * The <h1> is this page's LCP element. Animating it with Framer Motion would
 * server-render it at `opacity: 0` and leave it invisible until hydration —
 * pushing LCP out by however long the JavaScript takes to boot, and hiding the
 * page entirely if it never does. CSS keyframes start at first paint instead,
 * ship no JavaScript, and are already neutralised by the reduced-motion rule
 * in `globals.css`.
 */
export function Hero() {
  const nameWords = siteConfig.name.split(' ');

  /** Staggered entrance, expressed as an animation-delay per element. */
  const rise = (delay: number) => ({ animationDelay: `${delay}s` });

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 lg:flex lg:min-h-svh lg:items-center"
    >
      {/* Decorative background layers — all CSS, no image requests. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(70%_60%_at_50%_35%,black,transparent)]" />
        <div className="absolute left-1/2 top-[-18%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.035] mix-blend-overlay dark:opacity-[0.06]" />
      </div>

      <div className="mx-auto w-full max-w-content px-5 sm:px-8">
        <p
          style={rise(0)}
          className="inline-flex animate-rise items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur"
        >
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {siteConfig.availability}
        </p>

        <h1
          id="hero-heading"
          className="mt-7 animate-slide font-display text-display text-balance"
        >
          {nameWords.map((word, index) => (
            // The surname carries the accent, giving the type a focal point.
            <span key={word} className="mr-[0.25em] inline-block">
              <span className={index === nameWords.length - 1 ? 'italic text-accent-text' : ''}>
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-xl animate-slide text-lg font-medium leading-relaxed text-fg text-pretty sm:text-xl">
          {siteConfig.role}
        </p>

        <div style={rise(0.22)} className="mt-9 flex animate-rise flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            View work
            <Icon
              name="arrowRight"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-fg/30 hover:bg-surface-muted"
          >
            <Icon name="mail" className="h-4 w-4" />
            Contact me
          </a>
          <a
            href={siteConfig.resumeUrl}
            download
            className="inline-flex items-center gap-2 rounded-full px-3 py-3 text-sm font-medium text-muted underline-offset-4 transition-colors duration-200 hover:text-fg hover:underline"
          >
            <Icon name="download" className="h-4 w-4" />
            Résumé
          </a>
        </div>

        <div
          style={rise(0.3)}
          className="mt-12 flex animate-rise flex-col gap-8 sm:flex-row sm:items-center sm:gap-12"
        >
          <ul className="flex items-center gap-3">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-fg/30 hover:text-fg"
                >
                  <Icon name={social.icon} className="h-4 w-4" title={social.label} />
                </a>
              </li>
            ))}
          </ul>

          <dl className="flex items-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl leading-none">{stat.value}</span>
                  <span aria-hidden className="mt-1.5 block text-xs text-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-muted transition-colors hover:text-fg lg:block"
      >
        <span aria-hidden className="block animate-nudge">
          <Icon name="chevronDown" className="h-5 w-5" />
        </span>
      </a>
    </section>
  );
}
