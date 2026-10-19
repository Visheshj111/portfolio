"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, Pause, Play } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";

export default function Experience() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  async function toggleVideo() {
    if (!video.current) return;
    if (playing) { video.current.pause(); setPlaying(false); }
    else { try { await video.current.play(); setPlaying(true); } catch { setPlaying(false); } }
  }
  return <section id="experience" className="section experience-section"><div className="page-width"><AnimatedContent distance={35} duration={.65} animateOpacity={false}><div className="section-heading"><span className="eyebrow">02 / Beyond personal projects</span><span className="section-kicker">Learning with real responsibilities.</span></div><div className="experience-intro"><h2 className="section-title">Work, with people<br />on the other side<span>.</span></h2><p className="muted-copy">Professional experience has taught me to care about the handoff, the people using the product, and what happens after it ships.</p></div><div className="experience-list"><article><div className="experience-date">FEB 2026 — PRESENT</div><div><h3>Full Stack Developer Intern <BriefcaseBusiness size={17} /></h3><p>Codemetron</p><p className="experience-description">Building and improving web applications across frontend and backend workflows.</p></div><span className="experience-type">Engineering</span></article><article><div className="experience-date">FEB 2025 — PRESENT</div><div><h3>Placement Executive <ArrowUpRight size={17} /></h3><p>Indira Group of Institutes</p><p className="experience-description">Coordinating campus recruitment and helping students and recruiting teams connect.</p></div><span className="experience-type">People & coordination</span></article></div><div className="company-feature"><div className="company-media"><video ref={video} src="/playnear/hero.mp4" poster="/playnear/screenshot-1.png" muted playsInline loop preload="none" onPause={() => setPlaying(false)} aria-label="PlayNear product walkthrough" /><button onClick={toggleVideo} aria-label={playing ? "Pause PlayNear walkthrough" : "Play PlayNear walkthrough"}>{playing ? <Pause size={18} /> : <Play size={18} />}<span>{playing ? "Pause walkthrough" : "Play walkthrough"}</span></button></div><div className="company-description"><span className="eyebrow">An internship build / Company work</span><h3>PlayNear<span>↗</span></h3><p>A sports-academy discovery platform built at Codemetron, with geolocation, academy dashboards, and an image-storage pipeline.</p><div className="tech-tags"><span>Next.js</span><span>PostgreSQL</span><span>Prisma</span><span>MinIO</span></div><p className="company-note">Archived project. Original walkthrough retained; the product is no longer live.</p><a href="/playnear/screenshot-1.png" target="_blank" rel="noreferrer" className="text-link">Open product screenshot <ArrowUpRight size={14} /></a></div></div></AnimatedContent></div></section>;
}
