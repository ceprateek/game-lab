# Game Lab

## What is this project?
A collection of browser-based educational games for kids. Each game lives in its own subdirectory as a standalone app.

## Games

### Treasure Quest: The Decomposer (`treasure-quest/`)
An educational puzzle game for kids (8-10) that teaches **strategy decomposition** — breaking complex problems into smaller, ordered steps — through a treasure hunt.

- **Design doc:** `treasure-quest/docs/GAME_DESIGN.md`
- **Core loop:** Plan → Execute → Reflect
- **Tech:** React 19, Tailwind CSS v4, @dnd-kit, Framer Motion, Zustand, Vite (PWA)

## Project Structure
```
game-lab/
├── treasure-quest/         # Strategy decomposition game
│   ├── docs/               # Design docs
│   ├── public/             # Static assets, PWA icons
│   ├── src/                # React source code
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── CLAUDE.md               # This file
└── README.md
```

## Commands (per game)
Run from within the game directory (e.g. `cd treasure-quest`):
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
