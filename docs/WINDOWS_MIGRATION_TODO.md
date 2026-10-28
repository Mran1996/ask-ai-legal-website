# Windows migration — remaining fixes

The machine moved from macOS to Windows (PowerShell). Commit `6b518bc` fixed paths and docs.
These items are still outstanding. Work top to bottom; P1 is the one that bites daily.

---

## P1 — `package.json` scripts are broken on Windows

Four scripts use Unix-only commands. `rm`, `lsof`, `xargs` and `kill` do not exist in
cmd.exe or PowerShell, so these fail outright. `dev:all` is worse: it does not error, it
silently does the wrong thing.

| Script | Current | Problem |
|---|---|---|
| `dev:clean` | `rm -rf .next && next dev --turbopack` | `rm` is not a Windows command — fails immediately |
| `dev:prod-local` | `rm -rf .next && npm run build && npm run start` | same |
| `dev:reset` | `lsof -ti :3000,:3001,:3002 \| xargs kill -9; rm -rf .next && next dev` | `lsof`, `xargs`, `kill`, `rm` — none exist |
| `dev:all` | `npm run dev:convex & npm run dev` | `&` backgrounds in bash but is **sequential** in cmd.exe. No error; Convex runs and blocks, `next dev` never starts until you Ctrl-C |

**Fix — cross-platform, no new dependencies** (uses Node's own fs, already installed):

```json
"dev:clean":      "node -e \"require('fs').rmSync('.next',{recursive:true,force:true})\" && next dev --turbopack",
"dev:prod-local": "node -e \"require('fs').rmSync('.next',{recursive:true,force:true})\" && npm run build && npm run start",
"dev:reset":      "npx kill-port 3000 3001 3002 && node -e \"require('fs').rmSync('.next',{recursive:true,force:true})\" && next dev",
"dev:all":        "npx concurrently \"npm:dev:convex\" \"npm:dev\""
```

`kill-port` and `concurrently` are fetched on demand by `npx`. To avoid the per-run fetch,
`npm i -D concurrently kill-port` and drop the `npx` prefix.

Verify after the change: `npm run dev:clean` should delete `.next` and start the dev server;
`npm run dev:all` should start Convex **and** Next together, with interleaved output.

---

## P2 — Confirm the repo path

Commit `6b518bc` assumed the checkout lives at:

```
C:\Users\Gwada\ask-ai-legal-website
```

The username `Gwada` came from the desktop shortcut and is correct. The **folder** is a guess —
the shortcut pointed at a different app, not this repo.

Confirm in the directory where `npm run dev` is run:

```powershell
cd
git remote -v
```

`git remote -v` must show `Mran1996/ask-ai-legal-website`. If the path differs, correct it in
these 9 files (one string, same in each):

`CLAUDE.md` · `.claude/settings.json` · `design-reference/DESIGN_SYSTEM.md` ·
`docs/ASK-AI-LEGAL-MASTER-PLAN.md` · `docs/BUILD_PROGRESS.md` · `docs/CLAUDE_GITHUB_SETUP.md` ·
`docs/CONVEX_SECURITY_SETUP.md` · `docs/OPS_DASHBOARD_LOCAL.md` · `docs/VERCEL_DEPLOY.md`

**In `.claude/settings.json` use forward slashes** (`C:/Users/...`). A backslash is a JSON
escape character — `C:\Users` contains `\U`, which is invalid JSON and silently breaks the
settings file.

---

## P3 — Install the `/watch` plugin

Requested earlier, never completed. A cloud session cannot do it: the permission classifier
blocks edits to `.claude/settings.json` and refuses third-party code into the repo. Locally it
is two commands:

```
/plugin marketplace add bradautomates/claude-video
/plugin install watch@claude-video
```

Windows notes for that plugin:
- It needs **Deno** for YouTube, beyond ffmpeg and yt-dlp: `winget install --id DenoLand.Deno --exact`
- Reopen the terminal afterwards — it will not see PATH changes otherwise
- Its local-transcription path expects **WhisperX** specifically, not `openai-whisper` or
  `faster-whisper` (it passes `--compute_type`, `--batch_size`, `--no_align`, `--vad_method`)
- Its bundled WhisperX installer is, per its own warning, **untested on Windows**. If WhisperX
  is already installed, point at it instead via `C:\Users\Gwada\.config\watch\.env`:
  ```
  WATCH_WHISPERX_BIN=C:\full\path\to\whisperx.exe
  WATCH_WHISPER_BACKEND=whisperx
  ```
  It also requires an empty `.deps-ok` file two directories above that binary, or it refuses
  to start with "WhisperX venv is incomplete".

---

## P4 — "Ask AI Legal" desktop shortcut is fragile

Not in this repo — it lives at `C:\Legal\Legal Assistant\`. The shortcut runs:

```
C:\Users\Gwada\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\pythonw.exe
  "C:\Legal\Legal Assistant\app\open_desktop.py"
```

The interpreter is borrowed from a **cache directory belonging to OpenAI Codex**. Cache
directories get cleaned and runtimes get upgraded or removed; when that happens the shortcut
dies. Because `pythonw.exe` runs without a console, the failure is **completely silent** — no
error, no window, just an icon that does nothing.

Fix: install Python normally (`winget install --id Python.Python.3.12 --exact`), then edit the
shortcut's Target to use that interpreter's `pythonw.exe` instead of the cache path. Keep
`Start in` as `C:\Legal\Legal Assistant`.

Check `open_desktop.py` for third-party imports first — a different interpreter will not have
whatever Codex's runtime had installed. Any missing packages need `pip install` against the new
Python.

---

## P5 — `scripts/*.sh` need Git Bash

The 9 scripts in `scripts/` are bash and do not run in PowerShell. Docs now invoke them as
`bash ./scripts/<name>.sh`, which works because Git Bash ships with Git for Windows.

Two npm scripts call bash directly and depend on it being on PATH:

```
deploy:convex       bash scripts/deploy-convex.sh
deploy:convex:prod  bash scripts/deploy-convex.sh --prod
```

Confirm with `bash --version` in PowerShell. If that fails, either add Git's `usr\bin` to PATH
or port the scripts to `.ps1`. Porting is real work and each one needs testing against live
Convex and Vercel — prefer Git Bash unless there is a reason not to.

---

## P6 — Low priority

`.claude/commands/ui-ux-pro-max.md` line 318 offers a macOS-only `brew install python3` hint.
Third-party vendored file, cosmetic, no impact on the build.
