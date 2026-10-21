"use client";

import { useReducedMotion } from "framer-motion";

const techs = ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Redis", "Python", "Docker", "Electron"];
export default function Marquee() {
  const reduced = useReducedMotion();
  return <div className={`stack-strip ${reduced ? "no-motion" : ""}`} aria-label={`My toolkit: ${techs.join(", ")}`}><div className="stack-track" aria-hidden="true">{[0, 1].map(copy => <div className="stack-copy" key={copy}>{techs.map(tech => <span key={tech}><i>✳</i>{tech}</span>)}</div>)}</div></div>;
}
