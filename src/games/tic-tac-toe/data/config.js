export const WIN_PATTERNS = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // columns
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
]

export const DIFFICULTIES = {
  easy: { label: 'Easy', desc: 'Random AI', optimalChance: 0 },
  medium: { label: 'Medium', desc: 'Smarter AI', optimalChance: 0.7 },
  hard: { label: 'Hard', desc: 'Unbeatable AI', optimalChance: 1 },
}

export const SCORES = {
  win: 100,
  draw: 50,
  loss: 0,
}
