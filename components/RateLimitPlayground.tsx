"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, RotateCcw, ShieldCheck, X } from "lucide-react";
import { advanceDemo, capacity, freshDemo, sendDemo, type Algorithm } from "@/lib/rate-demo";

type Entry = { id: number; admitted: number; blocked: number };

export default function RateLimitPlayground() {
  const clock = useRef(0);
  const state = useRef(freshDemo(0));
  const sequence = useRef(0);
  const [algorithm, setAlgorithm] = useState<Algorithm>("token_bucket");
  const [remaining, setRemaining] = useState(5);
  const [fill, setFill] = useState(5);
  const [entries, setEntries] = useState<Entry[]>([]);
  useEffect(() => {
    clock.current = performance.now(); state.current = freshDemo(clock.current);
    const timer = setInterval(() => {
      state.current = advanceDemo(state.current, performance.now());
      const amount = algorithm === "token_bucket" ? state.current.tokens : capacity - state.current.acceptedAt.length;
      setRemaining(Math.floor(amount)); setFill(amount);
    }, 150);
    return () => clearInterval(timer);
  }, [algorithm]);

  function reset(nextAlgorithm = algorithm) {
    state.current = freshDemo(performance.now()); sequence.current = 0;
    setAlgorithm(nextAlgorithm); setEntries([]); setRemaining(5); setFill(5);
  }
  function send(count: number) {
    const result = sendDemo(state.current, algorithm, count, performance.now());
    state.current = result.state;
    const amount = algorithm === "token_bucket" ? result.state.tokens : capacity - result.state.acceptedAt.length;
    setRemaining(Math.floor(amount)); setFill(amount);
    const entry = { id: ++sequence.current, admitted: result.admitted, blocked: result.blocked };
    setEntries(previous => [entry, ...previous].slice(0, 3));
  }
  return <div className="playground">
    <div className="playground-top"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>queueshield / a little playground</span><ShieldCheck size={15} /></div>
    <div className="playground-body">
      <div className="playground-title"><div><span className="eyebrow">Try the idea</span><h2>Traffic, meet boundaries.</h2></div><a href="https://github.com/Visheshj111/api-rate-limiting-system" target="_blank" rel="noreferrer" aria-label="QueueShield source code"><ArrowUpRight size={20} /></a></div>
      <div className="demo-switch" role="group" aria-label="Rate limiter algorithm"><button aria-pressed={algorithm === "token_bucket"} onClick={() => reset("token_bucket")}>Token bucket</button><button aria-pressed={algorithm === "sliding_window"} onClick={() => reset("sliding_window")}>Sliding window</button></div>
      <div className="demo-reservoir">
        <div className="demo-budget"><span className="eyebrow">Available capacity</span><span><strong>{remaining}</strong> / {capacity}</span></div>
        <div className="demo-slots" aria-label={`${remaining} of 5 requests available`}>{Array.from({ length: capacity }, (_, index) => <div key={index}><i style={{ height: `${Math.max(0, Math.min(1, fill - index)) * 100}%` }} /></div>)}</div>
        <div className="demo-caption"><span>5 requests / 10 seconds</span><button onClick={() => reset()} aria-label="Reset rate limiter demo"><RotateCcw size={12} /> Reset</button></div>
      </div>
      <div className="demo-actions"><button className="button button-accent" onClick={() => send(1)}>Send a request <ArrowUpRight size={15} /></button><button className="button button-outline" onClick={() => send(8)}>Burst × 8</button></div>
      <div className="demo-log" aria-live="polite" aria-atomic="true">{entries.length ? entries.map(entry => <div key={entry.id}><span className="demo-request">req_{String(entry.id).padStart(3, "0")}</span><span className="demo-admitted"><Check size={12} /> {entry.admitted} admitted</span>{entry.blocked > 0 && <span className="demo-blocked"><X size={12} /> {entry.blocked} blocked</span>}</div>) : <div className="demo-hint"><ArrowDown size={13} /> Send a burst. See what gets through.</div>}</div>
      <p className="demo-note">Interactive model, running in your browser.<br />{algorithm === "token_bucket" ? "Capacity refills steadily. Try again in a moment." : "Accepted requests expire after ten seconds."}</p>
    </div>
  </div>;
}
