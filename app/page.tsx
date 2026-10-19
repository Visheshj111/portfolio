import PortfolioNav from "@/components/PortfolioNav";
import Hero from "@/components/sections/Hero";
import SelectedWork from "@/components/sections/SelectedWork";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/ui/Marquee";
import { profile } from "@/lib/portfolio";

export default function Home() {
  return <>
    <a className="skip-link" href="#content">Skip to content</a>
    <PortfolioNav />
    <main id="content"><Hero /><Marquee /><SelectedWork /><Experience /><About /><Contact /></main>
    <footer className="site-footer page-width"><a className="wordmark" href="#top" aria-label="Back to top">vj<span>.</span></a><span>Made with intention. And a fair bit of debugging.</span><a href={profile.github} target="_blank" rel="noreferrer">© {new Date().getFullYear()} Vishesh Jangid ↗</a></footer>
  </>;
}
