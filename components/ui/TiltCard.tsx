"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const [hovering, setHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
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
    },
    [x, y]
  );

  const handleMouseEnter = () => setHovering(true);
  
  const handleMouseLeave = () => {
    setHovering(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("relative group w-full h-full perspective-1000", className)}
    >
      <div 
        style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        {children}
        
        {/* Shine effect */}
        <div 
          className={cn(
            "absolute inset-0 pointer-events-none rounded-[inherit] mix-blend-overlay transition-opacity duration-500",
            hovering ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)`,
          }}
        />
      </div>
    </motion.div>
  );
}
