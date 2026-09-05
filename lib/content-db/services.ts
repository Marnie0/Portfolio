import { publicSupabase } from '@/lib/supabase/public';
import { services as hardcodedServices } from '@/lib/content';
import type { IconName } from '@/components/ui/Icon';

/** Icons a service may use. A dropdown in the admin, so a typo cannot ship. */
export const SERVICE_ICONS = [
  'code',
  'layout',
  'server',
  'database',
  'wrench',
  'lifebuoy',
  'gauge',
  'compass',
  'accessibility',
] as const;

export type Service = {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  icon: string;
  visible: boolean;
  sort_order: number;
};

export const SERVICE_COLUMNS = 'id,title,description,deliverables,icon,visible,sort_order';

/** Falls back to a known-good icon rather than rendering an empty square. */
export function serviceIcon(icon: string): IconName {
  return (SERVICE_ICONS as readonly string[]).includes(icon) ? (icon as IconName) : 'code';
}

function fallbackRows(): Service[] {
  return hardcodedServices.map((s, index) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    deliverables: [...s.deliverables],
    icon: s.icon,
    visible: true,
    sort_order: index + 1,
  }));
}

export async function getServices(): Promise<Service[]> {
  if (!publicSupabase) return fallbackRows();

  const { data, error } = await publicSupabase
    .from('services')
    .select(SERVICE_COLUMNS)
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[services] falling back to compiled content:', error.message);
    return fallbackRows();
  }
  return (data ?? []) as Service[];
}
