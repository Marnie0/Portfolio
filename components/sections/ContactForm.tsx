'use client';

import { useId, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

type FieldName = 'name' | 'email' | 'message';
type Errors = Partial<Record<FieldName, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Record<FieldName, string>): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'Please enter a valid email address.';
  if (values.message.trim().length < 10)
    errors.message = 'Please include at least 10 characters so I know how to help.';
  return errors;
}

export function ContactForm() {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const fieldId = (name: FieldName | 'company') => `${formId}-${name}`;
  const errorId = (name: FieldName) => `${formId}-${name}-error`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      // Honeypot: bots fill hidden fields, humans never see this one.
      company: String(data.get('company') ?? ''),
    };

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first invalid field so keyboard users are not stranded.
      const firstInvalid = (Object.keys(nextErrors) as FieldName[])[0];
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    setStatus('submitting');
    setServerMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const body: { ok?: boolean; error?: string; errors?: Errors } | null = await response
        .json()
        .catch(() => null);

      // Server-side validation lost a race with the client, or the client
      // check was bypassed. Surface it on the fields themselves.
      if (response.status === 422 && body?.errors) {
        setErrors(body.errors);
        setStatus('error');
        setServerMessage('Please correct the highlighted fields and try again.');
        const firstInvalid = (Object.keys(body.errors) as FieldName[])[0];
        if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus();
        return;
      }

      // Success is claimed only when the server confirms the mail was accepted
      // for delivery — a 2xx alone is not enough.
      if (!response.ok || body?.ok !== true) {
        setStatus('error');
        setServerMessage(
          body?.error ?? 'Something went wrong sending that. Please email me directly.',
        );
        return;
      }

      setStatus('success');
      setServerMessage("Thanks — your message has been sent. I'll get back to you soon.");
      formRef.current?.reset();
    } catch {
      // Network failure, offline, or the request timed out.
      setStatus('error');
      setServerMessage(
        'Could not reach the server. Please check your connection or email me directly.',
      );
    }
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-muted/70 transition-colors duration-200 focus:border-accent';

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId('name')} className="block text-sm font-medium text-fg">
            Name
          </label>
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? errorId('name') : undefined}
            className={`mt-2 ${inputClass}`}
          />
          {errors.name && (
            <p id={errorId('name')} className="mt-1.5 text-xs text-accent-text">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={fieldId('email')} className="block text-sm font-medium text-fg">
            Email
          </label>
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ada@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId('email') : undefined}
            className={`mt-2 ${inputClass}`}
          />
          {errors.email && (
            <p id={errorId('email')} className="mt-1.5 text-xs text-accent-text">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId('message')} className="block text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          id={fieldId('message')}
          name="message"
          rows={5}
          placeholder="A little about the project, timeline and budget…"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errorId('message') : undefined}
          className={`mt-2 resize-y ${inputClass}`}
        />
        {errors.message && (
          <p id={errorId('message')} className="mt-1.5 text-xs text-accent-text">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from sight and from assistive technology. */}
      <div aria-hidden className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor={fieldId('company')}>Company (leave blank)</label>
        <input id={fieldId('company')} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
          <Icon name="arrowRight" className="h-4 w-4" />
        </button>

        {/* Announced to screen readers the moment the request resolves. */}
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${status === 'error' ? 'text-accent-text' : 'text-muted'}`}
        >
          {serverMessage}
        </p>
      </div>
    </form>
  );
}
