import Image from 'next/image';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';
import { projects, type Project } from '@/lib/content';
import { siteConfig } from '@/lib/site';

/* ------------------------------- shared bits ------------------------------ */

function TechList({ tech, projectId }: { tech: readonly string[]; projectId: string }) {
  return (
    <ul aria-label="Technologies used" className="flex flex-wrap gap-2">
      {tech.map((item) => (
        <li
          key={`${projectId}-${item}`}
          className="rounded-md border border-border bg-surface-muted px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function FocusBlock({ focus }: { focus: string }) {
  return (
    <div className="rounded-2xl border-l-2 border-accent bg-accent-soft/60 py-4 pl-5 pr-4">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
        What it covers
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-fg/80 text-pretty">{focus}</p>
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.links.live && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View the live ${project.title} site (opens in a new tab)`}
          className="group/link inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-85"
        >
          Live site
          <Icon
            name="arrowUpRight"
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </a>
      )}
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View the ${project.title} source on GitHub (opens in a new tab)`}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-fg/30 hover:bg-surface-muted"
        >
          <Icon name="github" className="h-4 w-4" />
          Source
        </a>
      )}
    </div>
  );
}

function ProjectImage({ project, sizes }: { project: Project; sizes: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-muted">
      <Image
        src={project.image}
        alt={project.imageAlt}
        width={1600}
        height={1000}
        sizes={sizes}
        className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
      />
    </div>
  );
}

/* --------------------------- featured showcase ---------------------------- */

function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const imageFirst = index % 2 === 0;

  return (
    <Reveal as="article" y={24}>
      <div className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className={imageFirst ? 'lg:order-1' : 'lg:order-2'}>
          <ProjectImage project={project} sizes="(min-width: 1024px) 50vw, 92vw" />
        </div>

        <div className={imageFirst ? 'lg:order-2' : 'lg:order-1'}>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
            <span className="rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-accent-fg">
              Featured
            </span>
            {project.category} · {project.year}
          </p>

          <h3 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
            {project.title}
          </h3>

          <p className="mt-4 text-base leading-relaxed text-muted text-pretty">{project.summary}</p>

          <div className="mt-6">
            <FocusBlock focus={project.focus} />
          </div>

          <div className="mt-6">
            <TechList tech={project.tech} projectId={project.id} />
          </div>

          <div className="mt-7">
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------- grid card -------------------------------- */

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <Reveal as="li" delay={delay}>
      <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-4 transition-colors duration-300 hover:border-accent/40 sm:p-5">
        <ProjectImage project={project} sizes="(min-width: 1024px) 46vw, 92vw" />

        <div className="flex flex-1 flex-col px-2 pb-2 pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
            {project.category} · {project.year}
          </p>

          <h3 className="mt-3 font-display text-2xl leading-tight text-balance">
            {project.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">{project.summary}</p>

          <div className="mt-5">
            <FocusBlock focus={project.focus} />
          </div>

          {/* mt-auto pins the tags and links to the bottom so cards in a row
              line up regardless of copy length. */}
          <div className="mt-5">
            <TechList tech={project.tech} projectId={project.id} />
          </div>

          <div className="mt-auto pt-6">
            <ProjectLinks project={project} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* -------------------------------- section --------------------------------- */

export function Projects() {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <Section id="projects" className="py-24 sm:py-32 lg:py-40">
      <SectionHeading
        id="projects"
        eyebrow="Selected work"
        title="Projects I am proud of"
        description="Live builds from my DEPI training and my own practice. Each one links to the running site and to the source."
      />

      <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
        {featured.map((project, index) => (
          <FeaturedProject key={project.id} project={project} index={index} />
        ))}
      </div>

      <ul className="mt-20 grid gap-6 sm:mt-28 lg:grid-cols-2">
        {rest.map((project, index) => (
          <ProjectCard key={project.id} project={project} delay={(index % 2) * 0.08} />
        ))}
      </ul>

      <Reveal delay={0.1}>
        <p className="mt-16 text-center text-sm text-muted">
          More work lives on{' '}
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent-text underline underline-offset-4 hover:text-fg"
          >
            GitHub
          </a>
          .
        </p>
      </Reveal>
    </Section>
  );
}
