export const profile = {
  name: "Vishesh Jangid",
  email: "vishesh.domain@gmail.com",
  github: "https://github.com/Visheshj111",
  linkedin: "https://linkedin.com/in/vishesh-jangid",
  location: "Pune, India",
};

export type Project = {
  id: string;
  number: string;
  name: string;
  category: "Systems" | "Extensions" | "Desktop";
  headline: string;
  description: string;
  stack: string[];
  repository: string;
  live?: { label: string; href: string };
  status: string;
  problem: string;
  decisions: { title: string; description: string }[];
  validation: string;
  boundary: string;
};

export const projects: Project[] = [
  {
    id: "queueshield", number: "01", name: "QueueShield", category: "Systems",
    headline: "One limit. Every instance.",
    description: "A distributed rate limiter and job queue. Shared Redis state keeps API instances on the same budget, while PostgreSQL keeps the decision trail.",
    stack: ["TypeScript", "Next.js", "Express", "Redis", "PostgreSQL", "BullMQ"],
    repository: `${profile.github}/api-rate-limiting-system`, status: "Personal project",
    problem: "A limit stored in one API process becomes a different limit when another process handles the next request. QueueShield moves the admission decision into shared state and records what happened afterward.",
    decisions: [
      { title: "Atomic admission", description: "Token Bucket and Sliding Window use Redis Lua scripts and Redis time, avoiding a separate read/check/write race between API processes." },
      { title: "A durable handoff", description: "An admitted probe creates a PostgreSQL job record before enqueueing. Deterministic BullMQ job IDs and reconciliation recover pending delivery when the queue is unavailable." },
      { title: "Account boundaries", description: "Revocable sessions, owner-scoped queries, and authenticated encryption for stored API keys keep the management workflow tied to its account." },
    ],
    validation: "Unit, integration, and browser checks cover admission, account isolation, history, and queue behavior. The original limiter and queue workflow has a verified passing CI run.",
    boundary: "The original worker demonstrates processing with a simulated task. Delivery is at least once; a real business side effect still needs idempotency. Gateway extensions are ongoing work.",
  },
  {
    id: "claude", number: "02", name: "Claude Usage", category: "Extensions",
    headline: "A little less quota guesswork.",
    description: "A published Chrome extension that brings usage signals, reset windows, alerts, and history into the Claude workflow.",
    stack: ["TypeScript", "Manifest V3", "Chrome APIs", "Vitest"],
    repository: `${profile.github}/claude-usage`, status: "Published extension",
    live: { label: "Chrome Web Store", href: "https://chromewebstore.google.com/detail/claude-usage-tracker-stat/lhmabonbcohkgnifkjhknalkekeeigko" },
    problem: "Usage information arrives through different interfaces and can change as a web application evolves. The extension brings those signals into one place without treating an estimate as an authoritative reading.",
    decisions: [
      { title: "Multiple sources, explicit confidence", description: "Network observations, usage responses, and DOM signals are combined through a source-priority model, with estimation as a fallback." },
      { title: "Built for extension constraints", description: "A Manifest V3 service worker coordinates content scripts, local history, notifications, and a separate dashboard. Bundled assets avoid runtime CDN dependencies." },
      { title: "Privacy with a clear boundary", description: "Usage history is stored locally. Optional prompt refinement is an explicit action that calls the Anthropic API; it is separate from tracking." },
    ],
    validation: "The complete check command passes TypeScript, lint with warnings, 218 tests, and the production build. Published on the Chrome Web Store.",
    boundary: "The extension is independent of Anthropic. Detection depends on upstream interfaces, so monitoring changes and maintaining fallbacks remain part of the work.",
  },
  {
    id: "eld", number: "03", name: "ELD Trip Planner", category: "Systems",
    headline: "A route is only half the trip.",
    description: "A trip-planning prototype that combines routing with a Python scheduling engine and readable daily duty logs.",
    stack: ["Django", "Python", "React", "TypeScript", "Leaflet"],
    repository: `${profile.github}/eld-trip-planner`, status: "Planning prototype",
    problem: "A driving route needs more than a distance and arrival time. Driving windows, breaks, rest, and fuel stops all affect how a multi-day plan unfolds.",
    decisions: [
      { title: "The scheduler is its own module", description: "A Python state machine models driving and duty transitions separately from the Django API and React presentation." },
      { title: "Make the plan inspectable", description: "Route maps and SVG daily logs help a person see the schedule rather than interpreting a raw sequence of timestamps." },
      { title: "Test the transitions", description: "Focused tests exercise scheduling boundaries and rest transitions, where a small timing mistake can change the rest of the plan." },
    ],
    validation: "25 passing scheduling-engine tests exercise the planning logic. Map-provider integration and deployed API behavior need separate end-to-end verification.",
    boundary: "This is a scheduling prototype, not a certified ELD or a compliance guarantee. It does not model a complete rolling history of prior duty days.",
  },
  {
    id: "olivier", number: "04", name: "Olivier", category: "Desktop",
    headline: "Keep the follow-up close.",
    description: "An offline-first desktop lead manager with local storage, deadline notifications, a system tray, and release-based updates.",
    stack: ["Electron", "React", "Vite", "Local storage"],
    repository: `${profile.github}/OlivierApp`, status: "Windows release",
    live: { label: "View releases", href: `${profile.github}/OlivierApp/releases` },
    problem: "A small lead-management workflow should remain available without a browser tab or a network connection. Olivier makes that workflow a local desktop tool.",
    decisions: [
      { title: "Local by design", description: "Records live locally, with import and schema-migration handling instead of depending on a remote service for every interaction." },
      { title: "Use the desktop", description: "Native notifications, tray behavior, startup integration, and a single-instance lifecycle connect the interface to the operating system." },
      { title: "Ship beyond the development server", description: "Packaged Windows releases and update handling make distribution part of the application workflow." },
    ],
    validation: "Packaged Windows release assets are available on GitHub, with native desktop integration implemented in the source.",
    boundary: "The Windows installation and update cycle still need end-to-end regression testing. Local persistence and automated coverage are areas for further hardening.",
  },
];
