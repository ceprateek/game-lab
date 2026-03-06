// Cell types
export const CELL_TYPES = {
  EMPTY: 0,
  HARD_WALL: 1,
  SOFT_WALL: 2,
}

// Power-up types
export const POWER_UP_TYPES = {
  EXTRA_BOMB: 'extra_bomb',
  FIRE_RANGE: 'fire_range',
  SPEED_BOOST: 'speed_boost',
}

// Timing
export const BOMB_TIMER = 2000
export const EXPLOSION_DURATION = 500

// Scoring
export const POINTS = {
  enemy: 100,
  wall: 10,
  powerup: 50,
  time_bonus: 5, // per second remaining (based on par time)
}

// Par time for time bonus (seconds)
const PAR_TIME = 120

export const difficulties = {
  easy: {
    gridWidth: 13,
    gridHeight: 11,
    enemyCount: 3,
    enemySpeed: 600,
    startBombs: 2,
    fireRange: 2,
    softWallDensity: 0.4,
    playerSpeed: 200,
    starThresholds: [200, 400, 600],
  },
  medium: {
    gridWidth: 15,
    gridHeight: 13,
    enemyCount: 5,
    enemySpeed: 450,
    startBombs: 1,
    fireRange: 1,
    softWallDensity: 0.5,
    playerSpeed: 200,
    starThresholds: [300, 600, 900],
  },
  hard: {
    gridWidth: 17,
    gridHeight: 13,
    enemyCount: 7,
    enemySpeed: 300,
    startBombs: 1,
    fireRange: 1,
    softWallDensity: 0.6,
    playerSpeed: 200,
    starThresholds: [500, 800, 1200],
  },
}

function manhattan(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

export function generateMap(difficultyKey) {
  const config = difficulties[difficultyKey]
  const { gridWidth: W, gridHeight: H } = config

  // Initialize grid
  const grid = []
  for (let y = 0; y < H; y++) {
    grid[y] = []
    for (let x = 0; x < W; x++) {
      // Borders are hard walls
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) {
        grid[y][x] = CELL_TYPES.HARD_WALL
      }
      // Interior even,even cells are hard walls (classic pattern)
      else if (x % 2 === 0 && y % 2 === 0) {
        grid[y][x] = CELL_TYPES.HARD_WALL
      } else {
        grid[y][x] = CELL_TYPES.EMPTY
      }
    }
  }

  // Player start zone clear: (1,1), (2,1), (1,2)
  const playerStart = { x: 1, y: 1 }
  const clearZone = new Set(['1,1', '2,1', '1,2'])

  // Place soft walls at random density
  const softWallCells = []
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      if (grid[y][x] !== CELL_TYPES.EMPTY) continue
      if (clearZone.has(`${x},${y}`)) continue
      if (Math.random() < config.softWallDensity) {
        grid[y][x] = CELL_TYPES.SOFT_WALL
        softWallCells.push({ x, y })
      }
    }
  }

  // Place exit door under a soft wall far from player
  let exitDoor = null
  const sortedByDist = [...softWallCells].sort(
    (a, b) => manhattan(b.x, b.y, 1, 1) - manhattan(a.x, a.y, 1, 1)
  )
  for (const cell of sortedByDist) {
    if (manhattan(cell.x, cell.y, 1, 1) >= 6) {
      exitDoor = { x: cell.x, y: cell.y }
      break
    }
  }
  // Fallback: use the farthest soft wall
  if (!exitDoor && sortedByDist.length > 0) {
    exitDoor = { x: sortedByDist[0].x, y: sortedByDist[0].y }
  }

  // Place power-ups under ~30% of soft walls (excluding exit door)
  const powerUpTypes = Object.values(POWER_UP_TYPES)
  const powerUpMap = {}
  for (const cell of softWallCells) {
    if (exitDoor && cell.x === exitDoor.x && cell.y === exitDoor.y) continue
    if (Math.random() < 0.3) {
      const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
      powerUpMap[`${cell.x},${cell.y}`] = type
    }
  }

  // Place enemies on empty cells with manhattan distance >= 5 from start
  const enemies = []
  const emptyCells = []
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      if (grid[y][x] === CELL_TYPES.EMPTY && !clearZone.has(`${x},${y}`) && manhattan(x, y, 1, 1) >= 5) {
        emptyCells.push({ x, y })
      }
    }
  }

  // Shuffle and pick enemy positions
  for (let i = emptyCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[emptyCells[i], emptyCells[j]] = [emptyCells[j], emptyCells[i]]
  }

  const enemyCount = Math.min(config.enemyCount, emptyCells.length)
  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: emptyCells[i].x,
      y: emptyCells[i].y,
      alive: true,
      lastMoveTime: 0,
      moveDir: { x: 0, y: 0 },
    })
  }

  return { grid, playerStart, enemies, exitDoor, powerUpMap }
}

export { PAR_TIME }
