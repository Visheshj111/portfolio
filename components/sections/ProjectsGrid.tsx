"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import Link from "next/link";

const projects = [
  {
    title: "Claude Usage Tracker",
    description: "Chrome extension tracking Claude.ai usage including session limits, peak-hour monitoring, and per-model breakdown. Fully local with no telemetry.",
    tags: ["TypeScript", "JavaScript", "HTML", "CSS"],
    github: "https://github.com/Visheshj111/claude-usage",
  },
  {
    title: "Persisto",
    description: "AI-powered goal tracking platform providing personalized daily tasks. Placed Top 10 of 250+ teams at the State-Level OpenAI Hackathon.",
    tags: ["React", "Vite", "Node.js", "Express", "MongoDB", "OpenAI API", "Google OAuth"],
    github: "https://github.com/Visheshj111/Persisto",
  },
  {
    title: "Aptitude Assessment Platform",
    description: "Concurrent exam platform load-tested for 200+ simultaneous users. Features anti-cheat mechanisms like tab-switch detection and DevTools blocking.",
    tags: ["React", "Node.js", "Express", "MongoDB Atlas", "JWT"],
    github: "https://github.com/Visheshj111/aptitude-test-app",
  },
  {
    title: "Olivier",
    description: "Desktop lead manager for sales pipelines. Offline-first architecture with auto-updates handled via GitHub Releases.",
    tags: ["Electron", "React", "Vite"],
    github: "https://github.com/Visheshj111/OlivierApp",
  },
];

export default function ProjectsGrid() {
  return (
    <section className="relative pb-24 px-6 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={project.title}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-foreground/5 border border-foreground/10 hover:border-accent/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/50 hover:text-accent transition-colors"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </Link>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded bg-background/50 border border-foreground/5 text-foreground/80 group-hover:border-accent/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subtle background glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
