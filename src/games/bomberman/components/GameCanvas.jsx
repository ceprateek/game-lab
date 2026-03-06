import { useEffect, useRef, useCallback } from 'react'
import useBombermanStore from '../store'
import {
  difficulties,
  generateMap,
  CELL_TYPES,
  POWER_UP_TYPES,
  BOMB_TIMER,
  EXPLOSION_DURATION,
  POINTS,
  PAR_TIME,
} from '../data/config'
import sounds from '../sounds'

const TARGET_W = 560

export default function GameCanvas() {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const scoreRef = useRef(null)
  const enemyCountRef = useRef(null)
  const bombCountRef = useRef(null)
  const rangeRef = useRef(null)
  const difficulty = useBombermanStore((s) => s.difficulty)
  const finishGame = useBombermanStore((s) => s.finishGame)

  const finishGameRef = useRef(finishGame)
  finishGameRef.current = finishGame

  const setup = useCallback(() => {
    const config = difficulties[difficulty]
    if (!config) return null

    const map = generateMap(difficulty)

    return {
      config,
      grid: map.grid,
      player: { x: map.playerStart.x, y: map.playerStart.y, alive: true, lastMoveTime: 0, dir: { x: 0, y: 1 } },
      enemies: map.enemies,
      bombs: [], // { x, y, placedAt, playerInside }
      explosions: [], // { cells: [{x,y}], startedAt }
      powerUpMap: map.powerUpMap, // hidden under soft walls
      activePowerUps: {}, // revealed: "x,y" -> type
      exitDoor: map.exitDoor, // { x, y }
      exitRevealed: false,
      maxBombs: config.startBombs,
      fireRange: config.fireRange,
      playerSpeed: config.playerSpeed,
      activeBombCount: 0,
      score: 0,
      enemiesKilled: 0,
      wallsDestroyed: 0,
      gameOver: false,
      won: false,
      started: false,
      startTime: null,
      pendingDir: null,
    }
  }, [difficulty])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const state = setup()
    if (!state) return

    const { config } = state
    const CELL = Math.floor(TARGET_W / config.gridWidth)
    const W = config.gridWidth * CELL
    const H = config.gridHeight * CELL

    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    let tickId = null
    let animId = null

    function updateHUD() {
      if (scoreRef.current) scoreRef.current.textContent = state.score
      if (enemyCountRef.current) enemyCountRef.current.textContent = state.enemies.filter((e) => e.alive).length
      if (bombCountRef.current) bombCountRef.current.textContent = `${state.maxBombs - state.activeBombCount}/${state.maxBombs}`
      if (rangeRef.current) rangeRef.current.textContent = state.fireRange
    }
    updateHUD()

    // --- Helpers ---
    function cellKey(x, y) {
      return `${x},${y}`
    }

    function isWalkable(x, y) {
      if (x < 0 || x >= config.gridWidth || y < 0 || y >= config.gridHeight) return false
      return state.grid[y][x] === CELL_TYPES.EMPTY
    }

    function hasBombAt(x, y) {
      return state.bombs.some((b) => b.x === x && b.y === y)
    }

    // --- Player movement ---
    function movePlayer(now) {
      if (!state.player.alive || state.gameOver) return
      if (!state.pendingDir) return
      if (now - state.player.lastMoveTime < state.playerSpeed) return

      const dx = state.pendingDir.x
      const dy = state.pendingDir.y
      const nx = state.player.x + dx
      const ny = state.player.y + dy

      if (!isWalkable(nx, ny)) return
      // Can't walk into bomb unless it's the one we're standing on
      if (hasBombAt(nx, ny)) return

      state.player.x = nx
      state.player.y = ny
      state.player.dir = { x: dx, y: dy }
      state.player.lastMoveTime = now

      // Mark bombs we've left
      for (const bomb of state.bombs) {
        if (bomb.playerInside && (bomb.x !== nx || bomb.y !== ny)) {
          bomb.playerInside = false
        }
      }

      // Check power-up collection
      const key = cellKey(nx, ny)
      if (state.activePowerUps[key]) {
        const type = state.activePowerUps[key]
        delete state.activePowerUps[key]
        sounds.powerUp()
        state.score += POINTS.powerup

        if (type === POWER_UP_TYPES.EXTRA_BOMB) {
          state.maxBombs++
        } else if (type === POWER_UP_TYPES.FIRE_RANGE) {
          state.fireRange++
        } else if (type === POWER_UP_TYPES.SPEED_BOOST) {
          state.playerSpeed = Math.max(100, state.playerSpeed - 30)
        }
        updateHUD()
      }

      // Check win: all enemies dead + on revealed exit door
      if (
        state.exitRevealed &&
        state.exitDoor &&
        nx === state.exitDoor.x &&
        ny === state.exitDoor.y &&
        state.enemies.every((e) => !e.alive)
      ) {
        winGame()
        return
      }

      // Check enemy collision
      for (const enemy of state.enemies) {
        if (enemy.alive && enemy.x === nx && enemy.y === ny) {
          loseGame()
          return
        }
      }
    }

    // --- Bomb placement ---
    function placeBomb() {
      if (!state.player.alive || state.gameOver) return
      if (state.activeBombCount >= state.maxBombs) return
      if (hasBombAt(state.player.x, state.player.y)) return

      if (!state.started) {
        state.started = true
        state.startTime = Date.now()
      }

      sounds.placeBomb()
      state.bombs.push({
        x: state.player.x,
        y: state.player.y,
        placedAt: Date.now(),
        playerInside: true,
      })
      state.activeBombCount++
      updateHUD()
    }

    // --- Explosions ---
    function explodeBomb(bomb) {
      sounds.explode()
      const cells = [{ x: bomb.x, y: bomb.y }]

      const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ]

      for (const dir of directions) {
        for (let i = 1; i <= state.fireRange; i++) {
          const fx = bomb.x + dir.x * i
          const fy = bomb.y + dir.y * i

          if (fx < 0 || fx >= config.gridWidth || fy < 0 || fy >= config.gridHeight) break
          if (state.grid[fy][fx] === CELL_TYPES.HARD_WALL) break

          cells.push({ x: fx, y: fy })

          if (state.grid[fy][fx] === CELL_TYPES.SOFT_WALL) {
            // Destroy soft wall
            state.grid[fy][fx] = CELL_TYPES.EMPTY
            state.wallsDestroyed++
            state.score += POINTS.wall

            // Reveal power-up or exit door
            const key = cellKey(fx, fy)
            if (state.powerUpMap[key]) {
              state.activePowerUps[key] = state.powerUpMap[key]
              delete state.powerUpMap[key]
            }
            if (state.exitDoor && fx === state.exitDoor.x && fy === state.exitDoor.y) {
              state.exitRevealed = true
            }

            break // Fire stops at soft wall
          }
        }
      }

      state.explosions.push({ cells, startedAt: Date.now() })

      // Build explosion set for fast lookup
      const explosionSet = new Set(cells.map((c) => cellKey(c.x, c.y)))

      // Check player hit
      if (state.player.alive && explosionSet.has(cellKey(state.player.x, state.player.y))) {
        loseGame()
      }

      // Check enemy hits
      for (const enemy of state.enemies) {
        if (enemy.alive && explosionSet.has(cellKey(enemy.x, enemy.y))) {
          enemy.alive = false
          state.enemiesKilled++
          state.score += POINTS.enemy
          sounds.enemyDeath()
          updateHUD()
        }
      }

      // Chain reactions: detonate other bombs caught in explosion
      const chainBombs = []
      for (let i = state.bombs.length - 1; i >= 0; i--) {
        const b = state.bombs[i]
        if (b !== bomb && explosionSet.has(cellKey(b.x, b.y))) {
          chainBombs.push(b)
          state.bombs.splice(i, 1)
          state.activeBombCount--
        }
      }

      // Process chain reactions iteratively
      for (const cb of chainBombs) {
        explodeBomb(cb)
      }

      updateHUD()
    }

    // --- Enemy AI ---
    function moveEnemies(now) {
      const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ]

      for (const enemy of state.enemies) {
        if (!enemy.alive) continue
        if (now - enemy.lastMoveTime < config.enemySpeed) continue

        // 70% chance to continue current direction
        let moved = false
        if (enemy.moveDir.x !== 0 || enemy.moveDir.y !== 0) {
          if (Math.random() < 0.7) {
            const nx = enemy.x + enemy.moveDir.x
            const ny = enemy.y + enemy.moveDir.y
            if (isWalkable(nx, ny) && !hasBombAt(nx, ny)) {
              enemy.x = nx
              enemy.y = ny
              enemy.lastMoveTime = now
              moved = true
            }
          }
        }

        if (!moved) {
          // Pick random direction
          const shuffled = [...dirs].sort(() => Math.random() - 0.5)
          for (const d of shuffled) {
            const nx = enemy.x + d.x
            const ny = enemy.y + d.y
            if (isWalkable(nx, ny) && !hasBombAt(nx, ny)) {
              enemy.x = nx
              enemy.y = ny
              enemy.moveDir = d
              enemy.lastMoveTime = now
              moved = true
              break
            }
          }
          if (!moved) {
            enemy.moveDir = { x: 0, y: 0 }
          }
        }

        // Check if enemy walked into player
        if (
          enemy.alive &&
          state.player.alive &&
          enemy.x === state.player.x &&
          enemy.y === state.player.y
        ) {
          loseGame()
        }
      }
    }

    // --- Win / Lose ---
    function winGame() {
      if (state.gameOver) return
      state.gameOver = true
      state.won = true
      sounds.levelComplete()

      const time = Date.now() - (state.startTime || Date.now())
      const timeSeconds = Math.floor(time / 1000)
      const timeBonus = Math.max(0, PAR_TIME - timeSeconds) * POINTS.time_bonus
      state.score += timeBonus

      finishGameRef.current({
        score: state.score,
        enemiesKilled: state.enemiesKilled,
        wallsDestroyed: state.wallsDestroyed,
        time,
        won: true,
      })
    }

    function loseGame() {
      if (state.gameOver) return
      state.gameOver = true
      state.won = false
      state.player.alive = false
      sounds.playerDeath()

      const time = Date.now() - (state.startTime || Date.now())
      finishGameRef.current({
        score: state.score,
        enemiesKilled: state.enemiesKilled,
        wallsDestroyed: state.wallsDestroyed,
        time,
        won: false,
      })
    }

    // --- Game tick (20Hz) ---
    function tick() {
      if (state.gameOver) return
      const now = Date.now()

      // Bomb timers
      for (let i = state.bombs.length - 1; i >= 0; i--) {
        const bomb = state.bombs[i]
        if (now - bomb.placedAt >= BOMB_TIMER) {
          state.bombs.splice(i, 1)
          state.activeBombCount--
          explodeBomb(bomb)
        }
      }

      // Explosion cleanup
      state.explosions = state.explosions.filter((e) => now - e.startedAt < EXPLOSION_DURATION)

      // Player movement
      movePlayer(now)

      // Enemy AI
      moveEnemies(now)
    }

    // --- Input: keyboard ---
    function onKeyDown(e) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          state.pendingDir = { x: 0, y: -1 }
          startIfNeeded()
          break
        case 'ArrowDown':
          e.preventDefault()
          state.pendingDir = { x: 0, y: 1 }
          startIfNeeded()
          break
        case 'ArrowLeft':
          e.preventDefault()
          state.pendingDir = { x: -1, y: 0 }
          startIfNeeded()
          break
        case 'ArrowRight':
          e.preventDefault()
          state.pendingDir = { x: 1, y: 0 }
          startIfNeeded()
          break
        case ' ':
          e.preventDefault()
          placeBomb()
          break
      }
    }

    function startIfNeeded() {
      if (!state.started) {
        state.started = true
        state.startTime = Date.now()
      }
    }

    // --- Input: touch swipe ---
    let touchStartX = 0
    let touchStartY = 0
    const SWIPE_THRESHOLD = 15

    function onTouchStart(e) {
      e.preventDefault()
      const t = e.touches[0]
      touchStartX = t.clientX
      touchStartY = t.clientY
    }

    function onTouchMove(e) {
      e.preventDefault()
      const t = e.touches[0]
      const dx = t.clientX - touchStartX
      const dy = t.clientY - touchStartY

      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return

      if (Math.abs(dx) > Math.abs(dy)) {
        state.pendingDir = { x: dx > 0 ? 1 : -1, y: 0 }
      } else {
        state.pendingDir = { x: 0, y: dy > 0 ? 1 : -1 }
      }

      touchStartX = t.clientX
      touchStartY = t.clientY
      startIfNeeded()
    }

    const wrapper = wrapperRef.current

    window.addEventListener('keydown', onKeyDown)
    wrapper.addEventListener('touchstart', onTouchStart, { passive: false })
    wrapper.addEventListener('touchmove', onTouchMove, { passive: false })

    // --- Drawing ---
    function draw() {
      ctx.clearRect(0, 0, W, H)

      const now = Date.now()

      // Background
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, W, H)

      // Subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x <= config.gridWidth; x++) {
        ctx.beginPath()
        ctx.moveTo(x * CELL, 0)
        ctx.lineTo(x * CELL, H)
        ctx.stroke()
      }
      for (let y = 0; y <= config.gridHeight; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * CELL)
        ctx.lineTo(W, y * CELL)
        ctx.stroke()
      }

      // Draw grid cells
      for (let y = 0; y < config.gridHeight; y++) {
        for (let x = 0; x < config.gridWidth; x++) {
          const cell = state.grid[y][x]
          const px = x * CELL
          const py = y * CELL

          if (cell === CELL_TYPES.HARD_WALL) {
            // Dark gray with 3D top edge
            ctx.fillStyle = '#374151'
            ctx.beginPath()
            ctx.roundRect(px + 1, py + 1, CELL - 2, CELL - 2, 3)
            ctx.fill()
            // 3D top highlight
            ctx.fillStyle = '#4b5563'
            ctx.fillRect(px + 2, py + 1, CELL - 4, Math.max(3, CELL * 0.15))
          } else if (cell === CELL_TYPES.SOFT_WALL) {
            // Brown with brick-line pattern
            ctx.fillStyle = '#92400e'
            ctx.beginPath()
            ctx.roundRect(px + 1, py + 1, CELL - 2, CELL - 2, 2)
            ctx.fill()
            // Brick lines
            ctx.strokeStyle = '#78350f'
            ctx.lineWidth = 1
            const midY = py + CELL / 2
            ctx.beginPath()
            ctx.moveTo(px + 2, midY)
            ctx.lineTo(px + CELL - 2, midY)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(px + CELL / 2, py + 2)
            ctx.lineTo(px + CELL / 2, midY)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(px + CELL / 4, midY)
            ctx.lineTo(px + CELL / 4, py + CELL - 2)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(px + CELL * 3 / 4, midY)
            ctx.lineTo(px + CELL * 3 / 4, py + CELL - 2)
            ctx.stroke()
          }
        }
      }

      // Exit door (if revealed)
      if (state.exitRevealed && state.exitDoor) {
        const dx = state.exitDoor.x * CELL
        const dy = state.exitDoor.y * CELL
        // Pulsing glow
        const pulse = 0.5 + Math.sin(now / 300) * 0.3
        ctx.fillStyle = `rgba(34, 197, 94, ${pulse * 0.3})`
        ctx.fillRect(dx - 2, dy - 2, CELL + 4, CELL + 4)
        // Door
        ctx.fillStyle = '#16a34a'
        ctx.beginPath()
        ctx.roundRect(dx + 2, dy + 2, CELL - 4, CELL - 4, 3)
        ctx.fill()
        // Door handle
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.arc(dx + CELL * 0.65, dy + CELL / 2, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Active power-ups (revealed)
      for (const [key, type] of Object.entries(state.activePowerUps)) {
        const [px, py] = key.split(',').map(Number)
        const cx = px * CELL + CELL / 2
        const cy = py * CELL + CELL / 2

        const pulse = 0.7 + Math.sin(now / 200) * 0.3
        let color
        if (type === POWER_UP_TYPES.EXTRA_BOMB) color = '#3b82f6'
        else if (type === POWER_UP_TYPES.FIRE_RANGE) color = '#ef4444'
        else color = '#22c55e'

        ctx.globalAlpha = pulse
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(cx, cy, CELL / 2 - 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        // Symbol
        ctx.fillStyle = '#fff'
        ctx.font = `bold ${Math.round(CELL * 0.45)}px system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const symbols = {
          [POWER_UP_TYPES.EXTRA_BOMB]: 'B',
          [POWER_UP_TYPES.FIRE_RANGE]: 'F',
          [POWER_UP_TYPES.SPEED_BOOST]: 'S',
        }
        ctx.fillText(symbols[type] || '?', cx, cy)
      }

      // Bombs
      for (const bomb of state.bombs) {
        const bx = bomb.x * CELL + CELL / 2
        const by = bomb.y * CELL + CELL / 2
        const elapsed = now - bomb.placedAt
        const progress = Math.min(1, elapsed / BOMB_TIMER)

        // Pulsing size
        const pulseSize = 1 + Math.sin(elapsed / 100) * 0.1 * (1 + progress)
        const radius = (CELL / 2 - 3) * pulseSize

        // Bomb body
        ctx.fillStyle = '#1f2937'
        ctx.beginPath()
        ctx.arc(bx, by, radius, 0, Math.PI * 2)
        ctx.fill()

        // Fuse (shrinks as timer progresses)
        const fuseLen = CELL * 0.35 * (1 - progress)
        if (fuseLen > 1) {
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(bx, by - radius + 2)
          ctx.lineTo(bx + fuseLen * 0.5, by - radius - fuseLen)
          ctx.stroke()

          // Spark
          ctx.fillStyle = '#fbbf24'
          ctx.beginPath()
          ctx.arc(bx + fuseLen * 0.5, by - radius - fuseLen, 2 + Math.random(), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Explosions
      for (const explosion of state.explosions) {
        const elapsed = now - explosion.startedAt
        const alpha = Math.max(0, 1 - elapsed / EXPLOSION_DURATION)

        for (const cell of explosion.cells) {
          const ex = cell.x * CELL
          const ey = cell.y * CELL

          // Orange-yellow fire
          ctx.globalAlpha = alpha * 0.8
          ctx.fillStyle = '#f97316'
          ctx.fillRect(ex + 1, ey + 1, CELL - 2, CELL - 2)

          ctx.globalAlpha = alpha * 0.6
          ctx.fillStyle = '#fbbf24'
          ctx.beginPath()
          ctx.arc(ex + CELL / 2, ey + CELL / 2, CELL / 3, 0, Math.PI * 2)
          ctx.fill()

          ctx.globalAlpha = alpha * 0.4
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          ctx.arc(ex + CELL / 2, ey + CELL / 2, CELL / 5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      // Enemies
      for (const enemy of state.enemies) {
        if (!enemy.alive) continue
        const ex = enemy.x * CELL + CELL / 2
        const ey = enemy.y * CELL + CELL / 2

        // Red circle body
        ctx.fillStyle = '#dc2626'
        ctx.beginPath()
        ctx.arc(ex, ey, CELL / 2 - 2, 0, Math.PI * 2)
        ctx.fill()

        // Angry face: eyes
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(ex - CELL * 0.12, ey - CELL * 0.06, CELL * 0.08, 0, Math.PI * 2)
        ctx.arc(ex + CELL * 0.12, ey - CELL * 0.06, CELL * 0.08, 0, Math.PI * 2)
        ctx.fill()

        // Pupils
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(ex - CELL * 0.12, ey - CELL * 0.06, CELL * 0.04, 0, Math.PI * 2)
        ctx.arc(ex + CELL * 0.12, ey - CELL * 0.06, CELL * 0.04, 0, Math.PI * 2)
        ctx.fill()

        // Angry eyebrows
        ctx.strokeStyle = '#7f1d1d'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(ex - CELL * 0.2, ey - CELL * 0.18)
        ctx.lineTo(ex - CELL * 0.05, ey - CELL * 0.14)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(ex + CELL * 0.2, ey - CELL * 0.18)
        ctx.lineTo(ex + CELL * 0.05, ey - CELL * 0.14)
        ctx.stroke()

        // Frown
        ctx.strokeStyle = '#7f1d1d'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(ex, ey + CELL * 0.18, CELL * 0.1, Math.PI, 0)
        ctx.stroke()
      }

      // Bomb range indicator around player
      if (state.player.alive && !state.gameOver) {
        const rangeDirs = [
          { x: 1, y: 0 },
          { x: -1, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: -1 },
        ]
        ctx.globalAlpha = 0.18 + Math.sin(now / 400) * 0.06
        for (const dir of rangeDirs) {
          for (let i = 1; i <= state.fireRange; i++) {
            const rx = state.player.x + dir.x * i
            const ry = state.player.y + dir.y * i
            if (rx < 0 || rx >= config.gridWidth || ry < 0 || ry >= config.gridHeight) break
            if (state.grid[ry][rx] === CELL_TYPES.HARD_WALL) break
            ctx.fillStyle = '#f97316'
            ctx.fillRect(rx * CELL + 2, ry * CELL + 2, CELL - 4, CELL - 4)
            if (state.grid[ry][rx] === CELL_TYPES.SOFT_WALL) break
          }
        }
        ctx.globalAlpha = 1
      }

      // Player
      if (state.player.alive) {
        const px = state.player.x * CELL + CELL / 2
        const py = state.player.y * CELL + CELL / 2

        // Blue circle body
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.arc(px, py, CELL / 2 - 2, 0, Math.PI * 2)
        ctx.fill()

        // Directional face
        const d = state.player.dir
        const eyeOff = CELL * 0.12

        // Eyes
        ctx.fillStyle = '#fff'
        if (d.x === 0) {
          // Up or down
          ctx.beginPath()
          ctx.arc(px - eyeOff, py + d.y * CELL * 0.04 - CELL * 0.04, CELL * 0.08, 0, Math.PI * 2)
          ctx.arc(px + eyeOff, py + d.y * CELL * 0.04 - CELL * 0.04, CELL * 0.08, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Left or right
          ctx.beginPath()
          ctx.arc(px + d.x * CELL * 0.04, py - eyeOff, CELL * 0.08, 0, Math.PI * 2)
          ctx.arc(px + d.x * CELL * 0.04, py + eyeOff * 0.3, CELL * 0.08, 0, Math.PI * 2)
          ctx.fill()
        }

        // Pupils (shifted in direction)
        ctx.fillStyle = '#1e3a5f'
        if (d.x === 0) {
          ctx.beginPath()
          ctx.arc(px - eyeOff, py + d.y * CELL * 0.08 - CELL * 0.04, CELL * 0.04, 0, Math.PI * 2)
          ctx.arc(px + eyeOff, py + d.y * CELL * 0.08 - CELL * 0.04, CELL * 0.04, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(px + d.x * CELL * 0.08, py - eyeOff, CELL * 0.04, 0, Math.PI * 2)
          ctx.arc(px + d.x * CELL * 0.08, py + eyeOff * 0.3, CELL * 0.04, 0, Math.PI * 2)
          ctx.fill()
        }

        // Smile
        ctx.strokeStyle = '#1e3a5f'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(px, py + CELL * 0.1, CELL * 0.1, 0, Math.PI)
        ctx.stroke()
      }

      // "Swipe/press to start" text
      if (!state.started && !state.gameOver) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '13px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Arrow keys + Space to play', W / 2, H - 20)
      }

      if (!state.gameOver) {
        animId = requestAnimationFrame(draw)
      }
    }

    // Start game loop
    tickId = setInterval(tick, 50)
    animId = requestAnimationFrame(draw)

    return () => {
      clearInterval(tickId)
      cancelAnimationFrame(animId)
      window.removeEventListener('keydown', onKeyDown)
      wrapper.removeEventListener('touchstart', onTouchStart)
      wrapper.removeEventListener('touchmove', onTouchMove)
    }
  }, [difficulty, setup])

  const config = difficulties[difficulty]
  const cellSize = config ? Math.floor(TARGET_W / config.gridWidth) : 26
  const canvasW = config ? config.gridWidth * cellSize : TARGET_W
  const canvasH = config ? config.gridHeight * cellSize : 286

  return (
    <div ref={wrapperRef} className="h-full w-full flex flex-col items-center bg-slate-950 touch-none">
      {/* HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2" style={{ maxWidth: canvasW }}>
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Score</span>
          <span className="text-white font-bold text-lg tabular-nums" ref={scoreRef}>
            0
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Enemies</span>
          <span className="text-white font-bold text-lg tabular-nums" ref={enemyCountRef}>
            0
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Bombs</span>
          <span className="text-white font-bold text-lg tabular-nums" ref={bombCountRef}>
            0
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Range</span>
          <span className="text-orange-400 font-bold text-lg tabular-nums" ref={rangeRef}>
            0
          </span>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: canvasW, aspectRatio: `${canvasW} / ${canvasH}` }}
      />

      {/* Touch bomb button */}
      <div className="mt-4 flex justify-center">
        <button
          onTouchStart={(e) => {
            e.preventDefault()
            // Trigger bomb placement via a custom event approach
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
          }}
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
          }}
          className="w-20 h-20 rounded-full bg-orange-500 active:bg-orange-600 border-4 border-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/30 transition-colors"
        >
          <span className="text-white font-bold text-2xl select-none">BOMB</span>
        </button>
      </div>
    </div>
  )
}
