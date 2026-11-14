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
- `trailer-1080p.mp4`, `trailer-720p.mp4`, `trailer-poster.jpg`, `trailer.en.vtt`, `trailer.ru.vtt`
- `loop-hero.mp4` (poster `hero.jpg/.webp`), `loop-chase|pursuit|cold|zone|plant.mp4` with matching `.jpg/.webp` posters (muted loops, 1280x720)
- `still-01..10` (`.jpg` and `.webp`, 2560x1440; the gallery shows 8 of them), `og-image.jpg` (1200x630)
- `phone-1.jpg/.webp`: **still a placeholder.** `phone-1.mp4` (Glenn's portrait iPhone recording, 1080x2340, at most 8 MB) has not been delivered; `main.js` attaches it automatically when the file exists.
Budgets: trailer 1080p at most 45 MB, loops 3 to 6 MB, nothing above 50 MB, whole set under 250 MB (GitHub: 100 MB per file, Pages about 1 GB).
`main.js` attaches a loop only if its file exists; the trailer `<video>` shows its poster until played.

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
