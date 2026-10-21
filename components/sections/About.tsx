"use client";

import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import { profile } from "@/lib/portfolio";

export default function About() {
  return <section id="about" className="section page-width about-section"><AnimatedContent distance={35} duration={.65} animateOpacity={false}><div className="section-heading"><span className="eyebrow">03 / The person behind the commits</span><span className="section-kicker">Always a work in progress.</span></div><div className="about-grid"><div><h2 className="section-title">Curiosity is<br />part of the stack<span>.</span></h2><p className="about-copy">I’m a BCA student, a developer, and the person who wants to know <em>why</em> something broke before patching it.</p><p className="muted-copy">My projects have taken me from web interfaces to browser extensions, desktop tools, and distributed API systems. I like the moment a collection of moving parts starts behaving like one considered product.</p><a className="text-link" href={profile.github} target="_blank" rel="noreferrer">Follow the experiments <ArrowUpRight size={16} /></a></div><div className="about-notes"><div><GraduationCap size={21} /><span className="eyebrow">Currently studying</span><h3>Bachelor of Computer Applications</h3><p>Indira College of Commerce and Science</p><div className="about-meta"><span>2024 — 2027</span><span>8.96 CGPA</span></div></div><div className="about-location"><MapPin size={20} /><div><h3>Pune, India</h3><p>Building here. Open to what’s next.</p></div><span>↗</span></div></div></div></AnimatedContent></section>;
}
