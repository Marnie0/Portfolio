-- ============================================================
--  STEP 5 — SEED Hero / About / Contact
--  Generated from lib/site.ts, lib/content.ts and the strings
--  currently hardcoded in Hero.tsx and Contact.tsx.
--  Fixed ids + 'on conflict do nothing' = safe to re-run.
-- ============================================================

-- singleton settings row: identity, hero copy, about copy, contact copy
insert into public.site_settings (id,
  name, short_name, role, tagline, description, location, availability,
  email, phone_display, phone_tel, whatsapp_url, resume_url,
  hero_cta_primary, hero_cta_secondary, hero_resume_label,
  about_eyebrow, about_lead, about_paragraphs,
  contact_eyebrow, contact_title, contact_description
) values (1,
  'Ibrahim Hassan', 'Ibrahim H.', 'Software Engineer | Full-Stack Developer', 'Full-stack developer',
  'Portfolio of Ibrahim Hassan, a full-stack developer based in Cairo, Egypt, with a stronger pull toward backend engineering, problem solving and the systems behind the interface.',
  'Cairo, Egypt', 'Open to freelance & collaboration',
  'masrawynb10@gmail.com', '+20 107 043 9165', '+201070439165', 'https://wa.me/201070439165', '/CV.pdf',
  'View work', 'Contact me', 'Résumé',
  'About', 'I build the unglamorous parts well — the ones users feel but never see.',
  array['I am a full-stack developer with a stronger pull toward backend engineering, problem solving, and the systems behind the interface. I enjoy working across the stack, from building responsive React experiences to designing APIs, databases, and the logic that keeps everything working together.', 'My foundation comes from C++, algorithms, and problem solving, so I naturally care about what happens beneath the surface: performance, structure, maintainability, and understanding why something works instead of simply making it work.', 'What excites me most is where computer science meets the physical world. I want to build software that eventually reaches beyond the browser into areas such as embedded systems, robotics, aviation, medicine, and other real-world engineering problems.', 'For client work, I care about leaving behind something reliable and understandable, not just something that looks finished. I provide 30 days of free post-launch maintenance and technical support.'],
  'Contact', 'Let''s build something', 'Open to freelance work and collaboration. Email, phone or WhatsApp — whichever suits you.'
)
on conflict (id) do nothing;

-- 4 about meta-row entries
insert into public.about_facts (id, label, entries, sort_order) values
  ('165feca8-7899-4331-9768-7ee3d2e1dcd8', 'Based in', array['Cairo, Egypt'], 1),
  ('49715e8d-fb35-48b6-94b6-26ec8898639d', 'Focus', array['Full-Stack', 'Backend', 'React'], 2),
  ('9061b326-153a-46ac-a1e8-a208915f153f', 'Foundation', array['DSA', 'Problem Solving', 'CS'], 3),
  ('802b1454-45a6-4108-90dc-064a13e2430c', 'Availability', array['Open to Opportunities & Collaboration'], 4)
on conflict (id) do nothing;

-- 2 hero stats
insert into public.hero_stats (id, value, label, sort_order) values
  ('5a9ce37f-6686-4b6f-8966-915f9c337549', '10+', 'Projects', 1),
  ('1fda4686-6bf5-4246-bb94-934600170e69', '20+', 'Repos', 2)
on conflict (id) do nothing;

-- 2 social links (hero, footer, contact rows and JSON-LD sameAs)
insert into public.social_links (id, label, url, icon, display, sort_order) values
  ('aa65b6b9-db62-4239-830c-2185629e80b0', 'GitHub', 'https://github.com/Marnie0', 'github', '@Marnie0', 1),
  ('06585b7b-cfed-42e7-bdcd-94f1b9fbc363', 'LinkedIn', 'https://www.linkedin.com/in/ibrahim-hassan-552692239/', 'linkedin', 'in/ibrahim-hassan-552692239', 2)
on conflict (id) do nothing;
