"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import dynamic from "next/dynamic";
import BlurText from "@/components/BlurText";
import Magnetic from "@/components/ui/Magnetic";
import RateLimitPlayground from "@/components/RateLimitPlayground";

const Aurora = dynamic(() => import("@/components/Aurora"), { ssr: false });

export default function Hero() {
  return <section id="top" className="hero page-width">
    <div className="hero-aurora" aria-hidden="true"><Aurora colorStops={["#24412a", "#acc58b", "#514177"]} speed={.3} amplitude={.8} blend={.7} /></div>
    <div className="hero-heading">
      <div className="hero-intro"><span className="status-dot" /><BlurText text="Full-stack developer · Pune, India" delay={40} className="eyebrow" /></div>
      <h1><motion.span initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>Vishesh</motion.span><motion.span initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .12 }}>Jangid<span className="hero-period">.</span></motion.span></h1>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .3 }}><p className="hero-lead">Good interfaces.<br /><span>Even better under the hood.</span></p><p className="hero-description">I build across the stack — from the interaction you notice to the systems you shouldn’t have to think about.</p><div className="hero-actions"><Magnetic><a className="button button-accent" href="#projects">Explore my work <ArrowDown size={16} /></a></Magnetic><Magnetic><a className="button button-outline" href="/resume.pdf" target="_blank" rel="noreferrer"><FileText size={15} /> The résumé <ArrowUpRight size={14} /></a></Magnetic></div></motion.div>
    </div>
    <motion.div className="hero-workbench" initial={{ opacity: 0, y: 30, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .9, delay: .2 }}><div className="workbench-label"><span>THE WORK, IN MINIATURE</span><span>↙</span></div><RateLimitPlayground /><p className="workbench-footnote"><span className="status-dot" /> Open to thoughtful teams & interesting problems.</p></motion.div>
    <div className="hero-bottom"><span>BCA ’27 · Building at Codemetron</span><a href="#projects">Scroll to the good stuff <ArrowDown size={13} /></a><span>Design → build → understand → improve</span></div>
  </section>;
}
