import { ImageResponse } from 'next/og';
import { getSiteSettings, initialsFrom } from '@/lib/content-db/settings';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Portfolio';

/**
 * The card shown when the site is shared on LinkedIn, WhatsApp, Slack, X, etc.
 *
 * Deliberately self-contained: no webfont fetch and no filesystem read. Both
 * work locally but are the two things most likely to fail during a Vercel
 * build, and a build failure here would take the whole site down for a picture.
 * `twitter.card` in app/layout.tsx is already `summary_large_image`, so this
 * file covers that too.
 */
export default async function OpengraphImage() {
  // Falls back to the compiled config if Supabase is unreachable at build time.
  const settings = await getSiteSettings();
  const initials = initialsFrom(settings.name);

  const bg = '#FBF9F5';
  const ink = '#14110E';
  const accent = '#C7381A';
  const muted = '#6B635B';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: bg,
          padding: '72px 80px',
          position: 'relative',
        }}
      >
        {/* Accent bar down the left edge */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 16,
            background: accent,
          }}
        />

        {/* Monogram */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 76,
              height: 76,
              borderRadius: 20,
              background: accent,
              color: '#FFFFFF',
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            {initials}
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: muted, letterSpacing: 4 }}>
            {settings.availability.toUpperCase()}
          </div>
        </div>

        {/* Name + role */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 108,
              fontWeight: 700,
              color: ink,
              letterSpacing: -4,
              lineHeight: 1.05,
            }}
          >
            {settings.name}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 18,
              fontSize: 40,
              color: accent,
              letterSpacing: -0.5,
            }}
          >
            {settings.role}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 26,
            color: muted,
          }}
        >
          <div style={{ display: 'flex' }}>{settings.location}</div>
          <div style={{ display: 'flex' }}>{settings.email}</div>
        </div>
      </div>
    ),
    size,
  );
}
