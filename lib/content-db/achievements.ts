import { publicSupabase } from '@/lib/supabase/public';
import { achievements as hardcodedAchievements } from '@/lib/content';

export type Achievement = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  type: string;
  visible: boolean;
  sort_order: number;
};

export const ACHIEVEMENT_COLUMNS = 'id,title,issuer,year,description,type,visible,sort_order';

/**
 * The compiled-in content, shaped like a database row.
 *
 * Used only when Supabase is unreachable or misconfigured — never when a query
 * simply returns no rows, so deleting every achievement really does empty the
 * section rather than silently resurrecting the old copy.
 */
function fallbackRows(): Achievement[] {
  return hardcodedAchievements.map((a, index) => ({
    id: a.id,
    title: a.title,
    issuer: a.issuer,
    year: a.year,
    description: a.description,
    type: a.type,
    visible: true,
    sort_order: index + 1,
  }));
}

/** Visible achievements in display order, for the public page. */
export async function getAchievements(): Promise<Achievement[]> {
  if (!publicSupabase) return fallbackRows();

  const { data, error } = await publicSupabase
    .from('achievements')
    .select(ACHIEVEMENT_COLUMNS)
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    // A portfolio with no name and no content is worse than slightly stale
    // content, so an outage falls back rather than rendering nothing.
    console.error('[achievements] falling back to compiled content:', error.message);
    return fallbackRows();
  }

  return (data ?? []) as Achievement[];
}
