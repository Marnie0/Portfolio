# Personal Portfolio

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Swapping in your content

Almost everything you need to edit lives in two files:

| File | What it holds |
| --- | --- |
| `lib/site.ts` | Name, role, tagline, email, location, social URLs, site URL, nav order |
| `lib/content.ts` | About, education, skills, services, projects, achievements |

Both are fully typed, so if you miss a field the build will tell you exactly where.

### Images

Placeholder artwork lives in `public/`:

- `public/projects/*.svg` — project screenshots, referenced by `project.image`
- `public/portrait.jpeg` — the About portrait
- `public/CV.pdf` — résumé served by the hero's Résumé button

`sharp` is a dependency because Next 15 needs it to optimise images; without it
the originals are served untouched. It is pinned to `^0.33` because 0.35+
requires Node 20.

Replace them with real files. When you switch from SVG to raster screenshots
(`.jpg` / `.png` / `.webp`), delete the `dangerouslyAllowSVG` block in
`next.config.mjs` — it only exists to let the placeholder SVGs through the image
optimiser.

Keep `imageAlt` descriptive: it is real content, not decoration.

### Still placeholder

Hero, About and Contact carry real content. These are still filler and need
replacing in `lib/content.ts`:

- `education`
- `services`
- `projects` (including the `github.com/your-handle` links on each project and
  the artwork in `public/projects/`)
- `achievements`

`public/portrait.svg` and `public/resume.pdf` are the superseded placeholders and
can be deleted.

### Before deploying

1. Set `NEXT_PUBLIC_SITE_URL` to your real domain (see `.env.example`). It drives
   canonical URLs, Open Graph tags, `robots.txt` and `sitemap.xml`.
2. Set `RESEND_API_KEY` in your hosting provider's environment variables (it is
   in `.env.local` for development). Without it the contact form returns a 500
   and tells the visitor to email directly — it never silently drops a message.

## Contact form email

Submissions are delivered with [Resend](https://resend.com) from
`app/api/contact/route.ts`, which calls the REST API directly with `fetch` — no
SDK dependency, and no coupling to the SDK's Node 20 requirement.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | API key from https://resend.com/api-keys |
| `CONTACT_TO_EMAIL` | no | Where mail lands. Defaults to `siteConfig.email` |
| `CONTACT_FROM_EMAIL` | no | Sender. Defaults to `onboarding@resend.dev` |

The default sender `onboarding@resend.dev` needs no DNS setup, but Resend will
**only deliver it to the address that owns the Resend account**. To accept mail
from any sender address, verify a domain in Resend and set `CONTACT_FROM_EMAIL`.

The route returns 200 only after Resend accepts the message and returns an id.
Validation failures return 422, provider failures 502, missing configuration
500 — so the form cannot show success for mail that was not sent.

The endpoint is protected by a honeypot field only. If it starts attracting
spam, add rate limiting (for example Upstash) before it eats the free quota.

## Notes on the implementation

**Theme.** `next-themes` drives light / dark / system with the choice persisted
to `localStorage` and applied before first paint, so there is no flash. Colours
are CSS custom properties in `app/globals.css`, exposed to Tailwind as tokens
(`bg-surface`, `text-muted`, `border-border`, …) that work with opacity
modifiers.

**Motion.** Framer Motion is loaded via `LazyMotion` with only the
`domAnimation` feature set (~6 KB instead of ~34 KB), so animated elements use
`m.*` rather than `motion.*`. Layout animations are deliberately not available
under that feature set.

The hero is a **server** component animated with CSS keyframes, not Framer
Motion. Its `<h1>` and intro paragraph are the LCP candidates, and an element
that starts at `opacity: 0` is not counted as painted — fading them in pushed
Largest Contentful Paint out by roughly 700 ms and left the page blank if
JavaScript failed. They now animate transform only.

Scroll reveals use `whileInView`, which is backed by an IntersectionObserver.
Skill bars are driven as variant children of their card rather than each
observing itself, because a bar starts at `scaleX(0)` — a zero-area box, which
IntersectionObserver does not reliably report as intersecting.

`prefers-reduced-motion` is honoured globally in `globals.css` and via
`MotionConfig reducedMotion="user"`, and a `<noscript>` rule reveals any
scroll-animated content if JavaScript never runs.

**Accessibility.** Skip link, one `<h1>`, labelled landmarks and sections,
descriptive alt text, visible focus rings, a keyboard-operable mobile menu
(Escape closes it and returns focus), and a form that moves focus to the first
invalid field and announces its result via `role="status"`.

## Verified

Audited against the production build (`npm run build && npm start`):

- Lighthouse desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100
- Lighthouse mobile: Performance 90–94, Accessibility 100, Best Practices 100, SEO 100
- Cumulative Layout Shift 0; no console errors
- axe-core: 0 violations, desktop light and mobile dark
