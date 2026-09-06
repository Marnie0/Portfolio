import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from '@/lib/supabase/config';

/**
 * Refreshes the Supabase session cookie and gates the admin area.
 *
 * The matcher below restricts this to /admin, so no public page pays the cost
 * of a middleware hop. This is the first of several layers: the admin layout
 * re-checks the user server-side, every mutation re-checks it again, and Row
 * Level Security enforces it in the database regardless of what the app does.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';

  // Without credentials there is no way to authenticate anyone, and building a
  // client from empty strings throws. Send every admin route to the login page,
  // which renders a "not configured" notice instead of a 500. The login page
  // itself passes through, so this cannot loop.
  if (!isSupabaseConfigured) {
    if (isLoginPage) return NextResponse.next({ request });
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() revalidates the token with Supabase; getSession() only reads the
  // cookie and would trust a forged one.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLoginPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

/** Scoped deliberately: the public site is never touched by this middleware. */
export const config = {
  matcher: ['/admin/:path*'],
};
