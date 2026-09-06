# Portfolio — Project Handoff

**Owner:** Ibrahim Hassan
**Live site:** https://portfolio-ih18.vercel.app
**Code:** https://github.com/Marnie0/Portfolio
**Admin panel:** https://portfolio-ih18.vercel.app/admin

> **Read this first.** Almost all your site content is now edited through the
> **admin panel in your browser** — not by editing code files. If you only
> remember one thing from this document, remember that. See section 4.

---

## 1. Project overview

### What this is, in plain terms

A personal portfolio website with two halves:

1. **The public site** — what visitors see. Your name, bio, education, skills,
   services, projects, achievements, contact form, and a blog ("Articles").
2. **A private admin panel** — a password-protected area at `/admin` where
   *you* edit all of that content from a web page, on your phone or laptop,
   without touching code and without redeploying the site.

Content lives in a **database**, not in the code. When you change something in
the admin panel, the live site picks it up **within about 60 seconds**. No
deploy, no waiting, no developer needed.

### The tech stack, and what each piece actually does

| Piece | What it's responsible for |
|---|---|
| **Next.js 15** | The web framework. Builds the pages, handles routing (`/`, `/articles`, `/admin`), and runs the server code. |
| **React 19** | The UI library Next.js is built on. Components like `Hero`, `Projects` are React. |
| **TypeScript** | JavaScript with type checking. Catches mistakes (typos, wrong data shapes) *before* the site breaks. |
| **Tailwind CSS** | The styling. Colours, spacing, layout are written as class names in the markup rather than a separate CSS file. |
| **Framer Motion** | The animations — the fade-and-slide as sections scroll into view. |
| **next-themes** | Light / dark / system theme switching. |
| **Supabase** | The database *and* the login system. Stores every piece of content, plus your admin account. Also stores uploaded images. |
| **Resend** | Sends the contact-form emails to your inbox. |
| **react-markdown** | Turns the Markdown you write in articles into formatted HTML (headings, code blocks, images). |
| **sharp** | Resizes and optimises images so pages load fast. |
| **Vercel** | The hosting. Watches GitHub and rebuilds the site whenever you push. |

---

## 2. How to run this locally

You need **Node.js 18 or newer** and **git** installed.

```bash
# 1. Get the code
git clone git@github.com:Marnie0/Portfolio.git
cd Portfolio

# 2. Install the dependencies (creates node_modules/, takes a minute)
npm install

# 3. Create your local secrets file
cp .env.example .env.local
#    then open .env.local and fill in the real values — see section 3

# 4. Start the development server
npm run dev
```

Then open **http://localhost:3000**.

**Other useful commands:**

```bash
npm run build   # production build — run this to check nothing is broken before pushing
npm run start   # runs the production build locally
```

> **Tip:** don't run `npm run build` while `npm run dev` is running. They fight
> over the same `.next` folder and the dev server will start returning errors.
> Stop the dev server first (Ctrl+C), build, then start it again.

---

## 3. Environment variables

These are settings and secrets the app reads at runtime. They live in
**`.env.local`** on your computer (never committed to git — it's gitignored)
and in the **Vercel dashboard** for the live site.

| Variable | Required? | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Supabase → your project → Project Settings → API → *Project URL* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Same page → the **anon / public** key |
| `RESEND_API_KEY` | **Yes** for the contact form | resend.com → API Keys → create one (starts `re_`) |
| `NEXT_PUBLIC_SITE_URL` | Strongly recommended | Just your live URL. Used for SEO, sitemap, link previews. |
| `CONTACT_TO_EMAIL` | Optional | Any email address. Overrides where contact-form mail is delivered. |
| `CONTACT_FROM_EMAIL` | Optional | The "from" address. Needs a domain verified in Resend. |

### Important things to know

- **Never put the Supabase `service_role` / secret key in this project.** Any
  variable starting `NEXT_PUBLIC_` is sent to every visitor's browser. The
  `anon` key is *designed* to be public — the database's security rules are
  what protect your data, not the key being hidden.
- **`NEXT_PUBLIC_*` variables are baked in when the site builds.** If you
  change one in Vercel, you must **redeploy** for it to take effect. Changing
  it alone does nothing.
- **If you ever need to regenerate a key:** create the new one in the relevant
  dashboard, update it in `.env.local` *and* in Vercel, then redeploy.

---

## 4. How to make common changes

### The short version: use the admin panel

Go to **https://portfolio-ih18.vercel.app/admin**, log in with your email and
password, and edit whatever you need. Changes appear on the live site within
about a minute.

There is **no sign-up link anywhere** on the public site. `/admin/login` is the
only login on the entire site, it isn't linked from anywhere, and public
sign-ups are disabled in Supabase. It's yours alone.

### Where to edit each thing

| What you want to change | Where |
|---|---|
| **Projects** (add/edit/delete/reorder, upload cover images, featured flag) | `/admin/projects` |
| **Skills** (groups and the chips inside them) and spoken languages | `/admin/skills` |
| **Achievements** | `/admin/achievements` |
| **Education** | `/admin/education` |
| **Services** | `/admin/services` |
| **Hero, About and Contact text** — your name, role, tagline, bio paragraphs, email, phone, WhatsApp, Telegram, button labels | `/admin/site` |
| **About meta row** (Based in / Focus / Foundation / Availability) | `/admin/site` → About meta row |
| **Hero stats** (10+ Projects, 20+ Repos) | `/admin/site` → Hero stats |
| **Social links** (GitHub, LinkedIn, Discord, YouTube…) | `/admin/site` → Social links |
| **Articles / blog posts** | `/admin` (the Articles screen) |

### Things every admin screen can do

- **Add** — the "New …" button
- **Edit** — the Edit button on any row
- **Delete** — asks for confirmation first; it cannot be undone
- **Hide / Show** — removes it from the public site *without* deleting it.
  Useful for taking something down temporarily.
- **Reorder** — the ↑ and ↓ buttons. The order you see in the admin is the
  order visitors see.

### List fields (skills, tech tags, deliverables, focus tags)

These are edited as **one item per line** in a text box. Blank lines are
ignored. For example, a skill group's skills:

```
HTML5
CSS3
Tailwind CSS
React
Next.js
```

### Safe vs. fragile files

If you *do* open the code, here's what's what:

| Safety | Files | Notes |
|---|---|---|
| 🟢 **Safe to edit** | `lib/content.ts`, `lib/site.ts` | The **fallback** content (see below). Editing these no longer changes your live site day to day. |
| 🟡 **Edit with care** | `components/sections/*.tsx` | The visual layout of each section. Changing text here won't help — the text comes from the database. Change these only to alter *design*. |
| 🔴 **Leave alone unless you know why** | `middleware.ts`, `lib/supabase/*`, `app/admin/content-actions.ts`, `next.config.mjs` | Login protection, database access, and the security rules. Breaking these can expose your admin panel or take the site down. |

### What the "fallback" content is

`lib/content.ts` and `lib/site.ts` still contain a copy of your content baked
into the code. It is used **only if the database is unreachable** — a Supabase
outage, or missing environment variables. In that case the site keeps working
and shows this older copy instead of going blank.

It does **not** activate when the database simply returns nothing. If you
delete every project, the Projects section really will be empty — the fallback
won't quietly bring old ones back.

Because of this, the fallback slowly goes out of date as you edit things in the
admin. That's fine and expected. It's a safety net, not a second source of truth.

---

## 5. Articles (the blog)

**Articles are database-only. There is no file to edit and no "coding" path.**
Unlike the other sections, articles have no fallback copy in the code.

### To write, edit or delete an article

1. Go to **`/admin`** and log in
2. **New article** to write one, or **Edit** on an existing row
3. Fill in:
   - **Title** — the URL slug fills in automatically; you can override it
   - **Excerpt** — the short summary shown on the articles list
   - **Cover image** — upload from your device
   - **Content** — written in **Markdown**, with a live preview beside it
     (tabs on mobile)
4. **Save as draft** to keep it private, or **Publish** to make it live

Drafts are visible only to you. Visitors can't reach them even by guessing the
URL — the database itself refuses to return unpublished articles.

### Markdown quick reference

````markdown
## A heading
### A smaller heading

Normal text with **bold**, *italic*, and a [link](https://example.com).

- a bullet
- another bullet

> A quoted block

`inline code`

```js
// a code block, syntax highlighted automatically
const x = 1;
```

![image description](paste-an-image-url-here)
````

Use the **Insert image** button to upload an image straight into the article —
it uploads and drops the Markdown at your cursor.

### Deleting

Delete from the article list. It asks for confirmation. Note that deleting an
article does **not** delete images you uploaded for it — those stay in Supabase
Storage. Remove them from Supabase → Storage → `article-images` if you want
them gone.

---

## 6. Deployment

### How it works

Your GitHub repository is connected to Vercel. **Every push to the `main`
branch automatically triggers a new deployment.** You don't need to do anything
else — no manual upload, no build command to run.

```
you push to GitHub  →  Vercel notices  →  builds the site  →  live in ~1–2 minutes
```

### Checking whether a deployment worked

**Easiest:** go to **vercel.com**, open the project, and look at the
**Deployments** tab. Each one shows *Building*, *Ready*, or *Error*.

**On GitHub:** the commit list shows a small ✓ or ✗ next to each commit.

**If it failed:** click the deployment in Vercel and read the **Build Logs**.
Scroll to the **bottom** — the actual error is at the end, not the beginning.

### Important: content changes don't need a deploy

Editing content in `/admin` writes to the database. The live site re-reads it
within about 60 seconds. **You only need a deployment when the *code* changes.**

---

## 7. Git workflow — staying in control

Git is the version history of your code. Every commit is a save point you can
return to.

### Check what's going on

```bash
git status          # what files have I changed?
git log --oneline   # recent history, newest first
git diff            # exactly what changed, line by line
```

### Save and publish your own changes

```bash
git add -A                          # stage every change
git commit -m "Describe the change" # save it locally
git push origin main                # publish → triggers a Vercel deploy
```

### Undoing things

**You changed a file and want to throw the change away (not committed yet):**

```bash
git restore path/to/file.tsx    # one file
git restore .                   # everything — careful, this discards all uncommitted work
```

**You committed something but haven't pushed yet, and want to undo it:**

```bash
git reset --soft HEAD~1    # undoes the commit, KEEPS your changes in the files
git reset --hard HEAD~1    # undoes the commit AND throws the changes away
```

**You already pushed and the live site is broken — safest fix:**

```bash
git revert HEAD     # creates a NEW commit that undoes the last one
git push origin main
```

`git revert` is the safe option because it doesn't rewrite history. Vercel then
deploys the reverted version automatically.

**Instant rollback without git:** in Vercel → Deployments, find the last
deployment that worked, click ⋯ → **Promote to Production**. This is the
fastest fix when the live site is broken.

> **Rule of thumb:** `revert` is safe. `reset --hard` destroys work
> permanently. If you're unsure, use `revert`.

---

## 8. Troubleshooting

| Symptom | Check this first |
|---|---|
| **Site not updating after an admin edit** | Wait 60 seconds and hard-refresh (Ctrl+Shift+R). The site caches content for a minute. |
| **Site not updating after a code push** | Vercel → Deployments. Did the build fail? Read the bottom of the build log. |
| **Contact form says it can't send** | Is `RESEND_API_KEY` set in Vercel? Is the key still valid in the Resend dashboard? |
| **Contact form works but no email arrives** | Check spam. The default sender (`onboarding@resend.dev`) can only deliver to the address that owns the Resend account. |
| **Can't log in to /admin** | The password is your Supabase auth user's password — not your Supabase dashboard password. Reset it in Supabase → Authentication → Users. |
| **"Server Action was not found on the server"** | Your browser tab is running an old version. Hard-refresh (Ctrl+Shift+R). Harmless. |
| **Uploaded image doesn't appear** | Check the image is in the right Supabase Storage bucket (`content-images` or `article-images`) and that the bucket is public. |
| **"column … does not exist"** | A database migration hasn't been run. The SQL files are in `supabase/` — run the missing one in Supabase → SQL Editor. |
| **Site shows old content everywhere** | The database may be unreachable and the site is showing its built-in fallback. Check Supabase is up and the env vars are set in Vercel. |
| **Build fails with "Invalid URL"** | An environment variable is set but *empty*. An empty value is not the same as unset. Either fill it in or remove it entirely. |

### Where the database lives

Supabase → your project. The content tables are:

`site_settings` · `about_facts` · `hero_stats` · `social_links` ·
`education` · `skill_groups` · `spoken_languages` · `services` ·
`projects` · `achievements` · `articles`

Every table has the same security rule: **anyone can read**, **only your
logged-in account can write**. That rule is enforced by the database itself,
so even a bug in the website code can't let a visitor change your content.

The SQL used to create everything is committed in the **`supabase/`** folder,
in numbered order, so the whole database could be rebuilt from scratch.

---

## 9. What's done vs. what's pending

### Done and live

| Area | Status |
|---|---|
| Hero, About, Contact | ✅ Real content, editable at `/admin/site` |
| Education | ✅ 2 entries, editable |
| Skills | ✅ 6 groups + 3 languages, editable |
| Services | ✅ 6 services, editable |
| Projects | ✅ 3 real projects, editable, image upload works |
| Achievements | ✅ 3 real achievements, editable |
| Articles / blog | ✅ Fully working (public list, article pages, admin editor) |
| Contact form | ✅ Sends real email via Resend |
| Admin panel | ✅ Login-protected, covers every section |
| Light / dark / system theme | ✅ Defaults to your device setting |
| SEO metadata, sitemap, robots.txt | ✅ Live, pulls your name and role from the database |
| Deployment | ✅ Auto-deploys from GitHub |
| Photo, CV/résumé PDF | ✅ In place and linked |
| Telegram + WhatsApp buttons | ✅ Built — WhatsApp is live |

### Pending / worth doing

| Item | Why it matters |
|---|---|
| **Set your Telegram URL** | `/admin/site` → Contact details. The button is hidden until you set it. |
| **Check the "test" project is deleted** | It's hidden from the public site, but may still exist as a hidden row. Check `/admin/projects`. |
| **Write real articles** | The blog works but is currently empty. |
| **Custom domain** | Optional. If you buy one, add it in Vercel and update `NEXT_PUBLIC_SITE_URL`, then redeploy. |
| **Verify a domain in Resend** | Until then, contact emails come from a shared address and are more likely to land in spam. |
| **`npm run lint` is broken** | The script calls ESLint, which isn't installed. Doesn't affect the site at all — only matters if you want linting. |
| **Leftover test image in storage** | An unused uploaded image sits in `content-images`. Harmless; delete via Supabase → Storage if you want. |

### Known quirks, by design

- **Project cover images are cropped to a 16:10 landscape band.** This keeps
  all cards the same height. A portrait photo will have its top and bottom cut off.
- **Deleting content doesn't delete uploaded images.** Files stay in Supabase
  Storage until removed manually.
- **The fallback content in `lib/content.ts` drifts out of date** as you edit
  via the admin. That's expected — it only appears during an outage.

---

## Quick reference card

```
Live site      https://portfolio-ih18.vercel.app
Admin panel    https://portfolio-ih18.vercel.app/admin
Code           https://github.com/Marnie0/Portfolio
Database       supabase.com  → your project
Email sending  resend.com
Hosting        vercel.com

Run locally    npm install && npm run dev     → http://localhost:3000
Check build    npm run build
Publish code   git add -A && git commit -m "…" && git push origin main
Undo a push    git revert HEAD && git push origin main
Fast rollback  Vercel → Deployments → older one → Promote to Production
```
