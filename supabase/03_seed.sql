-- ============================================================
--  STEP 3 of 3 — SEED YOUR EXISTING CONTENT
--  Generated directly from lib/content.ts, so the text matches
--  what is live today, character for character.
--
--  Each row carries a fixed UUID and ends with
--  'on conflict (id) do nothing', so running this twice
--  CANNOT create duplicates.
-- ============================================================

-- 2 row(s) into education
insert into public.education (id, degree, institution, period, location, description, highlights, sort_order) values
  ('0f63addb-ac0b-4142-af62-a9f33160f30b', 'B.Sc. in Computer Science', 'Modern Academy', '2024 – 2028 (Expected)', 'Cairo, Egypt', 'Currently a third-year Computer Science student with a 3.00/4.00 GPA. Building a strong foundation in programming, problem solving, data structures and algorithms, databases, and core computer science concepts.', array['Computer Science', 'Network', 'Problem Solving', 'Databases', 'Software Engineering', 'More'], 1),
  ('a1c89172-5a05-4e37-9133-de5bccb83bb5', 'React Frontend Web Developer', 'Digital Egypt Pioneers Initiative (DEPI)', '2026', null, 'Professional training focused on modern web development and building production-ready applications. The track covers frontend development with JavaScript, TypeScript, React, HTML, and CSS, alongside technologies and concepts related to full-stack development, version control, and software development practices.', array['JavaScript', 'TypeScript', 'React', 'Web Design', 'Git', 'Web Development'], 2)
on conflict (id) do nothing;

-- 6 row(s) into skill_groups
insert into public.skill_groups (id, title, skills, sort_order) values
  ('4d1f497e-36ef-4e94-b86d-b0e723cdb01c', 'Programming Languages', array['C++', 'JavaScript', 'TypeScript'], 1),
  ('0fdef0b8-df5f-408b-84ed-2a2778013210', 'Frontend Development', array['HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'React', 'Next.js'], 2),
  ('058df991-6e1a-409f-b36c-e09da22d2770', 'Backend Development', array['Node.js', 'Express.js'], 3),
  ('9b23781e-f754-4950-a8c2-a34dff60bffe', 'Databases', array['SQL', 'PostgreSQL', 'MongoDB'], 4),
  ('00203dfb-3a8f-4c3f-aa6e-ca76a1fe7e9a', 'Tools & Platforms', array['Git', 'GitHub', 'Visual Studio Code', 'Linux'], 5),
  ('f1b21839-ab7a-46f9-b491-8e3d3d17470f', 'Core Strengths', array['Problem Solving', 'Programming Fundamentals', 'Data Structures and Algorithms', 'Clean Code', 'AI-Assisted Development'], 6)
on conflict (id) do nothing;

-- 3 row(s) into spoken_languages
insert into public.spoken_languages (id, name, level, sort_order) values
  ('901cd03a-7c9c-4be1-af6a-4f04023cd9b0', 'Arabic', 'Native', 1),
  ('3d69fd9a-d222-4fa7-ae38-88b77f31e710', 'English', 'C1 · Advanced', 2),
  ('78748ac0-33f7-499f-a04f-e496b2a8e44e', 'German', 'A1 · Beginner', 3)
on conflict (id) do nothing;

-- 6 row(s) into services
insert into public.services (id, title, description, deliverables, icon, sort_order) values
  ('fa72b608-b0e8-4287-bf66-e6561115c0cd', 'React Frontend Development', 'Interactive interfaces in React, JavaScript and TypeScript that hold up on every screen size, wired up to your data through APIs.', array['Component architecture', 'Mobile-first layout', 'TypeScript throughout', 'API integration', 'Cross-browser checks'], 'code', 1),
  ('1b1b8416-4852-4c4f-a745-6421b39393ca', 'Backend & API Development', 'Server-side logic and REST APIs with Node.js and Express, covering routing, validation and authentication.', array['REST API endpoints', 'Express server setup', 'Auth and routing'], 'server', 2),
  ('e53cfd75-f52e-4f5a-960e-d4cb76f3baa0', 'Database Design & Integration', 'Schema design and integration with SQL, PostgreSQL or MongoDB, so your data is stored in a shape that lasts.', array['Schema design', 'Queries and indexes', 'Backend integration'], 'database', 3),
  ('f95bab8a-9253-4ad6-a5c9-f9d402ec7e8a', 'AI-Assisted Development', 'I work with AI throughout the build to move faster and deliver better results — without cutting corners. Everything it produces is reviewed, tested and understood before it ships.', array['Faster turnaround', 'Fewer bugs reaching you', 'Reviewed, tested output'], 'gauge', 4),
  ('417c2c27-692b-44a4-8839-4026c59b0604', 'Bug Fixing & Troubleshooting', 'Finding out why something actually breaks and fixing the cause rather than the symptom.', array['Root-cause diagnosis', 'Tested fix', 'Written explanation'], 'wrench', 5),
  ('8436cc00-0303-493c-a42b-65f02668d458', 'Post-Launch Support', 'I do not disappear at handover. Every project includes 30 days of free maintenance and technical support after launch.', array['30 days free support', 'Post-launch bug fixes', 'Handover walkthrough'], 'lifebuoy', 6)
on conflict (id) do nothing;

-- 3 row(s) into projects
insert into public.projects (id, title, category, year, summary, focus, tech, image_url, image_alt, live_url, github_url, featured, sort_order) values
  ('64de49ad-bce9-4ecb-815d-8e53705b2b37', 'Frontend Playground', 'UI Components', '2026', 'A growing collection of small UI components, effects and experiments — carousels, hover states and layout ideas built from scratch rather than pulled from a library.', 'Building interface pieces by hand keeps the underlying behaviour visible. Everything here is plain HTML, CSS and JavaScript, so the DOM work and the state handling stay in the open instead of behind a framework.', array['HTML5', 'CSS3', 'JavaScript'], '/projects/frontend-playground.jpg', 'Frontend Playground showing an image carousel component with numbered step indicators and previous and next controls.', 'https://frontend-playground-ih18.vercel.app', 'https://github.com/Marnie0/Frontend-playground', true, 1),
  ('4d644fdb-d182-4c88-9177-b360cc136a59', 'Facebook Login & Sign-up UI', 'DEPI · Assignment', '2026', 'A recreation of Facebook''s login and sign-up screens, rebuilt from scratch in HTML and CSS with no component library.', 'Reproducing a familiar production interface is an honest test of layout accuracy: form structure, spacing, button states and the small details that decide whether a page feels right.', array['HTML5', 'CSS3'], '/projects/depi-assignment-2.jpg', 'Recreation of the Facebook login page with email and password fields, a log in button and a create new account button.', 'https://depi-assignment2.vercel.app', 'https://github.com/Marnie0/depiAssignment2', false, 2),
  ('8d3bb47d-0036-489f-9086-6b503a2310dc', 'The Town — Landing Page', 'DEPI · Assignment', '2026', 'A multi-section marketing landing page with a full-bleed hero, fixed navigation and stacked content sections.', 'The first DEPI assignment, built with CSS alone and no framework — background layering, typography scale and a navigation bar that stays put as the page scrolls.', array['HTML5', 'CSS3'], '/projects/depi-assignment-1.jpg', 'The Town landing page showing a city skyline at sunset behind a centred title and a fixed navigation bar.', 'https://depiassignment1.vercel.app', 'https://github.com/Marnie0/depiAssignment1', false, 3)
on conflict (id) do nothing;

-- 3 row(s) into achievements
insert into public.achievements (id, title, issuer, year, description, type, sort_order) values
  ('66baddac-85c7-48ca-99c8-0b53343f8565', '350+ Problems Solved on Codeforces', 'Codeforces', 'Ongoing', 'Solved over 350 competitive programming problems, building the algorithmic thinking and problem-solving habits I rely on in everything else I build.', 'Problem Solving', 1),
  ('5754a045-13fb-456d-968f-d1edaf93a369', 'React Frontend Web Developer Track', 'Digital Egypt Pioneers Initiative (DEPI)', '2026', 'Completed the professional training track covering modern frontend development with JavaScript, TypeScript and React, alongside version control and software development practices.', 'Training', 2),
  ('52b214ea-b6a1-45a3-ad7f-ba8774b96d14', 'B.Sc. Computer Science — 3.00/4.00 GPA', 'Modern Academy, Cairo', '2024 – 2028', 'Currently in the third year of the programme, maintaining a 3.00/4.00 GPA across programming, data structures and algorithms, databases and core computer science subjects.', 'Academic', 3)
on conflict (id) do nothing;
