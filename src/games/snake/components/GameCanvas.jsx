import { useEffect, useRef, useCallback } from 'react'
import useSnakeStore from '../store'
import { difficulties, POWER_UPS, POWER_UP_CHANCE, POWER_UP_LIFETIME } from '../data/difficulty'
import sounds from '../sounds'

const CELL = 20 // pixels per cell

export default function GameCanvas() {
  const canvasRef = useRef(null)
  const scoreRef = useRef(null)
  const lengthRef = useRef(null)
  const difficulty = useSnakeStore((s) => s.difficulty)
  const finishGame = useSnakeStore((s) => s.finishGame)

  const finishGameRef = useRef(finishGame)
  finishGameRef.current = finishGame

  const setup = useCallback(() => {
    const config = difficulties[difficulty]
    if (!config) return null

    const W = config.gridWidth
    const H = config.gridHeight

    // Build initial snake in the center, moving right
    const startX = Math.floor(W / 2)
    const startY = Math.floor(H / 2)
    const snake = []
    for (let i = 0; i < config.initialLength; i++) {
      snake.push({ x: startX - i, y: startY })
    }

    // Build obstacle set for fast lookup
    const obstacleSet = new Set(config.obstacles.map((o) => `${o.x},${o.y}`))

    return {
      snake,
      dir: { x: 1, y: 0 }, // moving right
      nextDir: { x: 1, y: 0 },
      food: null,
      powerUp: null, // { x, y, type, spawnedAt }
      activePowerUp: null, // { type, expiresAt }
      score: 0,
      speed: config.speed,
      baseSpeed: config.speed,
      gameOver: false,
      started: false,
      startTime: null,
      gridW: W,
      gridH: H,
      config,
      obstacleSet,
    }
  }, [difficulty])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const state = setup()
    if (!state) return

    const W = state.gridW * CELL
    const H = state.gridH * CELL

    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    let intervalId = null
    let animId = null

    function updateHUD() {
      if (scoreRef.current) scoreRef.current.textContent = state.score
      if (lengthRef.current) lengthRef.current.textContent = state.snake.length
    }
    updateHUD()

    // --- Random position that doesn't collide with anything ---
    function randomFreeCell() {
      const occupied = new Set()
      for (const seg of state.snake) occupied.add(`${seg.x},${seg.y}`)
      if (state.food) occupied.add(`${state.food.x},${state.food.y}`)
      if (state.powerUp) occupied.add(`${state.powerUp.x},${state.powerUp.y}`)
      for (const key of state.obstacleSet) occupied.add(key)

      let x, y
      let attempts = 0
      do {
        x = Math.floor(Math.random() * state.gridW)
        y = Math.floor(Math.random() * state.gridH)
        attempts++
      } while (occupied.has(`${x},${y}`) && attempts < 200)

      return { x, y }
    }

    function spawnFood() {
      state.food = randomFreeCell()
    }
    spawnFood()

    function maybeSpawnPowerUp() {
      if (state.powerUp) return
      if (Math.random() > POWER_UP_CHANCE) return
      const types = Object.keys(POWER_UPS)
      const type = types[Math.floor(Math.random() * types.length)]
      state.powerUp = { ...randomFreeCell(), type, spawnedAt: Date.now() }
    }

    // --- Direction change (prevents 180° reversal) ---
    function setDirection(dx, dy) {
      if (state.dir.x === -dx && state.dir.y === -dy) return
      if (dx === 0 && dy === 0) return
      state.nextDir = { x: dx, y: dy }
      // Start the game on first input
      if (!state.started) {
        state.started = true
        state.startTime = Date.now()
        startGameLoop()
      }
    }

    // --- Input: keyboard ---
    function onKeyDown(e) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setDirection(0, -1)
          break
        case 'ArrowDown':
          e.preventDefault()
          setDirection(0, 1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          setDirection(-1, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          setDirection(1, 0)
          break
      }
    }

    // --- Input: swipe ---
    let touchStartX = 0
    let touchStartY = 0

    function onTouchStart(e) {
      e.preventDefault()
      const t = e.touches[0]
      touchStartX = t.clientX
      touchStartY = t.clientY
    }

    function onTouchEnd(e) {
      e.preventDefault()
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStartX
      const dy = t.clientY - touchStartY
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      // Minimum swipe distance
      if (Math.max(absDx, absDy) < 20) return

      if (absDx > absDy) {
        setDirection(dx > 0 ? 1 : -1, 0)
      } else {
        setDirection(0, dy > 0 ? 1 : -1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    // --- Game tick ---
    function tick() {
      if (state.gameOver) return

      // Apply queued direction
      state.dir = state.nextDir

      // Move head
      const head = state.snake[0]
      const newHead = { x: head.x + state.dir.x, y: head.y + state.dir.y }

      // Wall collision
      if (newHead.x < 0 || newHead.x >= state.gridW || newHead.y < 0 || newHead.y >= state.gridH) {
        endGame()
        return
      }

      // Self collision
      for (const seg of state.snake) {
        if (seg.x === newHead.x && seg.y === newHead.y) {
          endGame()
          return
        }
      }

      // Obstacle collision
      if (state.obstacleSet.has(`${newHead.x},${newHead.y}`)) {
        endGame()
        return
      }

      state.snake.unshift(newHead)

      // Food collision
      let ate = false
      if (state.food && newHead.x === state.food.x && newHead.y === state.food.y) {
        ate = true
        state.score += state.config.foodPoints
        sounds.eat()
        spawnFood()
        maybeSpawnPowerUp()
        updateHUD()
      } else {
        state.snake.pop()
      }

      // Power-up collision
      if (state.powerUp && newHead.x === state.powerUp.x && newHead.y === state.powerUp.y) {
        const pu = state.powerUp
        sounds.powerUp()

        if (pu.type === 'bonus') {
          state.score += POWER_UPS.bonus.points
          updateHUD()
        } else if (pu.type === 'slow') {
          state.speed = state.baseSpeed * 2 // slower = longer interval
          state.activePowerUp = { type: 'slow', expiresAt: Date.now() + POWER_UPS.slow.duration }
          restartInterval()
        } else if (pu.type === 'shrink') {
          const removeCount = Math.min(POWER_UPS.shrink.segments, state.snake.length - 1)
          for (let i = 0; i < removeCount; i++) state.snake.pop()
          updateHUD()
        }

        state.powerUp = null
      }

      // Expire power-up on ground
      if (state.powerUp && Date.now() - state.powerUp.spawnedAt > POWER_UP_LIFETIME) {
        state.powerUp = null
      }

      // Expire active power-up effect
      if (state.activePowerUp && Date.now() > state.activePowerUp.expiresAt) {
        state.speed = state.baseSpeed
        state.activePowerUp = null
        restartInterval()
      }
    }

    function endGame() {
      state.gameOver = true
      sounds.die()
      setTimeout(() => sounds.gameOver(), 300)
      clearInterval(intervalId)
      const time = Date.now() - (state.startTime || Date.now())
      finishGameRef.current({
        score: state.score,
        length: state.snake.length,
        time,
      })
    }

    function restartInterval() {
      clearInterval(intervalId)
      intervalId = setInterval(tick, state.speed)
    }

    function startGameLoop() {
      intervalId = setInterval(tick, state.speed)
    }

    // --- Drawing ---
    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Background
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, W, H)

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x <= state.gridW; x++) {
        ctx.beginPath()
        ctx.moveTo(x * CELL, 0)
        ctx.lineTo(x * CELL, H)
        ctx.stroke()
      }
      for (let y = 0; y <= state.gridH; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * CELL)
        ctx.lineTo(W, y * CELL)
        ctx.stroke()
      }

      // Obstacles
      for (const key of state.obstacleSet) {
        const [ox, oy] = key.split(',').map(Number)
        ctx.fillStyle = '#475569'
        ctx.fillRect(ox * CELL + 1, oy * CELL + 1, CELL - 2, CELL - 2)
        ctx.fillStyle = '#64748b'
        ctx.fillRect(ox * CELL + 2, oy * CELL + 2, CELL - 6, 3)
      }

      // Food
      if (state.food) {
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(state.food.x * CELL + CELL / 2, state.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
        ctx.fill()
        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.beginPath()
        ctx.arc(state.food.x * CELL + CELL / 2 - 2, state.food.y * CELL + CELL / 2 - 2, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Power-up
      if (state.powerUp) {
        const pu = state.powerUp
        const puConfig = POWER_UPS[pu.type]
        const cx = pu.x * CELL + CELL / 2
        const cy = pu.y * CELL + CELL / 2
        // Pulsing glow
        const pulse = 0.7 + Math.sin(Date.now() / 200) * 0.3
        ctx.globalAlpha = pulse
        ctx.fillStyle = puConfig.color
        ctx.beginPath()
        ctx.arc(cx, cy, CELL / 2 - 1, 0, Math.PI * 2)
        ctx.fill()
        // Symbol
        ctx.globalAlpha = 1
        ctx.fillStyle = '#000'
        ctx.font = 'bold 11px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const symbols = { bonus: '★', slow: '◷', shrink: '↓' }
        ctx.fillText(symbols[pu.type] || '?', cx, cy)
      }

      // Snake
      for (let i = state.snake.length - 1; i >= 0; i--) {
        const seg = state.snake[i]
        const isHead = i === 0

        if (isHead) {
          ctx.fillStyle = '#4ade80'
          ctx.beginPath()
          ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 5)
          ctx.fill()
          // Eyes
          ctx.fillStyle = '#000'
          const eyeOffset = 4
          if (state.dir.x === 1) {
            ctx.beginPath()
            ctx.arc(seg.x * CELL + CELL - eyeOffset, seg.y * CELL + 6, 2, 0, Math.PI * 2)
            ctx.arc(seg.x * CELL + CELL - eyeOffset, seg.y * CELL + CELL - 6, 2, 0, Math.PI * 2)
            ctx.fill()
          } else if (state.dir.x === -1) {
            ctx.beginPath()
            ctx.arc(seg.x * CELL + eyeOffset, seg.y * CELL + 6, 2, 0, Math.PI * 2)
            ctx.arc(seg.x * CELL + eyeOffset, seg.y * CELL + CELL - 6, 2, 0, Math.PI * 2)
            ctx.fill()
          } else if (state.dir.y === -1) {
            ctx.beginPath()
            ctx.arc(seg.x * CELL + 6, seg.y * CELL + eyeOffset, 2, 0, Math.PI * 2)
            ctx.arc(seg.x * CELL + CELL - 6, seg.y * CELL + eyeOffset, 2, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.beginPath()
            ctx.arc(seg.x * CELL + 6, seg.y * CELL + CELL - eyeOffset, 2, 0, Math.PI * 2)
            ctx.arc(seg.x * CELL + CELL - 6, seg.y * CELL + CELL - eyeOffset, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        } else {
          // Body segments with gradient fade
          const t = i / state.snake.length
          const r = Math.round(74 - t * 40)
          const g = Math.round(222 - t * 80)
          const b = Math.round(128 - t * 60)
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctx.beginPath()
          ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 4)
          ctx.fill()
        }
      }

      // Active power-up indicator
      if (state.activePowerUp) {
        const remaining = Math.max(0, state.activePowerUp.expiresAt - Date.now())
        const secs = Math.ceil(remaining / 1000)
        ctx.fillStyle = POWER_UPS[state.activePowerUp.type].color
        ctx.globalAlpha = 0.8
        ctx.font = 'bold 12px system-ui, sans-serif'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'top'
        ctx.fillText(`${POWER_UPS[state.activePowerUp.type].label} ${secs}s`, W - 8, 8)
        ctx.globalAlpha = 1
      }

      // "Swipe to start" text
      if (!state.started && !state.gameOver) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '14px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Swipe or press arrow keys to start', W / 2, H / 2 + 50)
      }

      if (!state.gameOver) {
        animId = requestAnimationFrame(draw)
      }
    }

    animId = requestAnimationFrame(draw)

    return () => {
      clearInterval(intervalId)
      cancelAnimationFrame(animId)
      window.removeEventListener('keydown', onKeyDown)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [difficulty, setup])

  const config = difficulties[difficulty]
  const canvasW = config ? config.gridWidth * CELL : 300
  const canvasH = config ? config.gridHeight * CELL : 400

  return (
    <div className="h-full w-full flex flex-col items-center bg-slate-950">
      {/* HUD */}
      <div className="w-full flex items-center justify-between px-4 py-2" style={{ maxWidth: canvasW }}>
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Length</span>
          <span className="text-white font-bold text-lg tabular-nums" ref={lengthRef}>
            0
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Score</span>
          <span className="text-white font-bold text-lg tabular-nums" ref={scoreRef}>
            0
          </span>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: canvasW, aspectRatio: `${canvasW} / ${canvasH}` }}
        className="touch-none"
      />
    </div>
  )
}
