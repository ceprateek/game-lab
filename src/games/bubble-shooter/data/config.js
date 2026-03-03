export const BUBBLE_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316']

export const difficulties = {
  easy: {
    label: 'Easy',
    desc: '4 colors, 10 columns',
    colorCount: 4,
    columns: 10,
    startRows: 4,
    newRowEvery: 6,
    maxRows: 14,
  },
  medium: {
    label: 'Medium',
    desc: '5 colors, 8 columns',
    colorCount: 5,
    columns: 8,
    startRows: 5,
    newRowEvery: 5,
    maxRows: 12,
  },
  hard: {
    label: 'Hard',
    desc: '6 colors, 8 columns',
    colorCount: 6,
    columns: 8,
    startRows: 5,
    newRowEvery: 4,
    maxRows: 12,
  },
}

export function calculateStars(score) {
  if (score >= 500) return 3
  if (score >= 300) return 2
  return 1
}

export function getRandomColor(colorCount) {
  return BUBBLE_COLORS[Math.floor(Math.random() * colorCount)]
}

// Create initial board
export function createBoard(rows, columns, colorCount) {
  const board = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < columns; c++) {
      row.push(getRandomColor(colorCount))
    }
    board.push(row)
  }
  return board
}

// Generate a new row
export function createRow(columns, colorCount) {
  const row = []
  for (let c = 0; c < columns; c++) {
    row.push(getRandomColor(colorCount))
  }
  return row
}

// Flood fill to find connected same-color bubbles
export function findConnected(board, row, col) {
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return []
  if (!board[row][col]) return []

  const color = board[row][col]
  const visited = new Set()
  const connected = []
  const queue = [[row, col]]

  while (queue.length > 0) {
    const [r, c] = queue.shift()
    const key = `${r},${c}`
    if (visited.has(key)) continue
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) continue
    if (board[r][c] !== color) continue

    visited.add(key)
    connected.push([r, c])

    queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
  }

  return connected
}

// Find bubbles no longer connected to the top row
export function findFloating(board) {
  const rows = board.length
  const cols = board[0].length
  const connected = new Set()
  const queue = []

  // Start from all bubbles in the top row
  for (let c = 0; c < cols; c++) {
    if (board[0][c]) {
      queue.push([0, c])
      connected.add(`0,${c}`)
    }
  }

  while (queue.length > 0) {
    const [r, c] = queue.shift()
    const neighbors = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ]
    for (const [nr, nc] of neighbors) {
      const key = `${nr},${nc}`
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !connected.has(key) && board[nr][nc]) {
        connected.add(key)
        queue.push([nr, nc])
      }
    }
  }

  // Any bubble not connected is floating
  const floating = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] && !connected.has(`${r},${c}`)) {
        floating.push([r, c])
      }
    }
  }
  return floating
}
