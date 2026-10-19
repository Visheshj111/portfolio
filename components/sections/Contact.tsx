"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, Copy, LoaderCircle } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import Stepper, { Step } from "@/components/Stepper";
import { profile } from "@/lib/portfolio";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [step, setStep] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const detailsValid = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const messageValid = message.trim().length >= 10;
  async function submit() {
    if (!detailsValid || !messageValid || status === "sending") return;
    setError(""); setStatus("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, message, website }), signal: AbortSignal.timeout(20000) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "The message service could not accept your message.");
      setStatus("sent");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Couldn’t send your message. You can email me directly instead.");
      setStep(3); setAttempt(value => value + 1); setStatus("idle");
    }
  }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setError("Clipboard access is unavailable. You can select the email address or open the email link."); }
  }
  function startAgain() { setStatus("idle"); setName(""); setEmail(""); setMessage(""); setStep(1); setError(""); setAttempt(value => value + 1); }
  return <section id="contact" className="section page-width contact-section"><AnimatedContent distance={35} duration={.65} animateOpacity={false}><div className="contact-grid"><div><span className="eyebrow">04 / The next conversation</span><h2 className="contact-title">Have something<br />in mind<span>?</span></h2><p className="contact-intro">A role, a project, or a good engineering problem. I’m open to conversations about what we could build together.</p><div className="email-row"><a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={copyEmail} aria-label={copied ? "Email copied" : "Copy email address"}>{copied ? <Check size={15} /> : <Copy size={15} />}</button></div><div className="contact-socials"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a><a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={13} /></a></div><p className="contact-location">PUNE, INDIA / OPEN TO OPPORTUNITIES</p></div><div>
    {error && <p role="alert" className="contact-error">{error}</p>}
    {status === "sending" ? <div className="contact-state" role="status"><LoaderCircle size={27} className="animate-spin" /><h3>Sending your message.</h3><p>Waiting for the message service to accept it.</p></div> : status === "sent" ? <div className="contact-state" role="status"><CheckCircle2 size={29} /><h3>Thanks for saying hello.</h3><p>The message service accepted your note, {name.trim()}. I look forward to reading it.</p><button className="text-link" onClick={startAgain}>Start another conversation <ArrowRight size={15} /></button></div> : <div role="form" aria-label="Contact Vishesh"><Stepper key={attempt} initialStep={step} onStepChange={setStep} onFinalStepCompleted={submit} className="contact-stepper" nextButtonText="Continue" completeButtonText="Send message" backButtonText="Back" nextButtonProps={{ type: "button", className: "button button-accent", disabled: step === 1 ? !detailsValid : !messageValid }} backButtonProps={{ type: "button", className: "text-link" }} renderStepIndicator={({ step: number, currentStep }) => <span className="contact-step" data-active={number <= currentStep} aria-label={`Step ${number}${number === currentStep ? ", current step" : ""}`} aria-current={number === currentStep ? "step" : undefined}>{number < currentStep ? <Check size={13} /> : number}</span>}>
      <Step><h3>First, a little introduction.</h3><label htmlFor="contact-name">Your name<input id="contact-name" className="contact-input" autoComplete="name" value={name} onChange={event => setName(event.target.value)} maxLength={80} placeholder="What should I call you?" required /></label><label htmlFor="contact-email">Your email<input id="contact-email" className="contact-input" autoComplete="email" type="email" value={email} onChange={event => setEmail(event.target.value)} maxLength={254} placeholder="you@company.com" required /></label><p className="contact-help">A name and a valid email are needed to continue.</p></Step>
      <Step><h3>What are you thinking?</h3><label htmlFor="contact-message">Your message<textarea id="contact-message" className="contact-input" value={message} onChange={event => setMessage(event.target.value)} maxLength={3000} rows={5} placeholder="A little context about the role, project, or idea…" required /></label><p className="contact-help">At least 10 characters. A little context goes a long way.</p></Step>
      <Step><h3>Looks good to you?</h3><dl className="contact-review"><div><dt>From</dt><dd>{name}<br />{email}</dd></div><div><dt>Your note</dt><dd>{message}</dd></div></dl><p className="contact-help">Your name, email, and message will be sent through FormSubmit.</p></Step>
    </Stepper><label className="honeypot" aria-hidden="true">Website<input value={website} onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></label></div>}
    <p className="contact-privacy">Prefer your own inbox? The email link works too. <a href="/privacy">Contact & privacy details</a>.</p></div></div></AnimatedContent></section>;
}
