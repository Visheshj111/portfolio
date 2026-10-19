# Vishesh Jangid — Portfolio

A personal portfolio built on the `Alter` branch with Next.js, React, TypeScript, Tailwind CSS, GSAP, and Framer Motion.

## Local development

Use Node.js 22 or newer.

```powershell
npm ci
npm run dev
```

For a separate preview port:

```powershell
node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 13311
```

## Content

- `lib/portfolio.ts`: profile links, selected projects, case-study decisions, validation, and scope.
- `public/resume.pdf`: the existing résumé, retained as supplied.
- Personal projects: QueueShield, Claude Usage, ELD Trip Planner, and Olivier.
- Professional experience: Codemetron and Indira Group of Institutes. PlayNear is explicitly presented as an archived internship build.
- Private company source and internal project details are not included.

The original PlayNear walkthrough and screenshots are retained. The Claude Usage dashboard image comes from its [public repository README](https://github.com/Visheshj111/claude-usage). The other project graphics are interface/architecture illustrations, labeled accordingly.

## Interaction and motion

The existing Aurora, BlurText, AnimatedContent, StaggeredMenu, Stepper, and Magnetic components remain part of the active experience. A shared motion provider and reduced-motion fallbacks limit nonessential animation. The mobile menu supports Escape, a keyboard focus loop, and an inert closed panel. Case studies use native modal dialogs.

The hero playground is a browser-local model of Token Bucket and Sliding Window behavior: five requests per ten seconds. It sends no requests to a QueueShield API, stores no history, and makes no throughput claims.

Project cards use an adapted [React Bits Spotlight Card](https://reactbits.dev/components/spotlight-card), preserving semantic articles and the custom layout. Its [MIT + Commons Clause license](public/licenses/react-bits.md) is included. The component uses subtle edge lighting, keyboard focus feedback, and reduced-motion support.

Existing unused visual components are retained for future design iterations.

## Contact

The stepper collects name, email, and message, then presents a review before submission. The same-origin `/api/contact` handler validates and bounds input before contacting the existing FormSubmit destination. It checks both HTTP status and the provider's acceptance flag. A provider error preserves the message and offers retry; opening an email client is never reported as delivery.

FormSubmit must be activated for the recipient address and functioning for production submissions to succeed. No test messages were sent to the real recipient as part of development. The [privacy page](/privacy) describes what is sent to the provider. Email and social links work independently of the form.

## Verification

```powershell
npm test
npm run typecheck
npm run build
```

The behavior tests cover burst admission, refill/expiry boundaries, contact validation, and provider success/failure responses. Provider tests use an injected request function and do not send email. GitHub Actions runs these checks on pushes and pull requests.

`app/opengraph-image.tsx`, `app/icon.svg`, `app/robots.ts`, and `app/sitemap.ts` supply sharing and indexing assets. The canonical URL is the existing Vercel site; update it in `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts` if the production domain changes.

## Deployment

Keep the existing Vercel project, with the repository root as its root directory. `npm run build` produces the Next.js application, including the contact route and generated sharing image. This redesign does not introduce another hosting platform or require a database.
