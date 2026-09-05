import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { signOut } from '../actions';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};


/**
 * Sections appear here as each one is migrated to the database.
 * Articles was first; the rest follow in the same pattern.
 */
const adminSections = [
  { href: '/admin', label: 'Articles' },
  { href: '/admin/achievements', label: 'Achievements' },
  { href: '/admin/education', label: 'Education' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/site', label: 'Hero / About / Contact' },
] as const;

/** Never cache the admin area — it is per-session by definition. */
export const dynamic = 'force-dynamic';

/**
 * Second layer of protection. The middleware already redirects unauthenticated
 * requests, but repeating the check here means the admin pages are safe even if
 * the matcher is ever changed or misconfigured. Defence in depth is cheap when
 * it is one call.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="min-w-0">
          <Link href="/admin" className="font-display text-2xl">
            Articles admin
          </Link>
          <p className="mt-1 truncate text-xs text-muted">Signed in as {user.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/articles"
            className="rounded-full border border-border px-4 py-2 text-sm text-fg transition-colors hover:bg-surface-muted"
          >
            View site
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-fg/30 hover:text-fg"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <nav aria-label="Content sections" className="mt-6 flex flex-wrap gap-2">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-full border border-border px-4 py-2 text-sm text-fg transition-colors hover:bg-surface-muted"
          >
            {section.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
