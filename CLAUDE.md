# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project
Showcase page for **Last Signal**, an iPhone driving game (Unity, in development). Static site, no build step, no dependencies.
Auto-deploys to GitHub Pages on push to `main` (`.github/workflows/deploy.yml`, copied from the portfolio repo).
Showcase only: no store badges, no Apple marks, no release date, no download link. Status wording is "In development".
Local preview: `python3 -m http.server 8000`.

## Files
- `index.html`: all content (single page). `style.css`: all styles. `main.js`: progressive enhancement only (the page must read fine without it).
- `fonts/`: Russo One (display, has Cyrillic), IBM Plex Mono (labels, radio text, has Cyrillic), Special Elite (typed stamps and dates, **Latin only, never use for Russian**). Licence files sit next to them.
- `media/`: images and video. See below.

## Media (delivered by the trailer session)
The trailer session writes everything to `~/Projects/last-signal-media/deliverables/` with a `manifest.json`
(`file, role, width, height, duration, bytes, alt, caption`). Copy files into `media/` using the same names, then update the `alt` text and captions in `index.html` from the manifest.
Roles and names used by the page:
- `last-signal-trailer-1080.mp4`, `last-signal-trailer-720.mp4`, `trailer.vtt` (captions, RU and EN radio lines), `poster.jpg`
- `loop-hero.mp4`, `loop-chase.mp4`, `loop-signal.mp4`, `loop-cold.mp4`, `loop-zone.mp4`, `loop-night.mp4` (muted loops)
- `still-1..8` (`.jpg` and `.webp`), `phone-1.mp4` plus `phone-1.jpg` (portrait iPhone clip), `og-image.jpg` (1200x630)
Budgets: trailer 1080p at most 45 MB, loops 3 to 6 MB, stills about 400 KB, nothing above 50 MB, whole set under 250 MB (GitHub: 100 MB per file, Pages about 1 GB).
**The current images are placeholders** (real in-engine captures from the Editor, not the trailer stills). The loops and trailer do not exist yet:
`main.js` attaches a loop only if its file exists, so the page works with stills until they land. The trailer `<video>` has a poster and shows its poster until the file exists.

## Design system
- Cold, dark, one amber accent. Tokens in `:root` (`--bg --bg-deep --ink --body --dim --line --amber --cold`); components only use tokens.
- Display: Russo One, uppercase. Labels and radio lines: Plex Mono. Body: system sans. Dates, stamps and chapter numerals: Special Elite.
- Static film grain over the page (`body::after`), vignette and gradients on the hero. No bright backgrounds, nothing cleaner than the game.
- Sections alternate `.band` and `.band--deep`. Radio lines are Russian (`lang="ru"`) with the English underneath, like the in-game subtitles.

## Rules
- Progressive enhancement: no JS means a readable page with posters. `.js` on `<html>` gates reveal animations only.
- `prefers-reduced-motion`, data saver and slow connections: decorative loops are never attached or shown (CSS hides `video[aria-hidden]` under reduced motion).
- Decorative loops are `aria-hidden`, muted, `playsinline`, `preload="none"`, and play only while on screen.
- The trailer has native controls, a poster and a WebVTT captions track. Never autoplay sound.
- Images: `width`/`height` always set, `loading="lazy"` below the fold, WebP with a JPG fallback.
- No analytics, cookies or third-party embeds. Everything is self-hosted.
- Respectful tone about the real disaster: no gore, no casualty gamification, no claims about real events. The page says "inspired by".
- Credits mirror `MenuKit.CreditsText` in the game and `Docs/AudioSources.md`; update them when the game's credits change.

## Before publishing
Replace the placeholder images and add the real trailer; run Lighthouse (aim 90 or more everywhere); test in Safari on an iPhone (inline autoplay, Low Power Mode); check the Open Graph preview; then add a card to `#projects` in `glennsvendsen.github.io` (see its `CLAUDE.md`, "Adding a side project").
