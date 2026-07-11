"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import Aurora from "@/components/Aurora";
import BlurText from "@/components/BlurText";
import Magnetic from "@/components/ui/Magnetic";

export default function Hero() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden">
      {/* ReactBits Aurora animated background */}
      <div className="absolute inset-0 -z-20 opacity-30 pointer-events-none">
        <Aurora 
          colorStops={["#1e1b4b", "#4c1d95", "#0f172a"]} 
          speed={0.5} 
          amplitude={1.5} 
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto w-full flex flex-col gap-8"
      >
        <div className="flex flex-col">
          <motion.p variants={item} className="text-accent font-mono text-sm md:text-base mb-4 tracking-tight">
            Hello, I am Vishesh Jangid
          </motion.p>
          
          <div className="text-[12vw] leading-[0.85] font-bold tracking-tighter uppercase max-w-full">
            <BlurText 
              text="FULL-STACK" 
              delay={100} 
              animateBy="words"
            />
            <BlurText 
              text="DEVELOPER" 
              delay={200} 
              animateBy="words" 
            />
          </div>
        </div>

        <motion.div variants={item} className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-8">
          <p className="text-foreground/70 text-lg md:text-xl max-w-md leading-relaxed font-medium">
            BCA student, Pune — building production web apps.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0 md:ml-auto">
            <Magnetic>
              <Link
                href="#projects"
                className="group flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform"
              >
                View Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-medium border border-foreground/20 hover:bg-foreground/10 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Resume
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Background decoration fallback (if Aurora disabled or slow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-30 pointer-events-none" />
    </section>
  );
}
