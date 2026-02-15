# Game Lab

## What is this project?
A unified multi-game React app with educational games for kids. The app launches into a game selector screen, with each game managing its own internal screens.

## Games

### Treasure Quest: The Decomposer (`src/games/treasure-quest/`)
An educational puzzle game for kids (8-10) that teaches **strategy decomposition** — breaking complex problems into smaller, ordered steps — through a treasure hunt.

- **Core loop:** Plan → Execute → Reflect
- **Tech:** React 19, Tailwind CSS v4, @dnd-kit, Framer Motion, Zustand, Vite (PWA)

### Memory Match (`src/games/memory-game/`)
A card-matching memory game with multiple difficulty levels and themed card sets (animals, food, space).

- **Core loop:** Select difficulty → Flip cards → Match pairs → Results
- **Difficulties:** Easy (6 pairs), Medium (8 pairs), Hard (10 pairs)

## Project Structure
```
game-lab/
├── src/
│   ├── main.jsx                  # Entry point
│   ├── App.jsx                   # Top-level router (game selector + per-game)
│   ├── index.css                 # Global styles
│   ├── components/ui/            # Shared UI (Button, StarRating)
│   ├── store/appStore.js         # Top-level store (game selection)
│   └── games/
│       ├── GameSelector.jsx      # Game launcher screen
│       ├── treasure-quest/       # Treasure Quest game
│       └── memory-game/          # Memory Match game
├── public/                       # Static assets, PWA icons
├── index.html
├── package.json
├── vite.config.js
└── CLAUDE.md
```

## Commands
Run from `game-lab/` root:
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
