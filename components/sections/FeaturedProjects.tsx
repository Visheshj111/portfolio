"use client";

import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import React, { useRef } from "react";
import Link from "next/link";
import AnimatedContent from "@/components/AnimatedContent";

function TiltMedia({ videoSrc, imageSrc }: { videoSrc?: string; imageSrc: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full aspect-video rounded-2xl overflow-hidden group border border-foreground/10 bg-foreground/5 shadow-2xl"
    >
      <div
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        className="absolute inset-0 w-full h-full"
      >
        {videoSrc ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            src={videoSrc}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            poster={imageSrc}
          />
        ) : (
          <img
            src={imageSrc}
            alt="Project Showcase"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        
        {/* Subtle overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}

export default function FeaturedProjects() {
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <section id="projects" className="relative py-24 px-6 max-w-7xl mx-auto w-full">
      <AnimatedContent distance={100} direction="vertical" reverse={false} duration={0.8} ease="power3.out">
        <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Featured Work</h2>
          <p className="text-foreground/60 text-lg">Selected projects that showcase my expertise.</p>
        </div>

        {/* PlayNear Project - visually largest */}
        <div className="flex flex-col xl:flex-row gap-12 items-center">
          
          {/* Media Showcase (Video/Image) */}
          <motion.div style={{ scale }} className="w-full xl:w-3/5 perspective-1000">
            <TiltMedia 
              videoSrc="/playnear/hero.mp4" 
              imageSrc="/playnear/screenshot-1.png" 
            />
          </motion.div>

          {/* Project Details */}
          <div className="w-full xl:w-2/5 flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-2">PlayNear</h3>
                <p className="text-accent font-medium">Sports Academy Discovery Platform</p>
              </div>
              <span className="px-3 py-1 text-xs font-mono rounded-full bg-foreground/10 text-foreground/70 border border-foreground/20 whitespace-nowrap">
                Discontinued
              </span>
            </div>

            <p className="text-foreground/80 leading-relaxed">
              Built during my internship at Codemetron, this was a full-stack geolocation platform 
              connecting users with local sports academies. While no longer live, it onboarded 20+ 
              sports academies into production.
            </p>

            <ul className="space-y-3 text-sm text-foreground/80">
              <li className="flex gap-3">
                <span className="text-accent font-bold">•</span>
                Full-stack geolocation platform with geocoding for Indian addresses.
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">•</span>
                Image storage pipeline via MinIO, LCP performance optimization, and custom data migration tooling.
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">•</span>
                Admin & academy dashboards built with heavily optimized data access patterns.
              </li>
            </ul>

            <div className="flex flex-wrap gap-2 mt-2">
              {["Next.js", "TypeScript", "PostgreSQL", "Prisma", "MinIO", "Docker Compose", "Google Maps API"].map((tech) => (
                <span key={tech} className="px-3 py-1 text-xs rounded-md bg-foreground/5 border border-foreground/10 text-foreground/80 font-medium">
                  {tech}
                </span>
              ))}
            </div>

          </div>
        </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
