import { publicSupabase } from '@/lib/supabase/public';
import { projects as hardcodedProjects } from '@/lib/content';

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  focus: string;
  tech: string[];
  /** Either a /public path or a Supabase Storage URL. Null renders a blank panel. */
  image_url: string | null;
  image_alt: string;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  visible: boolean;
  sort_order: number;
};

export const PROJECT_COLUMNS =
  'id,title,category,year,summary,focus,tech,image_url,image_alt,live_url,github_url,featured,visible,sort_order';

function fallbackRows(): Project[] {
  return hardcodedProjects.map((p, index) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    year: p.year,
    summary: p.summary,
    focus: p.focus,
    tech: [...p.tech],
    image_url: p.image,
    image_alt: p.imageAlt,
    live_url: p.links.live ?? null,
    github_url: p.links.github ?? null,
    featured: Boolean(p.featured),
    visible: true,
    sort_order: index + 1,
  }));
}

export async function getProjects(): Promise<Project[]> {
  if (!publicSupabase) return fallbackRows();

  const { data, error } = await publicSupabase
    .from('projects')
    .select(PROJECT_COLUMNS)
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[projects] falling back to compiled content:', error.message);
    return fallbackRows();
  }
  return (data ?? []) as Project[];
}
