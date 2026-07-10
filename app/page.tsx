import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Leadership } from "@/components/sections/Leadership";
import { AIShowcase } from "@/components/sections/AIShowcase";
import { Contact } from "@/components/sections/Contact";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { DarkAtmosphere } from "@/components/effects/DarkAtmosphere";
import { CinematicVeil } from "@/components/effects/CinematicVeil";
import { AmbienceAudio } from "@/components/effects/AmbienceAudio";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { ScrollProgress } from "@/components/effects/ScrollProgress";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <SmoothScroll />
      <ScrollProgress />
      <AmbientBackground />
      <DarkAtmosphere />
      <CinematicVeil />
      <AmbienceAudio />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <AIShowcase />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
