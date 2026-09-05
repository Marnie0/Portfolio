import { publicSupabase } from '@/lib/supabase/public';
import type { IconName } from '@/components/ui/Icon';
import { siteConfig } from '@/lib/site';
import { about as hardcodedAbout } from '@/lib/content';

export type SiteSettings = {
  name: string;
  short_name: string;
  role: string;
  tagline: string;
  description: string;
  location: string;
  availability: string;
  email: string;
  phone_display: string;
  phone_tel: string;
  whatsapp_url: string;
  resume_url: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_resume_label: string;
  about_eyebrow: string;
  about_lead: string;
  about_paragraphs: string[];
  contact_eyebrow: string;
  contact_title: string;
  contact_description: string;
};

export type AboutFact = { id: string; label: string; entries: string[] };
export type HeroStat = { id: string; value: string; label: string };
export type SocialLink = { id: string; label: string; url: string; icon: string; display: string };

/**
 * Compiled-in defaults.
 *
 * These matter more than the other sections' fallbacks: without them an outage
 * would leave the site with no name, no bio and no contact details at all.
 */
export function fallbackSettings(): SiteSettings {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    role: siteConfig.role,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    location: siteConfig.location,
    availability: siteConfig.availability,
    email: siteConfig.email,
    phone_display: siteConfig.phone.display,
    phone_tel: siteConfig.phone.tel,
    whatsapp_url: siteConfig.phone.whatsapp,
    resume_url: siteConfig.resumeUrl,
    hero_cta_primary: 'View work',
    hero_cta_secondary: 'Contact me',
    hero_resume_label: 'Résumé',
    about_eyebrow: hardcodedAbout.heading,
    about_lead: hardcodedAbout.lead,
    about_paragraphs: [...hardcodedAbout.paragraphs],
    contact_eyebrow: 'Contact',
    contact_title: "Let's build something",
    contact_description:
      'Open to freelance work and collaboration. Email, phone or WhatsApp — whichever suits you.',
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!publicSupabase) return fallbackSettings();

  const { data, error } = await publicSupabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('[settings] falling back to compiled content:', error.message);
    return fallbackSettings();
  }

  // Merge over the defaults so a column left blank never blanks the site.
  const base = fallbackSettings();
  const row = data as Partial<SiteSettings>;
  const merged = { ...base };
  (Object.keys(base) as (keyof SiteSettings)[]).forEach((key) => {
    const value = row[key];
    if (Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim()) {
      // @ts-expect-error — key is a valid key of both objects
      merged[key] = value;
    }
  });
  return merged;
}

export async function getAboutFacts(): Promise<AboutFact[]> {
  const fallback = hardcodedAbout.facts.map((f, i) => ({
    id: String(i),
    label: f.label,
    entries: Array.isArray(f.value) ? [...f.value] : [f.value],
  }));

  if (!publicSupabase) return fallback;

  const { data, error } = await publicSupabase
    .from('about_facts')
    .select('id,label,entries')
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[about_facts] falling back to compiled content:', error.message);
    return fallback;
  }
  return (data ?? []) as AboutFact[];
}

export async function getHeroStats(): Promise<HeroStat[]> {
  const fallback = [
    { id: '1', value: '10+', label: 'Projects' },
    { id: '2', value: '20+', label: 'Repos' },
  ];

  if (!publicSupabase) return fallback;

  const { data, error } = await publicSupabase
    .from('hero_stats')
    .select('id,value,label')
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[hero_stats] falling back to compiled content:', error.message);
    return fallback;
  }
  return (data ?? []) as HeroStat[];
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const fallback = [
    { id: '1', label: 'GitHub', url: siteConfig.socials.github, icon: 'github', display: '@Marnie0' },
    {
      id: '2',
      label: 'LinkedIn',
      url: siteConfig.socials.linkedin,
      icon: 'linkedin',
      display: 'in/ibrahim-hassan-552692239',
    },
  ];

  if (!publicSupabase) return fallback;

  const { data, error } = await publicSupabase
    .from('social_links')
    .select('id,label,url,icon,display')
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[social_links] falling back to compiled content:', error.message);
    return fallback;
  }
  return (data ?? []) as SocialLink[];
}

/** "Ibrahim Hassan" -> "IH". Mirrors lib/site.ts, but from database values. */
export function initialsFrom(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

/** Valid icons for a social link; anything unknown renders the external glyph. */
const SOCIAL_ICONS: readonly string[] = ['github', 'linkedin', 'whatsapp', 'mail', 'external'];

export function socialIcon(icon: string): IconName {
  return SOCIAL_ICONS.includes(icon) ? (icon as IconName) : 'external';
}
