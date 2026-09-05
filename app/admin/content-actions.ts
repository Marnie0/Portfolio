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


/**
 * Turns a textarea into a Postgres text[].
 *
 * List fields (highlights, deliverables, skills, tech) are edited one item per
 * line, which is far easier on a phone than a repeating field widget. Blank
 * lines are dropped so a trailing newline cannot create an empty chip.
 */
function parseLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/** New rows go to the end of their section. */
async function nextSortOrder(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  table: EditableTable,
): Promise<number> {
  const { data } = await supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? 0) + 1;
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
    const sort_order = await nextSortOrder(supabase, 'achievements');
    const { error } = await supabase.from('achievements').insert({ ...values, sort_order });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('achievements');
  redirect('/admin/achievements');
}

/* ------------------------------ education -------------------------------- */

export async function saveEducation(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  const degree = String(formData.get('degree') ?? '').trim();
  const institution = String(formData.get('institution') ?? '').trim();
  const period = String(formData.get('period') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const highlights = parseLines(formData.get('highlights'));
  const visible = formData.get('visible') === 'on';

  if (!degree) return { error: 'Degree or title is required.' };
  if (!institution) return { error: 'Institution is required.' };
  if (!period) return { error: 'Period is required.' };

  const values = {
    degree,
    institution,
    period,
    // The column is nullable and the design omits the line entirely when empty.
    location: location || null,
    description,
    highlights,
    visible,
  };

  if (id) {
    const { error } = await supabase.from('education').update(values).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const sort_order = await nextSortOrder(supabase, 'education');
    const { error } = await supabase.from('education').insert({ ...values, sort_order });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('education');
  redirect('/admin/education');
}

/* ------------------------------- services -------------------------------- */

export async function saveService(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const deliverables = parseLines(formData.get('deliverables'));
  const icon = String(formData.get('icon') ?? 'code').trim();
  const visible = formData.get('visible') === 'on';

  if (!title) return { error: 'Title is required.' };

  const values = { title, description, deliverables, icon, visible };

  if (id) {
    const { error } = await supabase.from('services').update(values).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const sort_order = await nextSortOrder(supabase, 'services');
    const { error } = await supabase.from('services').insert({ ...values, sort_order });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('services');
  redirect('/admin/services');
}

/* -------------------------------- skills --------------------------------- */

export async function saveSkillGroup(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const skills = parseLines(formData.get('skills'));
  const visible = formData.get('visible') === 'on';

  if (!title) return { error: 'Group title is required.' };

  const values = { title, skills, visible };

  if (id) {
    const { error } = await supabase.from('skill_groups').update(values).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const sort_order = await nextSortOrder(supabase, 'skill_groups');
    const { error } = await supabase.from('skill_groups').insert({ ...values, sort_order });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('skill_groups');
  redirect('/admin/skills');
}

export async function saveLanguage(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const level = String(formData.get('level') ?? '').trim();
  const visible = formData.get('visible') === 'on';

  if (!name) return { error: 'Language name is required.' };
  if (!level) return { error: 'Level is required.' };

  const values = { name, level, visible };

  if (id) {
    const { error } = await supabase.from('spoken_languages').update(values).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const sort_order = await nextSortOrder(supabase, 'spoken_languages');
    const { error } = await supabase.from('spoken_languages').insert({ ...values, sort_order });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('spoken_languages');
  redirect('/admin/skills');
}

/* ------------------------------- projects -------------------------------- */

export async function saveProject(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const year = String(formData.get('year') ?? '').trim();
  const summary = String(formData.get('summary') ?? '').trim();
  const focus = String(formData.get('focus') ?? '').trim();
  const tech = parseLines(formData.get('tech'));
  const imageUrl = String(formData.get('image_url') ?? '').trim();
  const imageAlt = String(formData.get('image_alt') ?? '').trim();
  const liveUrl = String(formData.get('live_url') ?? '').trim();
  const githubUrl = String(formData.get('github_url') ?? '').trim();
  const featured = formData.get('featured') === 'on';
  const visible = formData.get('visible') === 'on';

  if (!title) return { error: 'Title is required.' };
  if (imageUrl && !imageAlt) {
    return { error: 'Alt text is required when there is a cover image.' };
  }

  const values = {
    title,
    category,
    year,
    summary,
    focus,
    tech,
    // Nullable so the components can branch on "no image" / "no link".
    image_url: imageUrl || null,
    image_alt: imageAlt,
    live_url: liveUrl || null,
    github_url: githubUrl || null,
    featured,
    visible,
  };

  if (id) {
    const { error } = await supabase.from('projects').update(values).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const sort_order = await nextSortOrder(supabase, 'projects');
    const { error } = await supabase.from('projects').insert({ ...values, sort_order });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('projects');
  redirect('/admin/projects');
}

/* ------------------------- site settings (singleton) --------------------- */

const SETTINGS_TEXT_FIELDS = [
  'name',
  'short_name',
  'role',
  'tagline',
  'description',
  'location',
  'availability',
  'email',
  'phone_display',
  'phone_tel',
  'whatsapp_url',
  'resume_url',
  'hero_cta_primary',
  'hero_cta_secondary',
  'hero_resume_label',
  'about_eyebrow',
  'about_lead',
  'contact_eyebrow',
  'contact_title',
  'contact_description',
] as const;

export async function saveSiteSettings(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();

  const values: Record<string, unknown> = {};
  for (const field of SETTINGS_TEXT_FIELDS) {
    values[field] = String(formData.get(field) ?? '').trim();
  }
  values.about_paragraphs = parseLines(formData.get('about_paragraphs'));

  if (!values.name) return { error: 'Name is required — it is the site heading.' };
  if (!values.email) return { error: 'Email is required.' };

  // The row is created by the seed, but upsert keeps this working on a fresh
  // database where nobody has run it yet.
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, ...values }, { onConflict: 'id' });

  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath('/');
  revalidatePath('/admin/site');
  redirect('/admin/site');
}

export async function saveAboutFact(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  const label = String(formData.get('label') ?? '').trim();
  const entries = parseLines(formData.get('entries'));
  const visible = formData.get('visible') === 'on';

  if (!label) return { error: 'Label is required.' };
  if (entries.length === 0) return { error: 'Add at least one line.' };

  const values = { label, entries, visible };

  if (id) {
    const { error } = await supabase.from('about_facts').update(values).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const sort_order = await nextSortOrder(supabase, 'about_facts');
    const { error } = await supabase.from('about_facts').insert({ ...values, sort_order });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('about_facts');
  redirect('/admin/site');
}

export async function saveHeroStat(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  const value = String(formData.get('value') ?? '').trim();
  const label = String(formData.get('label') ?? '').trim();
  const visible = formData.get('visible') === 'on';

  if (!value || !label) return { error: 'Both the number and the label are required.' };

  const values = { value, label, visible };

  if (id) {
    const { error } = await supabase.from('hero_stats').update(values).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const sort_order = await nextSortOrder(supabase, 'hero_stats');
    const { error } = await supabase.from('hero_stats').insert({ ...values, sort_order });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('hero_stats');
  redirect('/admin/site');
}

export async function saveSocialLink(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  const label = String(formData.get('label') ?? '').trim();
  const url = String(formData.get('url') ?? '').trim();
  const icon = String(formData.get('icon') ?? 'external').trim();
  const display = String(formData.get('display') ?? '').trim();
  const visible = formData.get('visible') === 'on';

  if (!label) return { error: 'Label is required.' };
  if (!url) return { error: 'URL is required.' };

  const values = { label, url, icon, display, visible };

  if (id) {
    const { error } = await supabase.from('social_links').update(values).eq('id', id);
    if (error) return { error: `Could not save: ${error.message}` };
  } else {
    const sort_order = await nextSortOrder(supabase, 'social_links');
    const { error } = await supabase.from('social_links').insert({ ...values, sort_order });
    if (error) return { error: `Could not create: ${error.message}` };
  }

  revalidateContent('social_links');
  redirect('/admin/site');
}
