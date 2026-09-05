import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { MotionProvider } from '@/components/ui/MotionProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/lib/site';
import { getSiteSettings, getSocialLinks, initialsFrom } from '@/lib/content-db/settings';

/* Self-hosted at build time by next/font — no render-blocking request to
   Google, and `display: swap` keeps text visible while the face loads. */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
});

/**
 * Async so the title, description and author come from the database like the
 * rest of the site. metadataBase still uses the env var: it is needed at build
 * time, before any query can run.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${settings.name} — ${settings.role}`,
    template: `%s — ${settings.name}`,
  },
  description: settings.description,
  applicationName: settings.name,
  authors: [{ name: settings.name, url: siteConfig.url }],
  creator: settings.name,
  keywords: [
    'full-stack developer',
    'backend engineer',
    'software engineer',
    'React',
    'Next.js',
    'TypeScript',
    'C++',
    'Cairo',
    'portfolio',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteConfig.url,
    siteName: settings.name,
    title: `${settings.name} — ${settings.role}`,
    description: settings.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${settings.name} — ${settings.role}`,
    description: settings.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#0C0B0A' },
  ],
  colorScheme: 'light dark',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, socials] = await Promise.all([getSiteSettings(), getSocialLinks()]);

  /** Structured data helps search engines render a richer result for the site. */
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings.name,
    jobTitle: settings.role,
    description: settings.description,
    email: `mailto:${settings.email}`,
    telephone: settings.phone_tel,
    url: siteConfig.url,
    address: { '@type': 'PostalAddress', addressLocality: 'Cairo', addressCountry: 'EG' },
    // A link added in the admin appears in sameAs automatically.
    sameAs: socials.map((social) => social.url),
  };
  return (
    <html
      lang="en"
      // next-themes writes the theme class here before paint.
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable}`}
    >
      <body>
        {/* Scroll reveals are JavaScript-driven and server-render at
            `opacity: 0`. Without JS they would never appear, so force every
            revealed element visible in that case. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <ThemeProvider>
          <MotionProvider>
            <a href="#main" className="skip-link">
              Skip to main content
            </a>
            <Navbar initials={initialsFrom(settings.name)} shortName={settings.short_name} />
            <main id="main">{children}</main>
            <Footer />
          </MotionProvider>
        </ThemeProvider>

        <script
          type="application/ld+json"
          // Serialised server-side from a local literal, never user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
