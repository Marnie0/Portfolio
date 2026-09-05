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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
  socials: {
    github: 'https://github.com/Marnie0',
    linkedin: 'https://www.linkedin.com/in/ibrahim-hassan-552692239/',
  },
  resumeUrl: '/CV.pdf',
} as const;

export type SiteConfig = typeof siteConfig;

/** Nav order mirrors the section order on the page. */
export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Projects' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
] as const;
