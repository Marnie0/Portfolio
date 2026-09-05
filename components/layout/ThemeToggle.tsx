'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

const options: { value: string; label: string; icon: IconName }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'monitor' },
];

/**
 * Three-state theme control rendered as a radio group so arrow keys move
 * between options and the active choice is announced.
 *
 * The theme is unknown during SSR, so the control renders in a neutral,
 * non-interactive state until mount to avoid a hydration mismatch.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex items-center gap-0.5 rounded-full border border-border bg-surface/70 p-0.5 backdrop-blur"
    >
      {options.map((option) => {
        const isActive = mounted && theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${option.label} theme`}
            title={`${option.label} theme`}
            onClick={() => setTheme(option.value)}
            className={[
              'grid h-7 w-7 place-items-center rounded-full transition-colors duration-200',
              isActive
                ? 'bg-accent text-accent-fg'
                : 'text-muted hover:bg-surface-muted hover:text-fg',
            ].join(' ')}
          >
            <Icon name={option.icon} className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
