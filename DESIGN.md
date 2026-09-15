# Design System — Ask AI Legal (cinematic redesign, 2026-09-14)

## Product Context
- **What this is:** Marketing site for a one-time install of a configured legal workspace. "We do the install. You work from home."
- **Who it's for:** Self-represented people, any U.S. state. Enemy: the retainer trap.
- **Not:** a law firm. No legal advice. Nothing filed on the client's behalf.
- **Project type:** marketing site (Next.js App Router, Tailwind).

## Aesthetic Direction
- **Direction:** Dark cinematic, product-as-hero. Reference: "$10K website" look — one massive rendered object behind giant type, floating parts, glow rims, scroll storytelling.
- **Decoration level:** expressive, but ONE hero object per page. No blobs, no purple gradients, no icon grids in colored circles.
- **Mood:** the install is a product you can see. Serious, futuristic, calm. Never attorney-site.
- **Memorable thing:** "I can actually do this myself, from home." The hero is a home desk at night, not a courtroom.
- **Hero object:** glowing laptop on a kitchen table, papers and folders floating up out of the light.
- **Characters:** none. Objects only.

## Typography
- **Display/Hero:** Clash Grotesk (Fontshare) — heavy, wide, cinematic. Fallback: General Sans.
- **Accent word:** Instrument Serif italic — one word per headline ("from *home*").
- **Body/UI:** General Sans (Fontshare). Fallback: system sans.
- **Labels/data/prices:** JetBrains Mono, uppercase, tracking 0.12em, tabular-nums.
- **Loading:** Fontshare CSS `<link>` for Clash Grotesk + General Sans; Google Fonts for Instrument Serif + JetBrains Mono. Self-host later if needed.
- **Scale:** hero 96–160px (clamp 12vw), h2 56–72, h3 32, body 18, small 15, label 12.

## Color
- **Approach:** restrained on a dark ground. Light is the accent.
- **Ground:** `#070f18` (navy-black), surfaces `#0c1929`, raised `#152238`.
- **Type:** `#FAF9F6` primary, `#9AA5B4` muted.
- **Accent (gold glow):** `#FBB034`, light `#FFD27A`, dark `#E09416`, glow `rgba(251,176,52,.55)`.
- **Negative (retainer trap only):** brick `#B5533C`.
- **Success only:** `#00A95C`.
- **Rules:** gold on at most one element per viewport. Never gold text on cream. Never white backgrounds on marketing pages; legal pages (terms/privacy) may use `#0c1929` surface with wider measure.

## Imagery
- AI renders (owner generates in ChatGPT from `askailegal-brain/marketing/2026-09-14_website-image-prompts.md`), stored in `public/renders/`.
- All renders: near-black navy ground, single warm gold rim light, volumetric haze, no text, no people, no logos.
- Floating parts are separate PNGs on black so they can be layered and parallaxed.

## Spacing
- **Base unit:** 8px. **Density:** spacious. Section padding 128/64 (desktop/mobile). Container max 1280px, hero can bleed full width.

## Layout
- **Approach:** creative-editorial. Hero: headline overlaps the render (type behind/through object like "HOW?"). Sections alternate: pinned scroll scene → text block → pinned scene.
- **Border radius:** 4 / 8 / 16 / full. Cards: 16, 1px border `rgba(250,249,246,.08)`.
- **Legal pages:** single column, 68ch measure, no hero object.

## Motion
- **Approach:** expressive, scroll-driven, with `prefers-reduced-motion` fallback (static renders, no pinning).
- **Stack:** GSAP + ScrollTrigger for pinned scenes and text reveals; Three.js (react-three-fiber) for hero parallax/particles; Lenis for smooth scroll.
- **Easing:** enter `power3.out`, exit `power2.in`, scrub scenes linear.
- **Duration:** micro 100ms, short 250ms, medium 400ms, reveal 700ms.
- **Homepage story:** hero parts float and parallax on mouse → on scroll the parts break apart and each section catches one (folder → "Analysis", sheet → "Road map", stamp → "Source verification", laptop → "You work from home").

## Copy rules (UPL)
- Never: legal advice, your attorney, we represent, we'll file, guaranteed, win.
- Say "from home" at most once per section.
- Testimonials labeled "Illustrative example."

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-14 | Dark cinematic, product-as-hero, objects only, gold `#FBB034` glow | Owner rejected warm/paper direction; wants the "$10K website" look; hero = glowing home desk |
