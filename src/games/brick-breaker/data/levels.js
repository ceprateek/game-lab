// Brick encoding: 0=empty, 1=normal (1 hit), 2=double (2 hits), 3=triple (3 hits)
export const BRICK_COLORS = {
  1: { fill: '#3b82f6', stroke: '#60a5fa', highlight: '#93c5fd' }, // blue
  2: { fill: '#f59e0b', stroke: '#fbbf24', highlight: '#fcd34d' }, // amber
  3: { fill: '#ef4444', stroke: '#f87171', highlight: '#fca5a5' }, // red
}

export const POINTS_PER_HIT = 10

export const difficulties = {
  easy: {
    ballSpeed: 4,
    speedIncrement: 0.3,
    lives: 3,
    paddleWidth: 80,
    layout: [
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
    ],
  },
  medium: {
    ballSpeed: 5,
    speedIncrement: 0.35,
    lives: 3,
    paddleWidth: 70,
    layout: [
      [0, 2, 1, 1, 1, 1, 2, 0],
      [1, 1, 2, 1, 1, 2, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 1, 1, 2, 2, 1, 1, 2],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
    ],
  },
  hard: {
    ballSpeed: 6,
    speedIncrement: 0.4,
    lives: 3,
    paddleWidth: 60,
    layout: [
      [3, 2, 1, 1, 1, 1, 2, 3],
      [2, 2, 2, 1, 1, 2, 2, 2],
      [1, 2, 3, 2, 2, 3, 2, 1],
      [1, 1, 2, 1, 1, 2, 1, 1],
      [2, 1, 1, 1, 1, 1, 1, 2],
      [1, 1, 1, 2, 2, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
    ],
  },
}
