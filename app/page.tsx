import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04]">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
      <main className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <FeaturedProjects />
      <ProjectsGrid />
      <Contact />
    </main>
    </>
  );
}
