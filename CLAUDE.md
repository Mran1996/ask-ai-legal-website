# Ask AI Legal Web — Claude Code Project Guide

## Design reference (source of truth for brand)

Read the existing Ask AI Legal app for colors, copy tone, and layout patterns:

```
/Users/sylasp/ask-ai-legal-main/ask-ai-legal
```

Key files:
- `tailwind.config.ts` — brand colors (primary `#00A95C`, sky `#0EA5E9`)
- `app/globals.css` — CSS variables and spacing
- `components/hero-section.tsx`, `components/navigation.tsx` — UI patterns
- `app/page.tsx` — homepage structure

Also see `design-reference/DESIGN_SYSTEM.md` in this repo.

GitHub: https://github.com/Mran1996/cleanmain

## Required skills (use before building UI)

When designing or implementing pages, **invoke these slash commands first**:

1. **`/frontend-design`** — [Anthropic frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
   - Distinctive, intentional visual design; avoid generic AI templates.

2. **`/ui-ux-pro-max`** — [UI/UX Pro Max skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
   - Color systems, typography, accessibility, responsive layout, UX guidelines.

## Brand constraints (non-negotiable)

| Token | Value | Usage |
|-------|-------|--------|
| Primary | `#00A95C` | CTAs, hero, links, brand accent |
| Primary hover | `#059669` | Button hover |
| Secondary | `#0EA5E9` | Support accents, badges |
| Background | `#F9FAFB` | Page background |
| Text | `#374151` / `#111827` | Body / headings |
| Radius | `0.5rem` | Buttons, cards |

Tagline: *We don't bill by the hour. We help you take back control of your legal case — fast.*

Product: AI-powered legal documents, outcome strategy, court-ready filings for self-represented litigants.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- Run dev: `npm run dev`
- Build: `npm run build`

## Working in this repo

- New marketing site lives in `app/` and `components/`.
- Match Ask AI Legal emerald/sky palette; do not swap to unrelated color schemes.
- Mobile-first, accessible focus states, `prefers-reduced-motion` respected.

## gstack

This project has [gstack](https://github.com/garrytan/gstack) installed. Use the `/browse` skill from gstack for all web browsing — never use `mcp__claude-in-chrome__*` tools.

Available skills: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/retro`, `/investigate`, `/document-release`, `/document-generate`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`.
