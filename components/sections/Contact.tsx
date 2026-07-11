"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import Link from "next/link";

const socialLinks = [
  { name: "Email", href: "mailto:visheshjangid@example.com", icon: Mail },
  { name: "GitHub", href: "https://github.com/Visheshj111", icon: GithubIcon },
  { name: "LinkedIn", href: "https://linkedin.com/in/vishesh-jangid", icon: LinkedinIcon },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center gap-10"
      >
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-[10vw] md:text-8xl leading-none font-bold tracking-tighter uppercase">
            Let's <br className="md:hidden" /> Connect
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl font-medium max-w-md">
            I'm currently looking for new opportunities. My inbox is always open.
          </p>
        </div>

        <div className="flex items-center gap-6 mt-4">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
              >
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex p-4 rounded-full bg-foreground/5 hover:bg-foreground hover:text-background border border-foreground/10 transition-all duration-300 hover:scale-110"
                  aria-label={link.name}
                >
                  <Icon className="w-8 h-8" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
