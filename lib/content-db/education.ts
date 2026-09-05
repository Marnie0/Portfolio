import { publicSupabase } from '@/lib/supabase/public';
import { education as hardcodedEducation } from '@/lib/content';

export type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string | null;
  description: string;
  highlights: string[];
  visible: boolean;
  sort_order: number;
};

export const EDUCATION_COLUMNS =
  'id,degree,institution,period,location,description,highlights,visible,sort_order';

/** Compiled-in content shaped like a row, for outages only. */
function fallbackRows(): EducationEntry[] {
  return hardcodedEducation.map((e, index) => ({
    id: e.id,
    degree: e.degree,
    institution: e.institution,
    period: e.period,
    location: e.location ?? null,
    description: e.description,
    highlights: [...e.highlights],
    visible: true,
    sort_order: index + 1,
  }));
}

export async function getEducation(): Promise<EducationEntry[]> {
  if (!publicSupabase) return fallbackRows();

  const { data, error } = await publicSupabase
    .from('education')
    .select(EDUCATION_COLUMNS)
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[education] falling back to compiled content:', error.message);
    return fallbackRows();
  }

  return (data ?? []) as EducationEntry[];
}
