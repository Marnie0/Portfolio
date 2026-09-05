'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

/**
 * Tables the content admin may touch.
 *
 * A whitelist rather than a free-form string: these actions take the table
 * name from a form field, and an allow-list is what stops that field from
 * naming `auth.users` or anything else. Row Level Security would still refuse
 * an anonymous caller, but defence in depth is one cheap check.
 */
const EDITABLE_TABLES = [
  'achievements',
  'education',
  'services',
  'skill_groups',
  'spoken_languages',
  'projects',
  'about_facts',
  'hero_stats',
  'social_links',
] as const;

export type EditableTable = (typeof EDITABLE_TABLES)[number];

function assertTable(value: unknown): EditableTable {
  const table = String(value ?? '');
  if (!(EDITABLE_TABLES as readonly string[]).includes(table)) {
    throw new Error(`Refusing to modify unknown table: ${table}`);
  }
  return table as EditableTable;
}

/** Every mutation re-checks the session: a Server Action is its own endpoint. */
async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return supabase;
}

/** The homepage and the section's admin list both need refreshing. */
function revalidateContent(table: EditableTable) {
  revalidatePath('/');
  revalidatePath(`/admin/${table}`);
}

export type ActionState = { error: string } | null;

/* ----------------------------- shared actions ---------------------------- */

export async function deleteRow(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const table = assertTable(formData.get('table'));
  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.error(`[admin] delete from ${table} failed:`, error.message);
    return;
  }
  revalidateContent(table);
}

export async function toggleVisible(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const table = assertTable(formData.get('table'));
  const id = String(formData.get('id') ?? '').trim();
  const next = formData.get('next') === 'true';
  if (!id) return;

  const { error } = await supabase.from(table).update({ visible: next }).eq('id', id);
  if (error) {
    console.error(`[admin] visibility change on ${table} failed:`, error.message);
    return;
  }
  revalidateContent(table);
}

/**
 * Moves a row one place up or down by swapping `sort_order` with its
 * neighbour. Swapping two rows rather than renumbering the whole list keeps
 * this to two writes and cannot leave gaps behind.
 */
export async function moveRow(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const table = assertTable(formData.get('table'));
  const id = String(formData.get('id') ?? '').trim();
  const direction = formData.get('direction') === 'up' ? -1 : 1;
  if (!id) return;

  const { data: rows, error } = await supabase
    .from(table)
    .select('id,sort_order')
    .order('sort_order', { ascending: true });

  if (error || !rows) {
    console.error(`[admin] could not read order for ${table}:`, error?.message);
    return;
  }

  const index = rows.findIndex((r) => r.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= rows.length) return; // already at the end

  const a = rows[index];
  const b = rows[target];

  // Neighbours can share a sort_order (e.g. all zero on a fresh import), in
  // which case swapping the values alone would not change anything.
  const aOrder = a.sort_order === b.sort_order ? b.sort_order + direction : b.sort_order;

  await supabase.from(table).update({ sort_order: aOrder }).eq('id', a.id);
  await supabase.from(table).update({ sort_order: a.sort_order }).eq('id', b.id);

  revalidateContent(table);
}

/* --------------------------- achievements form --------------------------- */

export async function saveAchievement(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const issuer = String(formData.get('issuer') ?? '').trim();
  const year = String(formData.get('year') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const type = String(formData.get('type') ?? '').trim();
  const visible = formData.get('visible') === 'on';

  if (!title) return { error: 'Title is required.' };

  const values = { title, issuer, year, description, type, visible };

  if (id) {
    const { error } = await supabase.from('achievements').update(values).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    // New rows go to the end of the list.
    const { data: last } = await supabase
      .from('achievements')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { error } = await supabase
      .from('achievements')
      .insert({ ...values, sort_order: (last?.sort_order ?? 0) + 1 });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('achievements');
  redirect('/admin/achievements');
}
