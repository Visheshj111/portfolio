"use client";

import { ArrowUpRight } from "lucide-react";
import StaggeredMenu from "@/components/StaggeredMenu";
import { profile } from "@/lib/portfolio";

const items = [
  { label: "Work", ariaLabel: "Selected work", link: "#projects" },
  { label: "Experience", ariaLabel: "Professional experience", link: "#experience" },
  { label: "About", ariaLabel: "About Vishesh", link: "#about" },
  { label: "Contact", ariaLabel: "Contact Vishesh", link: "#contact" },
];

export default function PortfolioNav() {
  return <>
    <header className="site-header"><a href="#top" className="wordmark" aria-label="Vishesh Jangid, back to top">vj<span>.</span></a><nav aria-label="Main navigation">{items.map(item => <a key={item.link} href={item.link}>{item.label}</a>)}</nav><a className="nav-contact" href={`mailto:${profile.email}`}>Let’s talk <ArrowUpRight size={15} /></a></header>
    <div className="mobile-nav"><StaggeredMenu isFixed colors={["#557249", "#c3e89d"]} accentColor="#47782d" menuButtonColor="#f1f2e9" openMenuButtonColor="#10120f" items={items} socialItems={[{ label: "GitHub", link: profile.github }, { label: "LinkedIn", link: profile.linkedin }]} /></div>
  </>;
}
