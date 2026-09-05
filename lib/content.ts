/**
 * All page copy lives here so content can be swapped without touching markup.
 * Every export is typed — the compiler will flag a missing field after an edit.
 */

/* ------------------------------- About -------------------------------- */

export const about = {
  heading: 'About',
  lead: 'I build the unglamorous parts well \u2014 the ones users feel but never see.',
  paragraphs: [
    'I am a full-stack developer with a stronger pull toward backend engineering, problem solving, and the systems behind the interface. I enjoy working across the stack, from building responsive React experiences to designing APIs, databases, and the logic that keeps everything working together.',
    'My foundation comes from C++, algorithms, and problem solving, so I naturally care about what happens beneath the surface: performance, structure, maintainability, and understanding why something works instead of simply making it work.',
    'What excites me most is where computer science meets the physical world. I want to build software that eventually reaches beyond the browser into areas such as embedded systems, robotics, aviation, medicine, and other real-world engineering problems.',
    'For client work, I care about leaving behind something reliable and understandable, not just something that looks finished. I provide 30 days of free post-launch maintenance and technical support.',
  ],
  // An array value renders as stacked lines; a string renders inline.
  facts: [
    { label: 'Based in', value: 'Cairo, Egypt' },
    { label: 'Focus', value: ['Full-Stack', 'Backend', 'React'] },
    { label: 'Foundation', value: ['DSA', 'Problem Solving', 'CS'] },
    { label: 'Availability', value: 'Open to Opportunities & Collaboration' },
  ],
} as const;

/* ------------------------------ Education ------------------------------ */

export type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  period: string;
  /** Optional: omitted when a programme has no meaningful location. */
  location?: string;
  description: string;
  highlights: readonly string[];
};

export const education: readonly EducationItem[] = [
  {
    id: 'bsc',
    degree: 'B.Sc. in Computer Science',
    institution: 'Modern Academy',
    period: '2024 \u2013 2028 (Expected)',
    location: 'Cairo, Egypt',
    description:
      'Currently a third-year Computer Science student with a 3.00/4.00 GPA. Building a strong foundation in programming, problem solving, data structures and algorithms, databases, and core computer science concepts.',
    highlights: [
      'Computer Science',
      'Network',
      'Problem Solving',
      'Databases',
      'Software Engineering',
      'More',
    ],
  },
  {
    id: 'depi',
    degree: 'React Frontend Web Developer',
    institution: 'Digital Egypt Pioneers Initiative (DEPI)',
    period: '2026',
    description:
      'Professional training focused on modern web development and building production-ready applications. The track covers frontend development with JavaScript, TypeScript, React, HTML, and CSS, alongside technologies and concepts related to full-stack development, version control, and software development practices.',
    highlights: ['JavaScript', 'TypeScript', 'React', 'Web Design', 'Git', 'Web Development'],
  },
];

/* -------------------------------- Skills -------------------------------- */

export type SkillGroup = {
  id: string;
  title: string;
  skills: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    skills: ['C++', 'JavaScript', 'TypeScript'],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    skills: ['HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'React', 'Next.js'],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    skills: ['Node.js', 'Express.js'],
  },
  {
    id: 'databases',
    title: 'Databases',
    skills: ['SQL', 'PostgreSQL', 'MongoDB'],
  },
  {
    id: 'tools',
    title: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'Visual Studio Code', 'Linux'],
  },
  {
    id: 'core',
    title: 'Core Strengths',
    skills: [
      'Problem Solving',
      'Programming Fundamentals',
      'Data Structures and Algorithms',
      'Clean Code',
      'AI-Assisted Development',
    ],
  },
];

/** Spoken languages, shown beneath the skill grid. */
export const spokenLanguages: readonly { name: string; level: string }[] = [
  { name: 'Arabic', level: 'Native' },
  { name: 'English', level: 'C1 · Advanced' },
  { name: 'German', level: 'A1 · Beginner' },
];

/* ------------------------------- Services ------------------------------- */

export type Service = {
  id: string;
  title: string;
  description: string;
  deliverables: readonly string[];
  /** Key into the icon map in `components/ui/Icon.tsx`. */
  icon: 'code' | 'layout' | 'server' | 'database' | 'wrench' | 'lifebuoy' | 'gauge';
};

export const services: readonly Service[] = [
  {
    id: 'responsive-web',
    title: 'Responsive Web Development',
    description:
      'Websites that hold up on every screen size, built mobile-first with HTML5, CSS3 and React.',
    deliverables: ['Mobile-first layout', 'Reusable components', 'Cross-browser checks'],
    icon: 'layout',
  },
  {
    id: 'react-frontend',
    title: 'React Frontend Development',
    description:
      'Interactive interfaces built with React, JavaScript and TypeScript, wired up to your data through APIs.',
    deliverables: ['Component architecture', 'TypeScript throughout', 'API integration'],
    icon: 'code',
  },
  {
    id: 'backend-api',
    title: 'Backend & API Development',
    description:
      'Server-side logic and REST APIs with Node.js and Express, covering routing, validation and authentication.',
    deliverables: ['REST API endpoints', 'Express server setup', 'Auth and routing'],
    icon: 'server',
  },
  {
    id: 'databases',
    title: 'Database Design & Integration',
    description:
      'Schema design and integration with SQL, PostgreSQL or MongoDB, so your data is stored in a shape that lasts.',
    deliverables: ['Schema design', 'Queries and indexes', 'Backend integration'],
    icon: 'database',
  },
  {
    id: 'debugging',
    title: 'Bug Fixing & Troubleshooting',
    description:
      'Finding out why something actually breaks and fixing the cause rather than the symptom.',
    deliverables: ['Root-cause diagnosis', 'Tested fix', 'Written explanation'],
    icon: 'wrench',
  },
  {
    id: 'support',
    title: 'Post-Launch Support',
    description:
      'I do not disappear at handover. Every project includes 30 days of free maintenance and technical support after launch.',
    deliverables: ['30 days free support', 'Post-launch bug fixes', 'Handover walkthrough'],
    icon: 'lifebuoy',
  },
  {
    id: 'ai-assisted',
    title: 'AI-Assisted Development',
    description:
      'I work with AI throughout the build to move faster and deliver better results \u2014 without cutting corners. Everything it produces is reviewed, tested and understood before it ships.',
    deliverables: ['Faster turnaround', 'Fewer bugs reaching you', 'Reviewed, tested output'],
    icon: 'gauge',
  },
];

/* ------------------------------- Projects ------------------------------- */

export type Project = {
  id: string;
  title: string;
  /** Short kicker shown above the title. */
  category: string;
  year: string;
  summary: string;
  /** What the build exercised, rendered as its own block. */
  focus: string;
  tech: readonly string[];
  image: string;
  /** Alt text is content, not decoration — keep it descriptive. */
  imageAlt: string;
  links: { live?: string; github?: string };
  featured?: boolean;
};

export const projects: readonly Project[] = [
  {
    id: 'frontend-playground',
    title: 'Frontend Playground',
    category: 'UI Components',
    year: '2026',
    summary:
      'A growing collection of small UI components, effects and experiments — carousels, hover states and layout ideas built from scratch rather than pulled from a library.',
    focus:
      'Building interface pieces by hand keeps the underlying behaviour visible. Everything here is plain HTML, CSS and JavaScript, so the DOM work and the state handling stay in the open instead of behind a framework.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: '/projects/frontend-playground.jpg',
    imageAlt:
      'Frontend Playground showing an image carousel component with numbered step indicators and previous and next controls.',
    links: {
      live: 'https://frontend-playground-ih18.vercel.app',
      github: 'https://github.com/Marnie0/Frontend-playground',
    },
    featured: true,
  },
  {
    id: 'depi-assignment-2',
    title: 'Facebook Login & Sign-up UI',
    category: 'DEPI · Assignment',
    year: '2026',
    summary:
      "A recreation of Facebook's login and sign-up screens, rebuilt from scratch in HTML and CSS with no component library.",
    focus:
      'Reproducing a familiar production interface is an honest test of layout accuracy: form structure, spacing, button states and the small details that decide whether a page feels right.',
    tech: ['HTML5', 'CSS3'],
    image: '/projects/depi-assignment-2.jpg',
    imageAlt:
      'Recreation of the Facebook login page with email and password fields, a log in button and a create new account button.',
    links: {
      live: 'https://depi-assignment2.vercel.app',
      github: 'https://github.com/Marnie0/depiAssignment2',
    },
  },
  {
    id: 'depi-assignment-1',
    title: 'The Town — Landing Page',
    category: 'DEPI · Assignment',
    year: '2026',
    summary:
      'A multi-section marketing landing page with a full-bleed hero, fixed navigation and stacked content sections.',
    focus:
      'The first DEPI assignment, built with CSS alone and no framework — background layering, typography scale and a navigation bar that stays put as the page scrolls.',
    tech: ['HTML5', 'CSS3'],
    image: '/projects/depi-assignment-1.jpg',
    imageAlt:
      'The Town landing page showing a city skyline at sunset behind a centred title and a fixed navigation bar.',
    links: {
      live: 'https://depiassignment1.vercel.app',
      github: 'https://github.com/Marnie0/depiAssignment1',
    },
  },
];

/* ----------------------------- Achievements ----------------------------- */

export type Achievement = {
  id: string;
  title: string;
  issuer: string;
  /** Free text, not a strict date — an ongoing effort has no single year. */
  year: string;
  description: string;
  /** Kept short: it renders as a badge beside the year on a narrow card. */
  type: 'Problem Solving' | 'Training' | 'Academic';
};

export const achievements: readonly Achievement[] = [
  {
    id: 'codeforces',
    title: '350+ Problems Solved on Codeforces',
    issuer: 'Codeforces',
    year: 'Ongoing',
    description:
      'Solved over 350 competitive programming problems, building the algorithmic thinking and problem-solving habits I rely on in everything else I build.',
    type: 'Problem Solving',
  },
  {
    id: 'depi-track',
    title: 'React Frontend Web Developer Track',
    issuer: 'Digital Egypt Pioneers Initiative (DEPI)',
    year: '2026',
    description:
      'Completed the professional training track covering modern frontend development with JavaScript, TypeScript and React, alongside version control and software development practices.',
    type: 'Training',
  },
  {
    id: 'bsc-progress',
    title: 'B.Sc. Computer Science — 3.00/4.00 GPA',
    issuer: 'Modern Academy, Cairo',
    year: '2024 – 2028',
    description:
      'Currently in the third year of the programme, maintaining a 3.00/4.00 GPA across programming, data structures and algorithms, databases and core computer science subjects.',
    type: 'Academic',
  },
];
