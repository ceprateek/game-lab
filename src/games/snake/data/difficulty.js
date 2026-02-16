export const difficulties = {
  easy: {
    speed: 180,
    gridWidth: 16,
    gridHeight: 24,
    initialLength: 3,
    foodPoints: 10,
    obstacles: [],
  },
  medium: {
    speed: 140,
    gridWidth: 16,
    gridHeight: 24,
    initialLength: 3,
    foodPoints: 15,
    obstacles: [
      { x: 3, y: 6 }, { x: 4, y: 6 },
      { x: 11, y: 6 }, { x: 12, y: 6 },
      { x: 3, y: 17 }, { x: 4, y: 17 },
      { x: 11, y: 17 }, { x: 12, y: 17 },
    ],
  },
  hard: {
    speed: 110,
    gridWidth: 16,
    gridHeight: 24,
    initialLength: 4,
    foodPoints: 20,
    obstacles: [
      { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 },
      { x: 8, y: 11 }, { x: 8, y: 12 },
      { x: 3, y: 18 }, { x: 4, y: 18 }, { x: 5, y: 18 },
      { x: 10, y: 18 }, { x: 11, y: 18 }, { x: 12, y: 18 },
    ],
  },
}

// Power-up types
export const POWER_UPS = {
  bonus: { label: 'Bonus', color: '#fbbf24', points: 50 },
  slow: { label: 'Slow', color: '#38bdf8', duration: 5000 },
  shrink: { label: 'Shrink', color: '#a78bfa', segments: 2 },
}

export const POWER_UP_CHANCE = 0.3
export const POWER_UP_LIFETIME = 5000
