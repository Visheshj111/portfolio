"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCheck, X } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import ProjectVisual from "@/components/ProjectVisual";
import { profile, projects, type Project } from "@/lib/portfolio";

const filters = ["All work", "Systems", "Extensions", "Desktop"] as const;

export default function SelectedWork() {
  const [filter, setFilter] = useState<string>("All work");
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = projects.filter(project => filter === "All work" || project.category === filter);
  return <section id="projects" className="section page-width">
    <AnimatedContent distance={35} duration={.65} animateOpacity={false}><div className="section-heading"><span className="eyebrow">01 / Selected personal work</span><a className="section-kicker text-link" href={profile.github} target="_blank" rel="noreferrer">The rest lives on GitHub <ArrowUpRight size={14} /></a></div><div className="work-intro"><h2 className="section-title">Ideas are nice.<br />Here’s the working part<span>.</span></h2><p className="muted-copy">A few things I’ve built, shipped, and kept learning from. Open a build to see the decisions behind the interface.</p></div></AnimatedContent>
    <div className="work-filters" role="group" aria-label="Filter personal projects">{filters.map(value => <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}<span>{value === "All work" ? projects.length : projects.filter(project => project.category === value).length}</span></button>)}</div>
    <div className="projects-layout" aria-live="polite">{visible.map(project => <SpotlightCard key={project.id} spotlightColor="#c5e6a0" intensity={.06} borderGlow={.4} proximity={0} flare={false} className={`project-card project-card-${project.id}`}><ProjectVisual id={project.id} /><div className="project-content"><div className="project-meta"><span>{project.number} / {project.category}</span><span>{project.status}</span></div><h3>{project.name}</h3><p className="project-headline">{project.headline}</p><p className="project-description">{project.description}</p><div className="tech-tags">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div><div className="project-actions"><button className="text-link" onClick={() => setSelected(project)} aria-label={`Inside the ${project.name} build`}>Inside the build <ArrowRight size={15} /></button><div>{project.live && <a href={project.live.href} target="_blank" rel="noreferrer" className="project-live">{project.live.label} <ArrowUpRight size={13} /></a>}<a href={project.repository} target="_blank" rel="noreferrer" className="source-link" aria-label={`${project.name} source code on GitHub`}><ArrowUpRight size={21} /></a></div></div></div></SpotlightCard>)}</div>
    <div className="work-afterword"><span>Four different problems. A growing set of instincts.</span><a href={`${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">Explore all repositories <ArrowUpRight size={14} /></a></div>
    <ProjectDialog project={selected} onClose={() => setSelected(null)} />
  </section>;
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!project || !dialog) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = overflow; };
  }, [project]);
  if (!project) return null;
  return <dialog ref={ref} className="project-dialog" aria-labelledby="case-study-title" onClose={onClose} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div className="case-study"><button autoFocus className="case-close" aria-label="Close case study" onClick={onClose}><X size={20} /></button><span className="eyebrow">Inside the build / {project.category}</span><h2 id="case-study-title">{project.name}<span>.</span></h2><p className="case-lead">{project.headline}</p><div className="tech-tags">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div><section className="case-problem"><span className="eyebrow">The problem</span><p>{project.problem}</p></section><section><span className="eyebrow">The decisions</span><div className="case-decisions">{project.decisions.map((decision, index) => <div key={decision.title}><span>0{index + 1}</span><div><h3>{decision.title}</h3><p>{decision.description}</p></div></div>)}</div></section><section className="case-validation"><CheckCheck size={21} /><div><h3>Validation & delivery</h3><p>{project.validation}</p></div></section><section className="case-boundary"><span className="eyebrow">Scope & trade-offs</span><p>{project.boundary}</p></section><div className="case-links"><a className="button button-accent" href={project.repository} target="_blank" rel="noreferrer">Explore the source <ArrowUpRight size={15} /></a>{project.live && <a className="button button-outline" href={project.live.href} target="_blank" rel="noreferrer">{project.live.label}<ArrowUpRight size={15} /></a>}</div></div></dialog>;
}
