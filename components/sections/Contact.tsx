"use client";

import { motion } from "framer-motion";
import { Mail, CheckCircle2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import AnimatedContent from "@/components/AnimatedContent";
import Link from "next/link";
import Stepper, { Step } from "@/components/Stepper";
import { useState } from "react";

const socialLinks = [
  { name: "Email", href: "mailto:vishesh.domain@gmail.com", icon: Mail },
  { name: "GitHub", href: "https://github.com/Visheshj111", icon: GithubIcon },
  { name: "LinkedIn", href: "https://linkedin.com/in/vishesh-jangid", icon: LinkedinIcon },
];

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleComplete = async () => {
    setIsSending(true);
    try {
      await fetch("https://formsubmit.co/ajax/vishesh.domain@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name || "Anonymous",
          email: email || "No Email provided",
          message: message || "No Message provided"
        })
      });
      setIsSent(true);
    } catch (error) {
      console.error(error);
      // Fallback
      window.location.href = `mailto:vishesh.domain@gmail.com?subject=Portfolio Contact from ${name}&body=${message}%0A%0AFrom: ${email}`;
      setIsSent(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-6 max-w-4xl mx-auto w-full text-center">
      <AnimatedContent distance={100} direction="vertical" reverse={false} duration={0.8} ease="power3.out">
        <div className="flex flex-col items-center gap-8 mb-16">
          <h2 className="text-[10vw] md:text-8xl leading-none font-bold tracking-tighter uppercase">
            Let's <br className="md:hidden" /> Connect
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl font-medium max-w-md">
            I'm currently looking for new opportunities. Send me a message directly or connect via socials.
          </p>
        </div>

        {isSent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-foreground/5 rounded-[2rem] border border-foreground/10 mx-auto max-w-xl"
          >
            <CheckCircle2 className="w-16 h-16 text-accent mb-6" />
            <h3 className="text-3xl font-bold mb-2">Message Sent!</h3>
            <p className="text-foreground/60">Thanks for reaching out, {name}. I'll get back to you soon.</p>
          </motion.div>
        ) : (
          <div className="w-full max-w-xl mx-auto text-left">
            <Stepper
              initialStep={1}
              onFinalStepCompleted={handleComplete}
              backButtonText="Back"
              nextButtonText="Next"
              completeButtonText={isSending ? "Sending..." : "Send"}
              stepCircleContainerClassName="bg-background border-foreground/10"
            >
              {/* Step 1 */}
              <Step>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Your Email</h3>
                    <p className="text-foreground/60 text-sm mt-1">So I can get back to you.</p>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full p-4 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-foreground"
                  />
                </div>
              </Step>

              {/* Step 2 */}
              <Step>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Your Message</h3>
                    <p className="text-foreground/60 text-sm mt-1">What's on your mind?</p>
                  </div>
                  {/* The Cat Image Banner */}
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
                    alt="Cute Cat Banner"
                    className="w-full h-28 md:h-36 rounded-xl object-cover border border-foreground/10 shadow-sm my-1"
                  />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi Vishesh, I'd like to talk about..."
                    rows={4}
                    className="w-full p-4 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-foreground resize-none"
                  />
                </div>
              </Step>

              {/* Step 3 */}
              <Step>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Your Name</h3>
                    <p className="text-foreground/60 text-sm mt-1">Who am I speaking with?</p>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ben Tennyson"
                    className="w-full p-4 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-foreground"
                  />
                </div>
              </Step>

              {/* Step 4 */}
              <Step>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold tracking-tight">Overview</h3>
                  <div className="p-5 bg-foreground/5 rounded-xl border border-foreground/10 space-y-4">
                    <div>
                      <span className="text-foreground/50 uppercase tracking-wider text-[10px] font-bold">Name</span>
                      <p className="font-medium text-lg leading-tight mt-1">{name || "—"}</p>
                    </div>
                    <div className="h-[1px] w-full bg-foreground/10" />
                    <div>
                      <span className="text-foreground/50 uppercase tracking-wider text-[10px] font-bold">Email</span>
                      <p className="font-medium text-lg leading-tight mt-1">{email || "—"}</p>
                    </div>
                    <div className="h-[1px] w-full bg-foreground/10" />
                    <div>
                      <span className="text-foreground/50 uppercase tracking-wider text-[10px] font-bold">Message</span>
                      <p className="font-medium text-base leading-relaxed mt-1 whitespace-pre-wrap">{message || "—"}</p>
                    </div>
                  </div>
                </div>
              </Step>
            </Stepper>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 mt-16">
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
      </AnimatedContent>
    </section>
  );
}
