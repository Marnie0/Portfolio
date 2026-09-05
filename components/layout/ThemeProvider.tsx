'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * Persists the theme choice to localStorage and applies it as a class on <html>
 * via an inline script that runs before paint, so there is no flash of the
 * wrong theme on load. `enableSystem` adds the third "auto" option.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
