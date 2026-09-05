import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata: Metadata = {
  title: 'Sign in',
  // The admin area must never appear in search results.
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <h1 className="font-display text-3xl">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted">
        This page is for the site owner. There is no public account system.
      </p>

      <div className="mt-8 rounded-3xl border border-border bg-surface p-6 sm:p-8">
        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <p role="alert" className="text-sm text-muted">
            Supabase is not configured. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then reload.
          </p>
        )}
      </div>
    </div>
  );
}
