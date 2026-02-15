import { useEffect, useRef, useCallback } from 'react'
import useBrickBreakerStore from '../store'
import { difficulties, BRICK_COLORS, POINTS_PER_HIT } from '../data/levels'
import sounds from '../sounds'

// Logical canvas dimensions
const W = 400
const H = 600

const BALL_RADIUS = 6
const BRICK_ROWS_TOP = 50 // top offset for brick grid
const BRICK_H = 18
const BRICK_GAP = 4
const PADDLE_H = 14
const PADDLE_Y = H - 40

export default function GameCanvas() {
  const canvasRef = useRef(null)
  const scoreRef = useRef(null)
  const livesRef = useRef(null)
  const knobRef = useRef(null)
  const trackRef = useRef(null)
  const difficulty = useBrickBreakerStore((s) => s.difficulty)
  const finishGame = useBrickBreakerStore((s) => s.finishGame)

  const finishGameRef = useRef(finishGame)
  finishGameRef.current = finishGame

  const setup = useCallback(() => {
    const config = difficulties[difficulty]
    if (!config) return null

    const layout = config.layout
    const cols = layout[0].length
    const brickW = (W - BRICK_GAP * (cols + 1)) / cols
    const bricks = []
    let totalBricks = 0

    for (let r = 0; r < layout.length; r++) {
      for (let c = 0; c < cols; c++) {
        const type = layout[r][c]
        if (type === 0) continue
        totalBricks++
        bricks.push({
          x: BRICK_GAP + c * (brickW + BRICK_GAP),
          y: BRICK_ROWS_TOP + r * (BRICK_H + BRICK_GAP),
          w: brickW,
          h: BRICK_H,
          hits: type,
          alive: true,
        })
      }
    }

    return {
      paddleX: W / 2 - config.paddleWidth / 2,
      paddleW: config.paddleWidth,
      ballX: W / 2,
      ballY: PADDLE_Y - BALL_RADIUS,
      ballDX: 0,
      ballDY: 0,
      launched: false,
      speed: config.ballSpeed,
      speedIncrement: config.speedIncrement,
      lives: config.lives,
      score: 0,
      bricks,
      totalBricks,
      bricksCleared: 0,
      gameOver: false,
    }
  }, [difficulty])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    let state = setup()
    if (!state) return

    let animId = null

    function updateHUD() {
      if (scoreRef.current) scoreRef.current.textContent = state.score
      if (livesRef.current) livesRef.current.textContent = '♥'.repeat(state.lives)
    }
    updateHUD()

    function launchBall() {
      if (state.launched || state.gameOver) return
      state.launched = true
      sounds.launch()
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5
      state.ballDX = Math.cos(angle) * state.speed
      state.ballDY = Math.sin(angle) * state.speed
    }

    function movePaddle(x) {
      state.paddleX = Math.max(0, Math.min(W - state.paddleW, x - state.paddleW / 2))
      if (!state.launched) {
        state.ballX = state.paddleX + state.paddleW / 2
      }
    }

    function updateKnob() {
      if (knobRef.current && trackRef.current) {
        const pct = (state.paddleX + state.paddleW / 2) / W
        const trackW = trackRef.current.offsetWidth
        const knobW = knobRef.current.offsetWidth
        knobRef.current.style.left = `${pct * trackW - knobW / 2}px`
      }
    }

    // Convert a clientX on the track to canvas-space X
    function trackXToCanvasX(clientX) {
      const track = trackRef.current
      if (!track) return W / 2
      const rect = track.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return pct * W
    }

    // --- Input handlers ---
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      const scaleX = W / rect.width
      const x = (e.clientX - rect.left) * scaleX
      movePaddle(x)
    }

    function onMouseClick() {
      launchBall()
    }

    // Track touch handlers (the knob area below the canvas)
    const track = trackRef.current
    function onTrackTouchMove(e) {
      e.preventDefault()
      const touch = e.touches[0]
      movePaddle(trackXToCanvasX(touch.clientX))
    }
    function onTrackTouchStart(e) {
      e.preventDefault()
      const touch = e.touches[0]
      movePaddle(trackXToCanvasX(touch.clientX))
      launchBall()
    }
    function onTrackMouseMove(e) {
      if (e.buttons === 1) {
        movePaddle(trackXToCanvasX(e.clientX))
      }
    }
    function onTrackClick() {
      launchBall()
    }

    // Canvas touch handlers (keep for backward compat)
    function onTouchMove(e) {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const scaleX = W / rect.width
      const x = (touch.clientX - rect.left) * scaleX
      movePaddle(x)
    }

    function onTouchStart(e) {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const scaleX = W / rect.width
      const x = (touch.clientX - rect.left) * scaleX
      movePaddle(x)
      launchBall()
    }

    const keysDown = new Set()
    function onKeyDown(e) {
      keysDown.add(e.key)
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        launchBall()
      }
    }
    function onKeyUp(e) {
      keysDown.delete(e.key)
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onMouseClick)
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    if (track) {
      track.addEventListener('touchmove', onTrackTouchMove, { passive: false })
      track.addEventListener('touchstart', onTrackTouchStart, { passive: false })
      track.addEventListener('mousemove', onTrackMouseMove)
      track.addEventListener('click', onTrackClick)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // --- Physics ---
    function tick() {
      if (state.gameOver) return

      // Keyboard paddle movement
      const paddleSpeed = 7
      if (keysDown.has('ArrowLeft')) movePaddle(state.paddleX + state.paddleW / 2 - paddleSpeed)
      if (keysDown.has('ArrowRight')) movePaddle(state.paddleX + state.paddleW / 2 + paddleSpeed)

      if (!state.launched) return

      // Move ball
      state.ballX += state.ballDX
      state.ballY += state.ballDY

      // Wall collisions
      if (state.ballX - BALL_RADIUS <= 0) {
        state.ballX = BALL_RADIUS
        state.ballDX = Math.abs(state.ballDX)
        sounds.wallHit()
      }
      if (state.ballX + BALL_RADIUS >= W) {
        state.ballX = W - BALL_RADIUS
        state.ballDX = -Math.abs(state.ballDX)
        sounds.wallHit()
      }
      if (state.ballY - BALL_RADIUS <= 0) {
        state.ballY = BALL_RADIUS
        state.ballDY = Math.abs(state.ballDY)
        sounds.wallHit()
      }

      // Bottom edge — lose life
      if (state.ballY + BALL_RADIUS >= H) {
        state.lives--
        sounds.loseLife()
        updateHUD()
        if (state.lives <= 0) {
          state.gameOver = true
          sounds.gameOver()
          finishGameRef.current({
            score: state.score,
            bricksCleared: state.bricksCleared,
            totalBricks: state.totalBricks,
            lives: 0,
            won: false,
          })
          return
        }
        // Reset ball on paddle
        state.launched = false
        state.ballX = state.paddleX + state.paddleW / 2
        state.ballY = PADDLE_Y - BALL_RADIUS
        state.ballDX = 0
        state.ballDY = 0
        return
      }

      // Paddle collision
      if (
        state.ballDY > 0 &&
        state.ballY + BALL_RADIUS >= PADDLE_Y &&
        state.ballY + BALL_RADIUS <= PADDLE_Y + PADDLE_H + 4 &&
        state.ballX >= state.paddleX - BALL_RADIUS &&
        state.ballX <= state.paddleX + state.paddleW + BALL_RADIUS
      ) {
        // Reflect with angle based on hit position
        const hitPos = (state.ballX - state.paddleX) / state.paddleW // 0..1
        const angle = -Math.PI / 2 + (hitPos - 0.5) * (Math.PI * 0.7) // -125° to -55°
        const currentSpeed = Math.sqrt(state.ballDX ** 2 + state.ballDY ** 2)
        state.ballDX = Math.cos(angle) * currentSpeed
        state.ballDY = Math.sin(angle) * currentSpeed
        state.ballY = PADDLE_Y - BALL_RADIUS
        sounds.paddleHit()
      }

      // Brick collisions (AABB-circle nearest-point)
      for (const brick of state.bricks) {
        if (!brick.alive) continue

        // Find nearest point on brick to ball center
        const nearX = Math.max(brick.x, Math.min(state.ballX, brick.x + brick.w))
        const nearY = Math.max(brick.y, Math.min(state.ballY, brick.y + brick.h))
        const distX = state.ballX - nearX
        const distY = state.ballY - nearY
        const distSq = distX * distX + distY * distY

        if (distSq <= BALL_RADIUS * BALL_RADIUS) {
          // Hit!
          brick.hits--
          if (brick.hits <= 0) {
            brick.alive = false
            state.bricksCleared++
            sounds.brickBreak()
          } else {
            sounds.brickHit()
          }
          state.score += POINTS_PER_HIT
          updateHUD()

          // Reflect based on overlap axis
          const overlapX = BALL_RADIUS - Math.abs(distX)
          const overlapY = BALL_RADIUS - Math.abs(distY)

          if (overlapX < overlapY) {
            state.ballDX = -state.ballDX
            state.ballX += distX > 0 ? overlapX : -overlapX
          } else {
            state.ballDY = -state.ballDY
            state.ballY += distY > 0 ? overlapY : -overlapY
          }

          // Speed increase every 10 bricks
          if (state.bricksCleared % 10 === 0 && state.bricksCleared > 0) {
            const currentSpeed = Math.sqrt(state.ballDX ** 2 + state.ballDY ** 2)
            const newSpeed = currentSpeed + state.speedIncrement
            const ratio = newSpeed / currentSpeed
            state.ballDX *= ratio
            state.ballDY *= ratio
          }

          // Check win
          if (state.bricksCleared >= state.totalBricks) {
            state.gameOver = true
            sounds.win()
            finishGameRef.current({
              score: state.score,
              bricksCleared: state.bricksCleared,
              totalBricks: state.totalBricks,
              lives: state.lives,
              won: true,
            })
            return
          }

          break // One brick collision per frame
        }
      }
    }

    // --- Drawing ---
    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
      bgGrad.addColorStop(0, '#0f172a')
      bgGrad.addColorStop(1, '#1e1b4b')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Bricks
      for (const brick of state.bricks) {
        if (!brick.alive) continue
        const colors = BRICK_COLORS[brick.hits] || BRICK_COLORS[1]
        const r = 4

        // Brick body
        ctx.fillStyle = colors.fill
        ctx.beginPath()
        ctx.roundRect(brick.x, brick.y, brick.w, brick.h, r)
        ctx.fill()

        // Brick border
        ctx.strokeStyle = colors.stroke
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(brick.x, brick.y, brick.w, brick.h, r)
        ctx.stroke()

        // Highlight
        ctx.fillStyle = colors.highlight
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.roundRect(brick.x + 2, brick.y + 2, brick.w - 4, 5, 2)
        ctx.fill()
        ctx.globalAlpha = 1.0
      }

      // Paddle
      const padGrad = ctx.createLinearGradient(0, PADDLE_Y, 0, PADDLE_Y + PADDLE_H)
      padGrad.addColorStop(0, '#818cf8')
      padGrad.addColorStop(1, '#4f46e5')
      ctx.fillStyle = padGrad
      ctx.beginPath()
      ctx.roundRect(state.paddleX, PADDLE_Y, state.paddleW, PADDLE_H, 7)
      ctx.fill()

      // Paddle highlight
      ctx.fillStyle = 'rgba(199, 210, 254, 0.4)'
      ctx.beginPath()
      ctx.roundRect(state.paddleX + 4, PADDLE_Y + 2, state.paddleW - 8, 4, 2)
      ctx.fill()

      // Ball
      ctx.save()
      ctx.shadowColor = '#ffffff'
      ctx.shadowBlur = 10
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(state.ballX, state.ballY, BALL_RADIUS, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // "Tap to launch" text
      if (!state.launched && !state.gameOver) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '14px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Tap or press Space to launch', W / 2, H / 2)
      }

      updateKnob()
    }

    function loop() {
      tick()
      draw()
      if (!state.gameOver) {
        animId = requestAnimationFrame(loop)
      }
    }
    animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onMouseClick)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchstart', onTouchStart)
      if (track) {
        track.removeEventListener('touchmove', onTrackTouchMove)
        track.removeEventListener('touchstart', onTrackTouchStart)
        track.removeEventListener('mousemove', onTrackMouseMove)
        track.removeEventListener('click', onTrackClick)
      }
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [difficulty, setup])

  return (
    <div className="h-full w-full flex flex-col items-center bg-slate-950">
      {/* HUD */}
      <div className="w-full max-w-[400px] flex items-center justify-between px-4 py-2">
        <div className="text-red-400 text-lg tracking-wider" ref={livesRef}>
          ♥♥♥
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
        style={{ width: '100%', maxWidth: 400, aspectRatio: `${W} / ${H}` }}
        className="touch-none"
      />

      {/* Touch control track */}
      <div
        ref={trackRef}
        className="w-full max-w-[400px] mt-3 relative touch-none select-none"
        style={{ height: 56 }}
      >
        {/* Track rail */}
        <div className="absolute top-1/2 left-4 right-4 h-1.5 -translate-y-1/2 rounded-full bg-white/10" />
        {/* Knob */}
        <div
          ref={knobRef}
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-indigo-400 border-2 border-indigo-300 shadow-lg shadow-indigo-500/30"
          style={{ width: 44, height: 44 }}
        >
          <div className="absolute inset-1.5 rounded-full bg-indigo-300/30" />
        </div>
      </div>
    </div>
  )
}
