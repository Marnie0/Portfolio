import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/site';

/**
 * Contact endpoint — delivers submissions by email through Resend.
 *
 * This calls Resend's REST API with `fetch` rather than the `resend` SDK on
 * purpose: it is a single POST, it adds no dependency, and the SDK's current
 * major requires Node 20 while this project runs on Node 18.
 *
 * The route only returns a success status once Resend has accepted the message
 * and returned an id. Any other outcome is reported as an error, so the form
 * can never show a success state for mail that was not sent.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/** Where enquiries land. Defaults to the address in the site config. */
const TO_ADDRESS = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;

/**
 * Resend's shared sender works with no domain setup, but can only deliver to
 * the address that owns the Resend account. Set CONTACT_FROM_EMAIL once you
 * have verified your own domain.
 */
const FROM_ADDRESS = process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot field; real users never fill this in. */
  company?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

/** Submissions are untrusted input and end up inside an HTML email. */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Silently accept bot submissions so they get no signal to retry.
  if (asString(payload.company)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = asString(payload.name);
  const email = asString(payload.email);
  const message = asString(payload.message);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Name is required.';
  if (!EMAIL_PATTERN.test(email)) errors.email = 'A valid email address is required.';
  if (message.length < 10) errors.message = 'Message must be at least 10 characters.';
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    errors.length = 'One or more fields exceed the maximum length.';
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Misconfiguration is the server's fault, so say so rather than pretending
    // the message got through.
    console.error('[contact] RESEND_API_KEY is not set — cannot send mail.');
    return NextResponse.json(
      { error: 'Email delivery is not configured. Please email me directly.' },
      { status: 500 },
    );
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.6;color:#14110e">
      <h2 style="margin:0 0 16px">New portfolio enquiry</h2>
      <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 16px"><strong>Email:</strong>
        <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <div style="border-left:3px solid #c7381a;padding:8px 0 8px 16px;white-space:pre-wrap">${escapeHtml(
        message,
      )}</div>
      <p style="margin:24px 0 0;font-size:12px;color:#6b635b">
        Sent from the contact form at ${escapeHtml(siteConfig.url)}
      </p>
    </div>`;

  const text = `New portfolio enquiry

Name:  ${name}
Email: ${email}

${message}
`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        // Replying in the mail client goes straight back to the sender.
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        html,
        text,
      }),
      // Never let a hanging provider hold the request open indefinitely.
      signal: AbortSignal.timeout(10_000),
    });

    const result: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const detail =
        result && typeof result === 'object' && 'message' in result
          ? String((result as { message: unknown }).message)
          : `HTTP ${response.status}`;
      console.error('[contact] Resend rejected the message:', detail);
      return NextResponse.json(
        { error: 'Your message could not be sent. Please email me directly.' },
        { status: 502 },
      );
    }

    const id =
      result && typeof result === 'object' && 'id' in result
        ? String((result as { id: unknown }).id)
        : '';

    // A 2xx with no id means we cannot confirm the send, so do not claim success.
    if (!id) {
      console.error('[contact] Resend returned no message id:', result);
      return NextResponse.json(
        { error: 'Your message could not be confirmed as sent. Please email me directly.' },
        { status: 502 },
      );
    }

    console.info('[contact] delivered', { id, from: email });
    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error('[contact] Failed to reach Resend:', reason);
    return NextResponse.json(
      { error: 'Your message could not be sent. Please email me directly.' },
      { status: 502 },
    );
  }
}
