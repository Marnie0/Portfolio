/**
 * Last-resort site URL, used when NEXT_PUBLIC_SITE_URL is absent or unusable.
 * It only has to be a *parseable* absolute URL so `new URL()` cannot throw
 * during the build; the real value is set per environment.
 *
 * example.com is reserved by IANA (RFC 2606) and can never belong to anyone,
 * so if this ever leaks into a canonical tag or sitemap it points nowhere
 * rather than at a stranger's site.
 */
const FALLBACK_SITE_URL = 'https://example.com';

/**
 * Resolves the public site URL, never throwing.
 *
 * `process.env.X ?? fallback` was not enough: a variable that exists but is
 * empty is the string '', which passes a nullish check and then throws
 * `TypeError: Invalid URL` inside `new URL()` while Next collects metadata —
 * failing the build. Blank and unparseable values are treated as absent, and a
 * bare host like "my-site.vercel.app" gets a scheme so it still works.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_SITE_URL;

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    // `.origin` also normalises away any path or trailing slash, so callers can
    // safely append paths such as `${siteConfig.url}/sitemap.xml`.
    return new URL(withScheme).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

/** Site-wide configuration used for SEO metadata, sitemap and structured data. */
export const siteConfig = {
  name: 'Ibrahim Hassan',
  /** Shown in the browser tab and as the Open Graph site name. */
  shortName: 'Ibrahim H.',
  role: 'Software Engineer | Full-Stack Developer',
  tagline: 'Full-stack developer',
  description:
    'Portfolio of Ibrahim Hassan, a full-stack developer based in Cairo, Egypt, with a stronger pull toward backend engineering, problem solving and the systems behind the interface.',
  email: 'masrawynb10@gmail.com',
  /** `display` is what users read; `tel` and `whatsapp` are the machine forms. */
  phone: {
    display: '+20 107 043 9165',
    tel: '+201070439165',
    whatsapp: 'https://wa.me/201070439165',
  },
  location: 'Cairo, Egypt',
  availability: 'Open to freelance & collaboration',
  /** Set NEXT_PUBLIC_SITE_URL in production so absolute OG URLs resolve. */
  url: resolveSiteUrl(),
  socials: {
    github: 'https://github.com/Marnie0',
    linkedin: 'https://www.linkedin.com/in/ibrahim-hassan-552692239/',
  },
  resumeUrl: '/CV.pdf',
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Monogram for the logo badge: the first letter of the first and last name,
 * so "Ibrahim Hassan" reads "IH". Taking only `name.charAt(0)` gave "I".
 * A single-word name yields a single letter rather than a doubled one.
 */
export const initials = (() => {
  const words = siteConfig.name.trim().split(/\s+/);
  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
})();

/**
 * Nav order mirrors the section order on the page.
 *
 * Section links are root-relative (`/#about`, not `#about`) so they also work
 * from a standalone page such as /articles. On the home page the browser still
 * treats them as same-document fragment navigation, so scrolling stays smooth.
 */
export const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#education', label: 'Education' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#services', label: 'Services' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#achievements', label: 'Achievements' },
  { href: '/articles', label: 'Articles' },
  { href: '/#contact', label: 'Contact' },
] as const;
