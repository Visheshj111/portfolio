"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative py-24 px-6 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-8"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">About</h2>
        
        <div className="max-w-3xl text-foreground/80 text-lg md:text-xl leading-relaxed space-y-6 font-medium">
          <p>
            I am a Full-Stack Developer currently pursuing my 3rd year of BCA at 
            <span className="text-foreground font-bold"> Indira College of Commerce and Science</span>, Pune (2024–2027), maintaining a CGPA of 8.96.
          </p>
          <p>
            Presently, I work as a <span className="text-accent font-bold">Full Stack Developer Intern at Codemetron</span>, 
            where I build and optimize production web applications. 
          </p>
          <p>
            Beyond coding, I serve as a Placement Executive at the Indira Group of Institutes, 
            actively coordinating campus recruitment and bridging the gap between talent and opportunity.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
