"use client";

import { motion } from "framer-motion";
import AnimatedContent from "@/components/AnimatedContent";

const experiences = [
  {
    role: "Full Stack Developer Intern",
    company: "Codemetron",
    date: "Feb 2026 – Present",
  },
  {
    role: "Placement Executive",
    company: "Indira Group of Institutes",
    date: "Feb 2025 – Present",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 px-6 max-w-7xl mx-auto w-full">
      <AnimatedContent distance={100} direction="vertical" reverse={false} duration={0.8} ease="power3.out">
        <div className="flex flex-col gap-12">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Experience</h2>

          <div className="relative border-l border-foreground/10 ml-3 md:ml-4 flex flex-col gap-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 md:pl-10"
              >
                {/* Timeline dot */}
                <div className="absolute left-[-5px] top-2 w-[9px] h-[9px] rounded-full bg-accent ring-4 ring-background" />

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-mono text-accent">{exp.date}</span>
                  <h3 className="text-2xl font-bold tracking-tight">{exp.role}</h3>
                  <p className="text-foreground/70 text-lg">{exp.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
