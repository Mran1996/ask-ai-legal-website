# Open Generative AI — local video studio

Self-hosted AI image & video studio for Ask AI Legal social content.

## Location

`~/open-generative-ai` (cloned from [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI))

## Start

```bash
cd ~/open-generative-ai
npm run dev:ask-ai
```

Uses **production mode** when `.next` exists (fast). First-time setup: run `npm run build` once (~10 min), then start.

**URL:** http://localhost:3002/studio/video

If the page hangs, wait for the terminal to show `Ready` or `next start` — dev mode’s first compile can take **3–5 minutes**.

Other tabs: `/studio/image`, `/studio/lipsync`, `/studio/cinema`, etc.

## API key (required for cloud models)

Open Generative AI uses **Muapi.ai** (not NVIDIA/OpenRouter from the main site chat).

1. Get a free key: https://muapi.ai/access-keys  
2. Add to **either** file:
   - `~/ask ai legal web/.env.local` → `MUAPI_API_KEY=your_key_here`
   - `~/open-generative-ai/.env.local` → `MUAPI_API_KEY=your_key_here`

Restart the dev server after adding the key. It auto-loads on first visit.

## Ports

| App | Port |
|-----|------|
| Ask AI Legal website | 3000 |
| Open Generative AI studio | 3002 |

## Ask AI Legal use cases

- **Video Studio** — Reels, explainers, retainer-trap hooks (Seedance, Kling, Veo, etc.)
- **Lip Sync** — talking-head host + voiceover
- **Image Studio** — thumbnails, character refs, carousel assets
- **Cinema Studio** — cinematic B-roll look

## Troubleshooting

Submodule clone failed upstream? Re-run:

```bash
cd ~/open-generative-ai
rm -rf packages/Vibe-Workflow packages/Open-Poe-AI packages/Open-AI-Design-Agent
git clone --depth 1 https://github.com/SamurAIGPT/Vibe-Workflow.git packages/Vibe-Workflow
git clone --depth 1 https://github.com/Anil-matcha/Open-Poe-AI.git packages/Open-Poe-AI
git clone --depth 1 https://github.com/Anil-matcha/Open-AI-Design-Agent.git packages/Open-AI-Design-Agent
npm install && npm run build:packages
```
