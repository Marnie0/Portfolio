import { publicSupabase } from '@/lib/supabase/public';
import { skillGroups as hardcodedGroups, spokenLanguages as hardcodedLanguages } from '@/lib/content';

export type SkillGroup = {
  id: string;
  title: string;
  skills: string[];
  visible: boolean;
  sort_order: number;
};

export type SpokenLanguage = {
  id: string;
  name: string;
  level: string;
  visible: boolean;
  sort_order: number;
};

export const SKILL_GROUP_COLUMNS = 'id,title,skills,visible,sort_order';
export const LANGUAGE_COLUMNS = 'id,name,level,visible,sort_order';

function fallbackGroups(): SkillGroup[] {
  return hardcodedGroups.map((g, i) => ({
    id: g.id,
    title: g.title,
    skills: [...g.skills],
    visible: true,
    sort_order: i + 1,
  }));
}

function fallbackLanguages(): SpokenLanguage[] {
  return hardcodedLanguages.map((l, i) => ({
    id: l.name.toLowerCase(),
    name: l.name,
    level: l.level,
    visible: true,
    sort_order: i + 1,
  }));
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  if (!publicSupabase) return fallbackGroups();

  const { data, error } = await publicSupabase
    .from('skill_groups')
    .select(SKILL_GROUP_COLUMNS)
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[skills] falling back to compiled content:', error.message);
    return fallbackGroups();
  }
  return (data ?? []) as SkillGroup[];
}

export async function getSpokenLanguages(): Promise<SpokenLanguage[]> {
  if (!publicSupabase) return fallbackLanguages();

  const { data, error } = await publicSupabase
    .from('spoken_languages')
    .select(LANGUAGE_COLUMNS)
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[languages] falling back to compiled content:', error.message);
    return fallbackLanguages();
  }
  return (data ?? []) as SpokenLanguage[];
}
