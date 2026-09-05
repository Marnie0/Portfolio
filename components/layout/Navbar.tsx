'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { m, useScroll, useSpring } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { ThemeToggle } from './ThemeToggle';
import { navLinks } from '@/lib/site';

type NavbarProps = {
  /** Passed down from the layout: this is a client component and cannot query. */
  initials: string;
  shortName: string;
};

export function Navbar({ initials, shortName }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 });

  /* Swap in the solid header background once the hero starts scrolling away. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Scroll spy. An IntersectionObserver keeps this off the scroll thread. */
  useEffect(() => {
    const ids = navLinks
      .filter((link) => link.href.startsWith('/#'))
      .map((link) => link.href.slice(2));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = '';
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActiveId(bestRatio > 0 ? best : '');
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  /* Lock background scroll and wire up Escape while the mobile menu is open. */
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    firstMenuLinkRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || menuOpen
          ? 'border-b border-border bg-bg/80 backdrop-blur-md'
          : 'border-b border-transparent',
      ].join(' ')}
    >
      {/* Reading progress. Purely decorative, so it is hidden from AT. */}
      <m.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
      />

      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-5 sm:px-8"
      >
        <a
          href="/#top"
          className="group flex items-center gap-2.5 rounded-md text-sm font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-display text-base tracking-tight text-accent-fg transition-transform duration-300 group-hover:-rotate-6"
          >
            {initials}
          </span>
          <span className="sr-only sm:not-sr-only">{shortName}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href.startsWith('/#')
              ? activeId === link.href.slice(2)
              : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={[
                    'relative rounded-md px-3 py-2 text-sm transition-colors duration-200',
                    isActive ? 'text-fg' : 'text-muted hover:text-fg',
                  ].join(' ')}
                >
                  {link.label}
                  {/* Scales in per-link. A shared `layoutId` would be nicer,
                      but layout animations are not part of the `domAnimation`
                      feature set this app loads. */}
                  <m.span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent"
                    initial={false}
                    animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="/#contact"
            className="hidden rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-85 sm:inline-block"
          >
            Hire me
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-fg lg:hidden"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Mobile menu. Kept in the DOM order right after its trigger so the
          natural tab sequence walks straight into it. */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-border bg-bg lg:hidden"
      >
        <ul className="mx-auto max-w-content px-5 py-4 sm:px-8">
          {navLinks.map((link, index) => (
            <li key={link.href}>
              <a
                ref={index === 0 ? firstMenuLinkRef : undefined}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-border/60 py-3.5 text-base text-fg last:border-0"
              >
                {link.label}
                <Icon name="arrowUpRight" className="h-4 w-4 text-muted" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
