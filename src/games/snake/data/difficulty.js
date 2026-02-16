export const difficulties = {
  easy: {
    speed: 150,
    gridWidth: 15,
    gridHeight: 20,
    initialLength: 3,
    foodPoints: 10,
    obstacles: [],
  },
  medium: {
    speed: 100,
    gridWidth: 15,
    gridHeight: 20,
    initialLength: 3,
    foodPoints: 15,
    obstacles: [
      { x: 3, y: 5 }, { x: 4, y: 5 },
      { x: 10, y: 5 }, { x: 11, y: 5 },
      { x: 3, y: 14 }, { x: 4, y: 14 },
      { x: 10, y: 14 }, { x: 11, y: 14 },
    ],
  },
  hard: {
    speed: 70,
    gridWidth: 15,
    gridHeight: 20,
    initialLength: 4,
    foodPoints: 20,
    obstacles: [
      { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
      { x: 9, y: 4 }, { x: 10, y: 4 }, { x: 11, y: 4 },
      { x: 7, y: 9 }, { x: 7, y: 10 },
      { x: 3, y: 15 }, { x: 4, y: 15 }, { x: 5, y: 15 },
      { x: 9, y: 15 }, { x: 10, y: 15 }, { x: 11, y: 15 },
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
