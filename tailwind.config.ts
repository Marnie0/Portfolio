import type { Config } from 'tailwindcss';

/**
 * Colours are declared as space-separated RGB channels in `globals.css` so that
 * every token supports Tailwind's opacity modifiers (e.g. `bg-surface/60`).
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-muted': token('surface-muted'),
        fg: token('fg'),
        muted: token('muted'),
        border: token('border'),
        accent: token('accent'),
        'accent-fg': token('accent-fg'),
        'accent-text': token('accent-text'),
        'accent-soft': token('accent-soft'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Fluid display sizes keep the hero balanced from 320px to 1920px.
        'display-sm': ['clamp(2.25rem, 1.6rem + 3.2vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.75rem, 1.4rem + 6vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        content: '72rem',
        prose: '65ch',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'none' },
        },
        nudge: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(7px)' },
        },
        // Transform only, deliberately no opacity — see `animation.slide`.
        slide: {
          from: { transform: 'translateY(14px)' },
          to: { transform: 'none' },
        },
      },
      animation: {
        // `both` fill mode holds the start frame through the stagger delay.
        rise: 'rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        // For the largest text in the hero. Chrome will not treat an element
        // that starts at `opacity: 0` as painted, so fading the LCP element in
        // pushes Largest Contentful Paint out by the whole animation. Moving it
        // without fading keeps the same feel and paints immediately.
        slide: 'slide 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        nudge: 'nudge 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
