'use client';

/**
 * Submit button that asks for confirmation first. Deleting an article is
 * irreversible, and the button sits next to Edit on a narrow row.
 */
export function DeleteButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
      className="rounded-full border border-border px-3.5 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-accent-text"
    >
      Delete
    </button>
  );
}
