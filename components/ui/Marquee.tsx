"use client";

import { motion } from "framer-motion";

const techs = [
  "Next.js", "TypeScript", "PostgreSQL", "Docker", "MinIO", 
  "React", "Node.js", "Express", "Tailwind CSS", "Prisma", 
  "MongoDB", "Framer Motion", "Vite", "Electron"
];

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden border-y border-foreground/10 py-8 bg-background/30 backdrop-blur-sm relative flex items-center">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 35, repeat: Infinity }}
      >
        {[...techs, ...techs].map((tech, i) => (
          <span key={i} className="text-2xl md:text-4xl font-bold text-foreground/20 uppercase tracking-wider">
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
