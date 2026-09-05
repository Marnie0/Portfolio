import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Education } from '@/components/sections/Education';
import { Skills } from '@/components/sections/Skills';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { Achievements } from '@/components/sections/Achievements';
import { ArticlesCta } from '@/components/sections/ArticlesCta';
import { Contact } from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Skills />
      <Services />
      <Projects />
      <Achievements />
      <ArticlesCta />
      <Contact />
    </>
  );
}
